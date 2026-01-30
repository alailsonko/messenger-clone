// Package bootstrap provides shard service initialization and lifecycle management.
package bootstrap

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/alailsonko/messenger-clone/server/config"
	"github.com/alailsonko/messenger-clone/server/internal/infra/database/shard"
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// ShardedDatabaseService wraps the shard manager as a Fiber service
//
// This service manages the lifecycle of all database shards:
// - Initialization: Creates connections to all shards
// - Health checks: Verifies all shards are accessible
// - Graceful shutdown: Closes all connections cleanly
//
// In prefork mode, each child process creates its own ShardedDatabaseService.
// Migrations only run in the parent process to avoid race conditions.
type ShardedDatabaseService struct {
	shardManager *shard.ShardManager
	config       config.ShardConfig
	dbConfig     config.DBConfig
	state        string
	mu           sync.RWMutex
}

// NewShardedDatabaseService creates a new sharded database service
//
// Parameters:
//   - cfg: Sharding configuration (count, virtual nodes, etc.)
//   - dbCfg: Database credentials to use for all shards
//
// The service is created but not connected. Call Start() to initialize.
func NewShardedDatabaseService(cfg config.ShardConfig, dbCfg config.DBConfig) *ShardedDatabaseService {
	return &ShardedDatabaseService{
		config:   cfg,
		dbConfig: dbCfg,
		state:    "initialized",
	}
}

// String returns the service name (implements fiber.Service)
func (s *ShardedDatabaseService) String() string {
	return "ShardedDatabaseService"
}

// Start initializes all shard connections (implements fiber.Service)
//
// This method:
// 1. Creates shard configurations based on count and port mapping
// 2. Initializes the shard manager with consistent hashing
// 3. Establishes connections to all shards
// 4. Verifies all connections with a ping
func (s *ShardedDatabaseService) Start(ctx context.Context) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if err := ctx.Err(); err != nil {
		return fmt.Errorf("context cancelled before starting: %w", err)
	}

	done := make(chan error, 1)
	go func() {
		// Build shard configurations
		configs := make([]shard.ShardConfig, s.config.ShardCount)
		for i := 0; i < s.config.ShardCount; i++ {
			// Determine host and port based on configuration mode
			var writeHost, readHost string
			var writePort, readPort int

			if s.config.PerShardHosts {
				// Docker mode: each shard has its own hostname (e.g., pgbouncer-0, shard-0)
				writeHost = fmt.Sprintf("%s-%d", s.config.BaseHost, i)
				// Use separate ReplicaHost if configured (allows pgbouncer for writes, shard for reads)
				replicaBaseHost := s.config.ReplicaHost
				if replicaBaseHost == "" {
					replicaBaseHost = s.config.BaseHost
				}
				readHost = fmt.Sprintf("%s-%d-replica", replicaBaseHost, i)
				writePort = s.config.BasePort
				readPort = s.config.ReplicaBasePort
			} else {
				// Local mode: same host with port offsets
				writeHost = s.config.BaseHost
				readHost = s.config.BaseHost
				writePort = s.config.BasePort + i
				readPort = s.config.ReplicaBasePort + i
			}

			// Each shard gets full connection pool capacity for maximum throughput
			// Don't divide by shard count - each shard handles independent load
			maxOpen := s.dbConfig.MaxOpenConns
			if maxOpen <= 0 {
				maxOpen = 100 // Default per shard
			}
			maxIdle := s.dbConfig.MaxIdleConns
			if maxIdle <= 0 {
				maxIdle = maxOpen / 2 // Keep half as warm connections
			}

			configs[i] = shard.ShardConfig{
				ID:              i,
				Name:            fmt.Sprintf("shard-%d", i),
				WriteHost:       writeHost,
				WritePort:       writePort,
				WriteUser:       s.dbConfig.User,
				WritePassword:   s.dbConfig.Password,
				WriteDatabase:   s.dbConfig.Database,
				ReadHost:        readHost,
				ReadPort:        readPort,
				ReadUser:        s.dbConfig.User,
				ReadPassword:    s.dbConfig.Password,
				ReadDatabase:    s.dbConfig.Database,
				MaxOpenConns:    maxOpen,
				MaxIdleConns:    maxIdle,
				ConnMaxLifetime: time.Duration(s.dbConfig.ConnMaxLifetime) * time.Minute,
			}
		}

		// Create shard manager
		manager, err := shard.NewShardManager(configs, s.config.VirtualNodes, logger.Default)
		if err != nil {
			done <- fmt.Errorf("failed to create shard manager: %w", err)
			return
		}

		// Ping all shards
		if err := manager.Ping(); err != nil {
			manager.Close()
			done <- fmt.Errorf("shard ping failed: %w", err)
			return
		}

		// Run migrations on all shards
		if err := s.runMigrations(manager); err != nil {
			manager.Close()
			done <- fmt.Errorf("shard migrations failed: %w", err)
			return
		}

		s.shardManager = manager
		done <- nil
	}()

	select {
	case <-ctx.Done():
		return fmt.Errorf("startup timeout: %w", ctx.Err())
	case err := <-done:
		if err != nil {
			return err
		}
	}

	s.state = "running"
	log.Printf("[%s] Started successfully (%d shards)", s.String(), s.config.ShardCount)
	return nil
}

// State returns the current state of the service (implements fiber.Service)
func (s *ShardedDatabaseService) State(ctx context.Context) (string, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.state, nil
}

// Terminate closes all shard connections (implements fiber.Service)
func (s *ShardedDatabaseService) Terminate(ctx context.Context) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.shardManager == nil {
		s.state = "terminated"
		return nil
	}

	done := make(chan error, 1)
	go func() {
		done <- s.shardManager.Close()
	}()

	select {
	case <-ctx.Done():
		log.Printf("[%s] Shutdown timeout reached, forcing close", s.String())
		s.shardManager.Close()
		return fmt.Errorf("shutdown timeout: %w", ctx.Err())
	case err := <-done:
		if err != nil {
			s.state = "error"
			return err
		}
	}

	s.state = "terminated"
	log.Printf("[%s] Terminated successfully", s.String())
	return nil
}

// ShardManager returns the underlying shard manager
//
// Use this to access shards for routing operations.
// Returns nil if the service hasn't been started.
func (s *ShardedDatabaseService) ShardManager() *shard.ShardManager {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.shardManager
}

// runMigrations creates the partitioned users table on all shards
//
// In prefork mode, this only runs in the parent process to avoid
// concurrent migration conflicts. Child processes skip this step.
func (s *ShardedDatabaseService) runMigrations(manager *shard.ShardManager) error {
	// Skip migrations in child processes (prefork mode)
	// The parent process will have already run migrations before forking
	if fiber.IsChild() {
		log.Println("[ShardedDatabaseService] Child process - skipping migrations (parent already ran them)")
		return nil
	}

	log.Println("[ShardedDatabaseService] Running migrations on all shards...")

	for i := 0; i < s.config.ShardCount; i++ {
		shardObj := manager.GetShard(i)
		if shardObj == nil {
			return fmt.Errorf("shard %d not found", i)
		}

		if err := s.migrateUsersTable(shardObj.WriteDB, i); err != nil {
			return fmt.Errorf("shard %d migration failed: %w", i, err)
		}
	}

	log.Println("[ShardedDatabaseService] Migrations completed on all shards")
	return nil
}

// migrateUsersTable creates a hash-partitioned users table if it doesn't exist
func (s *ShardedDatabaseService) migrateUsersTable(db *gorm.DB, shardID int) error {
	// Check if users table exists
	var tableExists bool
	err := db.Raw(`
		SELECT EXISTS (
			SELECT FROM information_schema.tables 
			WHERE table_schema = 'public' AND table_name = 'users'
		)
	`).Scan(&tableExists).Error
	if err != nil {
		return fmt.Errorf("failed to check table existence: %w", err)
	}

	if tableExists {
		// Check if it's already partitioned
		var partitionCount int64
		err := db.Raw(`
			SELECT COUNT(*) FROM pg_inherits 
			WHERE inhparent = 'users'::regclass
		`).Scan(&partitionCount).Error
		if err != nil {
			return fmt.Errorf("failed to check partition count: %w", err)
		}

		if partitionCount == 8 {
			log.Printf("[Shard %d] Users table already partitioned with 8 partitions", shardID)
			return nil
		}

		// Table exists but not partitioned - drop and recreate
		log.Printf("[Shard %d] Dropping non-partitioned users table", shardID)
		if err := db.Exec("DROP TABLE IF EXISTS users CASCADE").Error; err != nil {
			return fmt.Errorf("failed to drop table: %w", err)
		}
	}

	// Create partitioned users table
	log.Printf("[Shard %d] Creating partitioned users table", shardID)

	sql := `
		CREATE TABLE users (
			id UUID NOT NULL DEFAULT gen_random_uuid(),
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW(),
			first_name VARCHAR(255),
			last_name VARCHAR(255),
			PRIMARY KEY (id)
		) PARTITION BY HASH (id)
	`
	if err := db.Exec(sql).Error; err != nil {
		return fmt.Errorf("failed to create partitioned table: %w", err)
	}

	// Create 8 partitions
	for p := 0; p < 8; p++ {
		sql := fmt.Sprintf(
			"CREATE TABLE users_p%d PARTITION OF users FOR VALUES WITH (MODULUS 8, REMAINDER %d)",
			p, p,
		)
		if err := db.Exec(sql).Error; err != nil {
			return fmt.Errorf("failed to create partition %d: %w", p, err)
		}
	}

	// Create indexes
	if err := db.Exec("CREATE INDEX idx_users_name ON users (first_name, last_name)").Error; err != nil {
		return fmt.Errorf("failed to create name index: %w", err)
	}
	if err := db.Exec("CREATE INDEX idx_users_created_at ON users (created_at DESC)").Error; err != nil {
		return fmt.Errorf("failed to create created_at index: %w", err)
	}

	log.Printf("[Shard %d] Created partitioned users table with 8 partitions", shardID)
	return nil
}
