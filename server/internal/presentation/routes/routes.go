/*
Package routes configures HTTP routing for the application.

Routes are organized by domain and connect HTTP endpoints to their handlers.
The package follows Clean Architecture principles by depending on service
interfaces rather than concrete implementations.

# Route Structure

	/health              → Health check endpoint
	/api/v1/users        → User management endpoints
	  POST   /           → Create user
	  GET    /           → List all users
	  GET    /:id        → Get user by ID
	  PUT    /:id        → Update user
	  DELETE /:id        → Delete user

# Architecture

Routes receive application services and create handlers with those dependencies:

	main.go
	    │
	    ▼
	SetupRoutes(app, userService)
	    │
	    ├── SetupUserRoutes(app, userService)
	    │       │
	    │       ▼
	    │   UserHandler(userService)
	    │
	    └── (future route groups...)
*/
package routes

import (
	"log"
	"time"

	"github.com/alailsonko/messenger-clone/server/internal/domain/service"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"github.com/gofiber/fiber/v3/middleware/timeout"
)

// SetupRoutes configures all HTTP routes for the application.
//
// This function is the main entry point for route configuration. It sets up:
//   - Recovery middleware (prevents crashes from panics)
//   - Rate limiting (prevents resource exhaustion)
//   - Health check endpoints
//   - API versioned route groups
//   - All domain-specific routes (users, messages, etc.)
//
// Parameters:
//   - app: The Fiber application instance
//   - userService: The user service for user-related operations
//
// Example:
//
//	app := fiber.New()
//	userService := appservice.NewUserService(writeRepo, readRepo)
//	routes.SetupRoutes(app, userService)
func SetupRoutes(app *fiber.App, userService service.UserService) {
	// ==========================================================================
	// Recovery Middleware - Prevents panics from crashing the server
	// ==========================================================================
	app.Use(recover.New(recover.Config{
		EnableStackTrace: true,
		StackTraceHandler: func(c fiber.Ctx, e any) {
			log.Printf("[PANIC RECOVERED] %v\nPath: %s\n", e, c.Path())
		},
	}))

	// ==========================================================================
	// Request Timeout - Prevents long-running requests from holding connections
	// ==========================================================================
	app.Use(timeout.New(func(c fiber.Ctx) error {
		return c.Next()
	}, timeout.Config{
		Timeout: 10 * time.Second, // 10 second timeout per request
	}))

	// Health check endpoint for load balancers and monitoring
	app.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
		})
	})

	// API v1 routes
	api := app.Group("/api/v1")

	// Setup all domain route groups
	SetupUserRoutes(api, userService)
}
