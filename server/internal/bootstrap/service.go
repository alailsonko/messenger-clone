package bootstrap

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/gofiber/fiber/v3"
)

// Ensure our services implement fiber.Service
var (
	_ fiber.Service = (*DatabaseService)(nil)
	_ fiber.Service = (*ApplicationService)(nil)
)

// ServiceContainer manages the lifecycle of all registered services
type ServiceContainer struct {
	services []fiber.Service
	mu       sync.RWMutex
	started  bool
}

// NewServiceContainer creates a new service container
func NewServiceContainer() *ServiceContainer {
	return &ServiceContainer{
		services: make([]fiber.Service, 0),
	}
}

// Register adds a service to the container
func (sc *ServiceContainer) Register(svc fiber.Service) {
	sc.mu.Lock()
	defer sc.mu.Unlock()
	sc.services = append(sc.services, svc)
}

// Start starts all registered services in order
func (sc *ServiceContainer) Start(ctx context.Context) error {
	sc.mu.Lock()
	defer sc.mu.Unlock()

	if sc.started {
		return fmt.Errorf("services already started")
	}

	for i, svc := range sc.services {
		log.Printf("Starting service: %s", svc.String())
		if err := svc.Start(ctx); err != nil {
			// Rollback: stop already started services
			sc.terminateServices(ctx, sc.services[:i])
			return fmt.Errorf("failed to start service %s: %w", svc.String(), err)
		}
		log.Printf("Service started: %s", svc.String())
	}

	sc.started = true
	return nil
}

// Terminate stops all registered services in reverse order
func (sc *ServiceContainer) Terminate(ctx context.Context) error {
	sc.mu.Lock()
	defer sc.mu.Unlock()

	if !sc.started {
		return nil
	}

	err := sc.terminateServices(ctx, sc.services)
	sc.started = false
	return err
}

// terminateServices stops services in reverse order
func (sc *ServiceContainer) terminateServices(ctx context.Context, services []fiber.Service) error {
	var errs []error

	// Stop in reverse order
	for i := len(services) - 1; i >= 0; i-- {
		svc := services[i]
		log.Printf("Stopping service: %s", svc.String())
		if err := svc.Terminate(ctx); err != nil {
			errs = append(errs, fmt.Errorf("failed to stop service %s: %w", svc.String(), err))
			log.Printf("Error stopping service %s: %v", svc.String(), err)
		} else {
			log.Printf("Service stopped: %s", svc.String())
		}
	}

	if len(errs) > 0 {
		return fmt.Errorf("errors stopping services: %v", errs)
	}
	return nil
}

// Services returns all registered services for Fiber DI
func (sc *ServiceContainer) Services() []fiber.Service {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	result := make([]fiber.Service, len(sc.services))
	copy(result, sc.services)
	return result
}

// GetService retrieves a service by type from the container
func GetService[T fiber.Service](sc *ServiceContainer) (T, bool) {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	var zero T
	for _, svc := range sc.services {
		if s, ok := svc.(T); ok {
			return s, true
		}
	}
	return zero, false
}
