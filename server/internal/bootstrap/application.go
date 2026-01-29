/*
Package bootstrap provides application initialization and service lifecycle management.

This package is responsible for:
  - Creating and wiring all application dependencies
  - Implementing Fiber's Service interface for lifecycle management
  - Managing application services (UserService, etc.)

# Architecture

	┌─────────────────────────────────────────────────────────────────────────┐
	│                      ApplicationService                                  │
	│  - Implements fiber.Service for lifecycle management                     │
	│  - Creates and holds all application services                            │
	│  - Wires repositories with correct database connections                  │
	└─────────────────────────────────────────────────────────────────────────┘
	                                    │
	                                    ▼
	┌─────────────────────────────────────────────────────────────────────────┐
	│                      Application Services                                │
	│  - UserService (user operations)                                         │
	│  - (Future: MessageService, AuthService, etc.)                           │
	└─────────────────────────────────────────────────────────────────────────┘
	                                    │
	                                    ▼
	┌─────────────────────────────────────────────────────────────────────────┐
	│                      Repositories                                        │
	│  - UserRepository (write → primary, read → replica)                      │
	└─────────────────────────────────────────────────────────────────────────┘
*/
package bootstrap

import (
	"context"
	"fmt"
	"log"
	"sync"

	appservice "github.com/alailsonko/messenger-clone/server/internal/application/service"
	domainservice "github.com/alailsonko/messenger-clone/server/internal/domain/service"
	"github.com/alailsonko/messenger-clone/server/internal/infra/database/shard"
	persistrepo "github.com/alailsonko/messenger-clone/server/internal/persistence/repository"
	"gorm.io/gorm"
)

// ApplicationService is the main application container that holds all services.
//
// It implements fiber.Service for automatic lifecycle management and provides
// access to all application services (UserService, etc.).
//
// # Responsibilities
//
//   - Creates and wires all application dependencies
//   - Manages service lifecycle (start, state, terminate)
//   - Exposes services for use by handlers
//
// # CQRS Pattern
//
// This service creates repositories with CQRS (Command Query Responsibility
// Segregation) pattern:
//
//   - Write operations use the primary database (strong consistency)
//   - Read operations use the replica database (better scalability)
//
// # Sharding Mode
//
// When sharding is enabled, the service uses ShardedUserRepository which:
//   - Routes operations to the correct shard based on user ID
//   - Uses consistent hashing for even distribution
//   - Supports scatter-gather for cross-shard queries
type ApplicationService struct {
	// UserService handles all user-related business operations
	UserService domainservice.UserService

	// ShardManager is available when sharding is enabled (nil otherwise)
	ShardManager *shard.ShardManager

	// writeDB is the primary database connection for write operations (non-sharded mode)
	writeDB *gorm.DB

	// readDB is the replica database connection for read operations (non-sharded mode)
	readDB *gorm.DB

	// sharded indicates if sharding is enabled
	sharded bool

	// state tracks the current service state (initialized, running, terminated)
	state string

	// mu protects concurrent access to the service state
	mu sync.RWMutex
}

// NewApplicationService creates a new ApplicationService with all dependencies wired.
//
// This function:
//  1. Creates repositories with appropriate database connections
//  2. Creates application services with their dependencies
//  3. Returns the fully configured ApplicationService
//
// Parameters:
//   - writeDB: Primary database connection for write operations
//   - readDB: Replica database connection for read operations
//
// Returns:
//   - A fully configured ApplicationService ready to be started
//
// Example:
//
//	connManager, _ := database.NewConnectionManager(writeConfig, readConfig, logger)
//	appService := bootstrap.NewApplicationService(connManager.WriteDB(), connManager.ReadDB())
func NewApplicationService(writeDB, readDB *gorm.DB) *ApplicationService {
	// ==========================================================================
	// Repository Layer
	// ==========================================================================
	//
	// Create repositories with CQRS pattern:
	// - Write repository connects to primary database (strong consistency)
	// - Read repository connects to replica database (scalability)

	// User repositories
	writeUserRepo := persistrepo.NewUserGormRepository(writeDB)
	readUserRepo := persistrepo.NewUserGormRepository(readDB)

	// ==========================================================================
	// Application Service Layer
	// ==========================================================================
	//
	// Create application services that encapsulate business logic.
	// Services receive both read and write repositories for CQRS operations.

	userService := appservice.NewUserService(writeUserRepo, readUserRepo)

	return &ApplicationService{
		UserService:  userService,
		ShardManager: nil,
		writeDB:      writeDB,
		readDB:       readDB,
		sharded:      false,
		state:        "initialized",
	}
}

// NewShardedApplicationService creates an ApplicationService with sharding support.
//
// This function:
//  1. Creates a sharded user repository that distributes data across shards
//  2. Uses consistent hashing to route operations to the correct shard
//  3. Supports scatter-gather for cross-shard queries
//
// Parameters:
//   - shardManager: The shard manager with initialized connections
//
// Returns:
//   - A fully configured ApplicationService with sharding enabled
//
// Example:
//
//	shardService := bootstrap.NewShardedDatabaseService(cfg.Sharding, cfg.WriteDB)
//	// ... start shardService ...
//	appService := bootstrap.NewShardedApplicationService(shardService.ShardManager())
func NewShardedApplicationService(shardManager *shard.ShardManager) *ApplicationService {
	// ==========================================================================
	// Sharded Repository Layer
	// ==========================================================================
	//
	// Create sharded repository that routes operations to correct shard
	// based on user ID using consistent hashing.

	shardedUserRepo := persistrepo.NewShardedUserRepository(shardManager)

	// ==========================================================================
	// Application Service Layer
	// ==========================================================================
	//
	// Create application service with sharded repository.
	// Both read and write use the same sharded repository (it handles routing).

	userService := appservice.NewUserService(shardedUserRepo, shardedUserRepo)

	return &ApplicationService{
		UserService:  userService,
		ShardManager: shardManager,
		writeDB:      nil,
		readDB:       nil,
		sharded:      true,
		state:        "initialized",
	}
}

// IsSharded returns true if the application is running in sharded mode
func (s *ApplicationService) IsSharded() bool {
	return s.sharded
}

// String returns the service name for logging and identification.
//
// Implements: fiber.Service
func (s *ApplicationService) String() string {
	return "ApplicationService"
}

// Start initializes the application service.
//
// This method is called by Fiber during server startup. It:
//   - Validates that all services are properly initialized
//   - Performs any necessary startup tasks
//   - Respects context cancellation for timeout handling
//
// Implements: fiber.Service
//
// Parameters:
//   - ctx: Context with timeout for startup operations
//
// Returns:
//   - error: Any error that occurred during startup
func (s *ApplicationService) Start(ctx context.Context) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Check if context is already cancelled
	if err := ctx.Err(); err != nil {
		return fmt.Errorf("context cancelled before starting: %w", err)
	}

	// Perform startup validation
	done := make(chan error, 1)
	go func() {
		// Validate that all services are initialized
		if s.UserService == nil {
			done <- fmt.Errorf("UserService not initialized")
			return
		}
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
	log.Printf("[%s] Started successfully", s.String())
	return nil
}

// State returns the current state of the service.
//
// Possible states:
//   - "initialized": Service created but not started
//   - "running": Service is active and handling requests
//   - "terminated": Service has been shut down
//   - "error": Service encountered an error
//
// Implements: fiber.Service
//
// Parameters:
//   - ctx: Context for the state check operation
//
// Returns:
//   - string: The current service state
//   - error: Any error that occurred while checking state
func (s *ApplicationService) State(ctx context.Context) (string, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.state, nil
}

// Terminate gracefully shuts down the application service.
//
// This method is called by Fiber during server shutdown. It:
//   - Flushes any pending operations
//   - Releases resources held by services
//   - Respects context timeout for graceful shutdown
//
// Implements: fiber.Service
//
// Parameters:
//   - ctx: Context with timeout for shutdown operations
//
// Returns:
//   - error: Any error that occurred during shutdown
func (s *ApplicationService) Terminate(ctx context.Context) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Perform cleanup with context awareness
	done := make(chan error, 1)
	go func() {
		// Add any cleanup logic here (e.g., flush pending operations)
		// Currently no cleanup needed for stateless services
		done <- nil
	}()

	select {
	case <-ctx.Done():
		log.Printf("[%s] Shutdown timeout reached", s.String())
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

// Application is an alias for backward compatibility
type Application = ApplicationService

// NewApplication creates a new application (backward compatibility)
func NewApplication(writeDB, readDB *gorm.DB) *Application {
	return NewApplicationService(writeDB, readDB)
}
