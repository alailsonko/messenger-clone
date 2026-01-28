/*
Package service contains application services that encapsulate business logic.

Application services act as the orchestration layer between the presentation layer
(HTTP handlers) and the domain layer (entities, repositories). They:

  - Coordinate complex business operations
  - Apply business rules and validations
  - Manage transactions when needed
  - Provide a clean API for the presentation layer

# Architecture

	┌─────────────────────────────────────────────────────────────────────────┐
	│                      Presentation Layer (Handlers)                       │
	└─────────────────────────────────────────────────────────────────────────┘
	                                    │
	                                    ▼
	┌─────────────────────────────────────────────────────────────────────────┐
	│                    Application Layer (Services)                          │
	│  - UserService                                                           │
	│  - Orchestrates business operations                                      │
	│  - Applies business rules                                                │
	└─────────────────────────────────────────────────────────────────────────┘
	                                    │
	                                    ▼
	┌─────────────────────────────────────────────────────────────────────────┐
	│                      Domain Layer (Repositories)                         │
	│  - UserRepository                                                        │
	│  - Data access abstraction                                               │
	└─────────────────────────────────────────────────────────────────────────┘
*/
package service

import (
	"context"
	"fmt"
	"time"

	"github.com/alailsonko/messenger-clone/server/internal/domain/dto"
	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
	"github.com/alailsonko/messenger-clone/server/internal/domain/errors"
	"github.com/alailsonko/messenger-clone/server/internal/domain/repository"
	domainservice "github.com/alailsonko/messenger-clone/server/internal/domain/service"
)

// Database operation timeouts
const (
	dbReadTimeout  = 3 * time.Second // Timeout for read operations
	dbWriteTimeout = 5 * time.Second // Timeout for write operations
)

// Ensure UserServiceImpl implements the domain UserService interface
var _ domainservice.UserService = (*UserServiceImpl)(nil)

// UserServiceImpl is the application service implementation for user operations.
//
// It implements the domain.UserService interface and provides:
//   - CQRS pattern: separate repositories for read and write operations
//   - Business logic orchestration
//   - Error handling and domain error mapping
//
// # CQRS Pattern
//
// This service uses two repositories:
//   - writeRepo: Connected to the primary database for write operations
//   - readRepo: Connected to the replica database for read operations
//
// This separation allows for:
//   - Better read scalability (reads go to replicas)
//   - Write consistency (writes go to primary)
//   - Potential for different read models optimized for queries
type UserServiceImpl struct {
	// writeRepo is used for create, update, and delete operations.
	// It connects to the primary database for strong consistency.
	writeRepo repository.UserRepository

	// readRepo is used for query operations.
	// It connects to the replica database for better read scalability.
	readRepo repository.UserRepository
}

// NewUserService creates a new UserService with separate read and write repositories.
//
// Parameters:
//   - writeRepo: Repository connected to the primary database for write operations
//   - readRepo: Repository connected to the replica database for read operations
//
// Returns:
//   - A new UserService instance implementing domainservice.UserService
//
// Example:
//
//	writeRepo := repository.NewUserGormRepository(primaryDB)
//	readRepo := repository.NewUserGormRepository(replicaDB)
//	userService := service.NewUserService(writeRepo, readRepo)
func NewUserService(writeRepo, readRepo repository.UserRepository) *UserServiceImpl {
	return &UserServiceImpl{
		writeRepo: writeRepo,
		readRepo:  readRepo,
	}
}

// GetAllUsers retrieves all users from the database with pagination.
//
// This is a read operation that uses the read repository (replica database)
// for better scalability.
//
// Parameters:
//   - ctx: Context for cancellation and timeout control
//   - paginationData: Pagination parameters (limit and offset)
//
// Returns:
//   - []entity.User: List of users
//   - error: Any error that occurred during the operation
//
// Example:
//
//	pagination := dto.PaginationData{Limit: 20, Offset: 0}
//	users, err := userService.GetAllUsers(ctx, pagination)
//	if err != nil {
//	    return fmt.Errorf("failed to get users: %w", err)
//	}
func (s *UserServiceImpl) GetAllUsers(ctx context.Context, paginationData dto.PaginationData) ([]entity.User, error) {
	// Add timeout to prevent long-running queries
	queryCtx, cancel := context.WithTimeout(ctx, dbReadTimeout)
	defer cancel()

	pagination := repository.Pagination{
		Limit:  paginationData.Limit,
		Offset: paginationData.Offset,
	}
	users, err := s.readRepo.FindAll(queryCtx, &pagination)
	if err != nil {
		return nil, fmt.Errorf("failed to get all users: %w", err)
	}
	return users, nil
}

// GetUserByID retrieves a user by their unique identifier.
//
// This is a read operation that uses the read repository (replica database).
//
// Parameters:
//   - ctx: Context for cancellation and timeout control
//   - id: The unique identifier of the user to retrieve
//
// Returns:
//   - *entity.User: The user if found, nil if not found
//   - error: Any error that occurred during the operation
//
// Errors:
//   - errors.ErrUserNotFound: When the user with the given ID doesn't exist
//
// Example:
//
//	user, err := userService.GetUserByID(ctx, "user-uuid-123")
//	if err != nil {
//	    if errors.Is(err, errors.ErrUserNotFound) {
//	        return nil, nil // User not found is not an error
//	    }
//	    return nil, err
//	}
func (s *UserServiceImpl) GetUserByID(ctx context.Context, id string) (*entity.User, error) {
	// Add timeout to prevent long-running queries
	queryCtx, cancel := context.WithTimeout(ctx, dbReadTimeout)
	defer cancel()

	user, err := s.readRepo.FindByID(queryCtx, id)
	if err != nil {
		if err == errors.ErrUserNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by ID: %w", err)
	}
	return user, nil
}

// CreateUser creates a new user with the given first and last name.
//
// This is a write operation that uses the write repository (primary database)
// for strong consistency.
//
// Parameters:
//   - ctx: Context for cancellation and timeout control
//   - input: The create user input containing first and last name
//
// Returns:
//   - *entity.User: The newly created user with generated ID and timestamps
//   - error: Any error that occurred during the operation
//
// Business Rules:
//   - FirstName and LastName are required
//   - A unique ID is generated automatically
//   - CreatedAt and UpdatedAt timestamps are set automatically
//
// Example:
//
//	user, err := userService.CreateUser(ctx, dto.CreateUserData{FirstName: "John", LastName: "Doe"})
//	if err != nil {
//	    return nil, fmt.Errorf("failed to create user: %w", err)
//	}
//	fmt.Printf("Created user with ID: %s\n", user.ID)
func (s *UserServiceImpl) CreateUser(ctx context.Context, data dto.CreateUserData) (*entity.User, error) {
	// Add timeout to prevent long-running writes
	writeCtx, cancel := context.WithTimeout(ctx, dbWriteTimeout)
	defer cancel()

	// Create new user entity
	user := entity.NewUser(data.FirstName, data.LastName)

	// Persist to primary database
	if err := s.writeRepo.Create(writeCtx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return user, nil
}

// UpdateUser updates an existing user's information.
//
// This is a write operation that uses the write repository (primary database).
//
// Parameters:
//   - ctx: Context for cancellation and timeout control
//   - id: The unique identifier of the user to update
//   - input: The update user input containing fields to update
//
// Returns:
//   - *entity.User: The updated user with new timestamps
//   - error: Any error that occurred during the operation
//
// Errors:
//   - errors.ErrUserNotFound: When the user with the given ID doesn't exist
//
// Business Rules:
//   - User must exist to be updated
//   - UpdatedAt timestamp is updated automatically
//
// Example:
//
//	user, err := userService.UpdateUser(ctx, "user-uuid-123", dto.UpdateUserData{FirstName: "Jane", LastName: "Smith"})
//	if err != nil {
//	    return nil, fmt.Errorf("failed to update user: %w", err)
//	}
func (s *UserServiceImpl) UpdateUser(ctx context.Context, id string, data dto.UpdateUserData) (*entity.User, error) {
	// Add timeout to prevent long-running writes
	writeCtx, cancel := context.WithTimeout(ctx, dbWriteTimeout)
	defer cancel()

	// First, fetch from primary to ensure we have the latest version
	user, err := s.writeRepo.FindByID(writeCtx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to find user for update: %w", err)
	}

	// Check if user exists
	if user == nil {
		return nil, errors.ErrUserNotFound
	}

	// Update user fields
	user.FirstName = data.FirstName
	user.LastName = data.LastName

	// Persist changes to primary database
	if err := s.writeRepo.Update(writeCtx, user); err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return user, nil
}

// DeleteUser removes a user from the database.
//
// This is a write operation that uses the write repository (primary database).
//
// Parameters:
//   - ctx: Context for cancellation and timeout control
//   - id: The unique identifier of the user to delete
//
// Returns:
//   - error: Any error that occurred during the operation
//
// Errors:
//   - errors.ErrUserNotFound: When the user with the given ID doesn't exist
//
// Business Rules:
//   - User must exist to be deleted
//   - This is a hard delete (soft delete can be implemented if needed)
//
// Example:
//
//	err := userService.DeleteUser(ctx, "user-uuid-123")
//	if err != nil {
//	    if errors.Is(err, errors.ErrUserNotFound) {
//	        return nil // Already deleted or never existed
//	    }
//	    return err
//	}
func (s *UserServiceImpl) DeleteUser(ctx context.Context, id string) error {
	// Add timeout to prevent long-running writes
	writeCtx, cancel := context.WithTimeout(ctx, dbWriteTimeout)
	defer cancel()

	// Verify user exists before attempting delete
	user, err := s.writeRepo.FindByID(writeCtx, id)
	if err != nil {
		return fmt.Errorf("failed to find user for deletion: %w", err)
	}

	// Check if user exists
	if user == nil {
		return errors.ErrUserNotFound
	}

	// Delete from primary database
	if err := s.writeRepo.Delete(writeCtx, id); err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}
