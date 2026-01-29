// Package repository provides sharded repository implementations.
//
// This file implements a sharded user repository that distributes users
// across multiple database shards using consistent hashing.
//
// # Routing Strategy
//
// - Single-key operations (GetByID, Create, Update, Delete): Route to specific shard
// - Multi-key operations (GetAll, GetByName): Scatter-gather across all shards
//
// # Example
//
//	repo := NewShardedUserRepository(shardManager)
//
//	// Single-shard operation (fast)
//	user, err := repo.FindByID(ctx, "user-uuid")
//
//	// Multi-shard operation (scatter-gather)
//	users, err := repo.FindAll(ctx, &Pagination{Limit: 100})
package repository

import (
	"context"
	"fmt"
	"sync"

	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
	"github.com/alailsonko/messenger-clone/server/internal/domain/repository"
	shardpkg "github.com/alailsonko/messenger-clone/server/internal/infra/database/shard"
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/common"
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ShardedUserRepository implements UserRepository with sharding support
//
// This repository routes operations to the appropriate shard based on user ID.
// It uses consistent hashing to ensure the same user always goes to the same shard.
type ShardedUserRepository struct {
	// shardManager handles shard selection and connections
	shardManager *shardpkg.ShardManager
}

// NewShardedUserRepository creates a new sharded user repository
func NewShardedUserRepository(sm *shardpkg.ShardManager) repository.UserRepository {
	return &ShardedUserRepository{
		shardManager: sm,
	}
}

// ============================================================================
// Single-Shard Operations (Fast Path)
// ============================================================================

// FindByID retrieves a user by ID from the appropriate shard
//
// This is a single-shard operation - it only queries one database.
// The shard is determined by hashing the user ID.
func (r *ShardedUserRepository) FindByID(ctx context.Context, id string) (*entity.User, error) {
	// 1. Determine which shard owns this user
	s := r.shardManager.GetShardForKey(id)

	// 2. Query that shard's read replica
	var userModel models.UserModel
	err := s.ReadDB.WithContext(ctx).
		Select("id", "first_name", "last_name", "created_at", "updated_at").
		Where("id = ?", id).
		Take(&userModel).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Not found
		}
		return nil, fmt.Errorf("shard %d: %w", s.ID, err)
	}

	user := toUserEntity(userModel)
	return &user, nil
}

// Create inserts a new user into the appropriate shard
//
// The user's ID is used to determine which shard will store the user.
// If the user doesn't have an ID, one will be generated.
func (r *ShardedUserRepository) Create(ctx context.Context, user *entity.User) error {
	// Ensure user has an ID for shard routing
	if user.ID == "" {
		user.ID = uuid.New().String()
	}

	// 1. Determine which shard owns this user
	s := r.shardManager.GetShardForKey(user.ID)

	// 2. Insert into that shard's primary
	userModel := shardedToUserModel(user)
	if err := s.WriteDB.WithContext(ctx).Create(&userModel).Error; err != nil {
		return fmt.Errorf("shard %d: %w", s.ID, err)
	}

	// Update entity with generated fields
	user.ID = userModel.Id.String()
	user.CreatedAt = userModel.CreatedAt
	user.UpdatedAt = userModel.UpdatedAt

	return nil
}

// Update modifies an existing user in its shard
func (r *ShardedUserRepository) Update(ctx context.Context, user *entity.User) error {
	// 1. Determine which shard owns this user
	s := r.shardManager.GetShardForKey(user.ID)

	// 2. Update in that shard's primary
	userModel := shardedToUserModel(user)
	result := s.WriteDB.WithContext(ctx).
		Model(&userModel).
		Updates(map[string]interface{}{
			"first_name": user.FirstName,
			"last_name":  user.LastName,
		})

	if result.Error != nil {
		return fmt.Errorf("shard %d: %w", s.ID, result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("user not found on shard %d", s.ID)
	}

	return nil
}

// Delete removes a user from its shard
func (r *ShardedUserRepository) Delete(ctx context.Context, id string) error {
	// 1. Determine which shard owns this user
	s := r.shardManager.GetShardForKey(id)

	// 2. Delete from that shard's primary
	result := s.WriteDB.WithContext(ctx).
		Where("id = ?", id).
		Delete(&models.UserModel{})

	if result.Error != nil {
		return fmt.Errorf("shard %d: %w", s.ID, result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("user not found on shard %d", s.ID)
	}

	return nil
}

// ============================================================================
// Multi-Shard Operations (Scatter-Gather)
// ============================================================================

// FindAll retrieves users from ALL shards using scatter-gather pattern
//
// This operation queries all shards in parallel and merges the results.
// It's slower than single-shard operations because:
// - Queries all shards
// - Total latency = slowest shard's latency
// - More network round trips
//
// Consider using pagination to limit the data transferred.
func (r *ShardedUserRepository) FindAll(ctx context.Context, pagination *repository.Pagination) ([]entity.User, error) {
	shards := r.shardManager.GetAllShards()

	// Calculate per-shard limits
	// If requesting 100 users total, we ask each shard for ceil(100/numShards) users
	// Then trim to exactly 100 after merging
	limit := 100
	offset := 0
	if pagination != nil {
		if pagination.Limit > 0 && pagination.Limit <= 1000 {
			limit = pagination.Limit
		}
		if pagination.Offset >= 0 {
			offset = pagination.Offset
		}
	}

	// For scatter-gather, we need to get more from each shard
	// because we can't efficiently do distributed offset
	perShardLimit := limit + offset // Get enough to cover offset + limit

	// Scatter: Query all shards in parallel
	type shardResult struct {
		shardID int
		users   []entity.User
		err     error
	}

	resultChan := make(chan shardResult, len(shards))
	var wg sync.WaitGroup

	for _, s := range shards {
		wg.Add(1)
		go func(sh *shardpkg.Shard) {
			defer wg.Done()

			var userModels []models.UserModel
			err := sh.ReadDB.WithContext(ctx).
				Select("id", "first_name", "last_name", "created_at", "updated_at").
				Order("created_at DESC").
				Limit(perShardLimit).
				Find(&userModels).Error

			if err != nil {
				resultChan <- shardResult{shardID: sh.ID, err: err}
				return
			}

			users := make([]entity.User, len(userModels))
			for i, m := range userModels {
				users[i] = shardedToUserEntity(m)
			}

			resultChan <- shardResult{shardID: sh.ID, users: users}
		}(s)
	}

	// Wait for all goroutines and close channel
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// Gather: Collect all results
	var allUsers []entity.User
	for result := range resultChan {
		if result.err != nil {
			// Log error but continue - partial results are better than nothing
			// In production, you might want stricter error handling
			continue
		}
		allUsers = append(allUsers, result.users...)
	}

	// Sort all results by created_at DESC (since each shard returned sorted)
	// This is a merge sort of already-sorted slices
	shardedSortUsersByCreatedAt(allUsers)

	// Apply offset and limit to merged results
	if offset >= len(allUsers) {
		return []entity.User{}, nil
	}

	end := offset + limit
	if end > len(allUsers) {
		end = len(allUsers)
	}

	return allUsers[offset:end], nil
}

// ============================================================================
// Helper Functions
// ============================================================================

// shardedToUserEntity converts a GORM model to domain entity
func shardedToUserEntity(m models.UserModel) entity.User {
	return entity.User{
		ID:        m.Id.String(),
		FirstName: m.FirstName,
		LastName:  m.LastName,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

// shardedToUserModel converts a domain entity to GORM model
func shardedToUserModel(e *entity.User) models.UserModel {
	id := uuid.Nil
	if e.ID != "" {
		if parsed, err := uuid.Parse(e.ID); err == nil {
			id = parsed
		}
	}

	return models.UserModel{
		CommonModel: common.CommonModel{
			Id:        id,
			CreatedAt: e.CreatedAt,
			UpdatedAt: e.UpdatedAt,
		},
		FirstName: e.FirstName,
		LastName:  e.LastName,
	}
}

// shardedSortUsersByCreatedAt sorts users by created_at in descending order
func shardedSortUsersByCreatedAt(users []entity.User) {
	// Simple insertion sort for nearly-sorted data (from pre-sorted shards)
	for i := 1; i < len(users); i++ {
		j := i
		for j > 0 && users[j].CreatedAt.After(users[j-1].CreatedAt) {
			users[j], users[j-1] = users[j-1], users[j]
			j--
		}
	}
}

// ============================================================================
// Shard Statistics
// ============================================================================

// ShardStats holds statistics for a single shard
type ShardStats struct {
	ShardID   int    `json:"shard_id"`
	ShardName string `json:"shard_name"`
	UserCount int64  `json:"user_count"`
}

// GetShardStats returns user count per shard (for monitoring)
func (r *ShardedUserRepository) GetShardStats(ctx context.Context) ([]ShardStats, error) {
	shards := r.shardManager.GetAllShards()
	stats := make([]ShardStats, len(shards))

	var wg sync.WaitGroup
	var mu sync.Mutex
	var lastErr error

	for i, s := range shards {
		wg.Add(1)
		go func(idx int, sh *shardpkg.Shard) {
			defer wg.Done()

			var count int64
			if err := sh.ReadDB.WithContext(ctx).Model(&models.UserModel{}).Count(&count).Error; err != nil {
				mu.Lock()
				lastErr = err
				mu.Unlock()
				return
			}

			mu.Lock()
			stats[idx] = ShardStats{
				ShardID:   sh.ID,
				ShardName: sh.Name,
				UserCount: count,
			}
			mu.Unlock()
		}(i, s)
	}

	wg.Wait()

	if lastErr != nil {
		return nil, lastErr
	}

	return stats, nil
}
