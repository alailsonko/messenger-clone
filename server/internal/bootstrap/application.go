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
type ApplicationService struct {
	// UserService handles all user-related business operations
	UserService domainservice.UserService

	// writeDB is the primary database connection for write operations
	writeDB *gorm.DB

	// readDB is the replica database connection for read operations
	readDB *gorm.DB

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
		UserService: userService,
		writeDB:     writeDB,
		readDB:      readDB,
		state:       "initialized",
	}
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
