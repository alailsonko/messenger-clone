package bootstrap

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/alailsonko/messenger-clone/server/internal/infra/database"
)

// DatabaseService wraps the connection manager as a Fiber service
type DatabaseService struct {
	connManager *database.ConnectionManager
	state       string
	mu          sync.RWMutex
}

// NewDatabaseService creates a new database service
func NewDatabaseService(connManager *database.ConnectionManager) *DatabaseService {
	return &DatabaseService{
		connManager: connManager,
		state:       "initialized",
	}
}

// String returns the service name (implements fiber.Service)
func (s *DatabaseService) String() string {
	return "DatabaseService"
}

// Start initializes the database service (implements fiber.Service)
func (s *DatabaseService) Start(ctx context.Context) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Check if context is already cancelled
	if err := ctx.Err(); err != nil {
		return fmt.Errorf("context cancelled before starting: %w", err)
	}

	// Use a channel to handle context cancellation during startup
	done := make(chan error, 1)
	go func() {
		// Perform any startup tasks here (e.g., ping databases)
		if err := s.connManager.Ping(); err != nil {
			done <- fmt.Errorf("database ping failed: %w", err)
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

// State returns the current state of the service (implements fiber.Service)
func (s *DatabaseService) State(ctx context.Context) (string, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.state, nil
}

// Terminate closes database connections (implements fiber.Service)
func (s *DatabaseService) Terminate(ctx context.Context) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Use a channel to handle context cancellation during shutdown
	done := make(chan error, 1)
	go func() {
		done <- s.connManager.Close()
	}()

	select {
	case <-ctx.Done():
		log.Printf("[%s] Shutdown timeout reached, forcing close", s.String())
		// Still try to close even if context is done
		s.connManager.Close()
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

// ConnectionManager returns the underlying connection manager
func (s *DatabaseService) ConnectionManager() *database.ConnectionManager {
	return s.connManager
}
