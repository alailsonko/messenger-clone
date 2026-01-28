/*
Package main is the entry point for the Messenger Clone API server.

# Architecture Overview

This server implements a CQRS (Command Query Responsibility Segregation) pattern
with separate read and write database connections for optimal performance and scalability.

	┌─────────────────────────────────────────────────────────────────────────┐
	│                           HTTP Requests                                  │
	└─────────────────────────────────────────────────────────────────────────┘
	                                    │
	                                    ▼
	┌─────────────────────────────────────────────────────────────────────────┐
	│                         Fiber HTTP Server                                │
	│  - Routes incoming requests to appropriate handlers                      │
	│  - Manages graceful shutdown with configurable timeout                   │
	│  - Handles SIGINT/SIGTERM signals automatically                          │
	└─────────────────────────────────────────────────────────────────────────┘
	                                    │
	                                    ▼
	┌─────────────────────────────────────────────────────────────────────────┐
	│                          Presentation Layer                              │
	│  - HTTP Handlers (user_handler.go)                                       │
	│  - Request/Response DTOs                                                 │
	│  - Input validation                                                      │
	└─────────────────────────────────────────────────────────────────────────┘
	                                    │
	                                    ▼
	┌─────────────────────────────────────────────────────────────────────────┐
	│                         Application Layer                                │
	│  - UserService (business logic orchestration)                            │
	│  - Encapsulates CQRS pattern (handlers don't know about buses)           │
	│  - Write operations → Primary DB                                         │
	│  - Read operations → Replica DB                                          │
	└─────────────────────────────────────────────────────────────────────────┘
	                                    │
	                    ┌───────────────┴───────────────┐
	                    ▼                               ▼
	┌───────────────────────────────┐   ┌───────────────────────────────┐
	│      Write Repository         │   │       Read Repository         │
	│   (Primary Database)          │   │    (Replica Database)         │
	└───────────────────────────────┘   └───────────────────────────────┘
	                    │                               │
	                    ▼                               ▼
	┌───────────────────────────────┐   ┌───────────────────────────────┐
	│    PostgreSQL Primary         │   │    PostgreSQL Replica         │
	│    (messenger_db_primary)     │   │    (messenger_db_replica)     │
	│    Port: 5432                 │   │    Port: 5433                 │
	└───────────────────────────────┘   └───────────────────────────────┘

# Service Lifecycle Management

The application uses Fiber's built-in service lifecycle management. Services implement
the fiber.Service interface and are automatically started/stopped by Fiber:

	Startup Order:
	  1. DatabaseService.Start() - Verifies database connections are alive
	  2. ApplicationService.Start() - Initializes UserService with CQRS repositories

	Shutdown Order (reverse):
	  1. ApplicationService.Terminate() - Flushes pending operations
	  2. DatabaseService.Terminate() - Closes database connections

Each service receives a context with a configurable timeout (default: 30s) that allows
for graceful startup/shutdown with proper cancellation handling.

# Configuration

Configuration is loaded from environment variables:

	Server:
	  - PORT: HTTP server port (default: 8080)
	  - ENABLE_PREFORK: Enable prefork mode for multi-core (default: true)

	Write Database (Primary):
	  - DB_WRITE_HOST: Primary database host (default: localhost)
	  - DB_WRITE_PORT: Primary database port (default: 5432)
	  - DB_WRITE_USER: Database user (default: root)
	  - DB_WRITE_PASSWORD: Database password (default: password)
	  - DB_WRITE_NAME: Database name (default: postgres)

	Read Database (Replica):
	  - DB_READ_HOST: Replica database host (default: localhost)
	  - DB_READ_PORT: Replica database port (default: 5433)
	  - DB_READ_USER: Database user (default: root)
	  - DB_READ_PASSWORD: Database password (default: password)
	  - DB_READ_NAME: Database name (default: postgres)

# Graceful Shutdown

The server handles graceful shutdown automatically:

 1. SIGINT/SIGTERM signal is received
 2. Server stops accepting new connections
 3. Waits for in-flight requests to complete (up to ShutdownTimeout)
 4. Terminates all registered services in reverse order
 5. Process exits cleanly

# Usage

	# Development (with hot reload via Air)
	make dev

	# Production (with Docker Compose)
	make compose-up

	# Stop all services
	make compose-down
*/
package main

import (
	"context"
	"log"
	"time"

	"github.com/alailsonko/messenger-clone/server/config"
	"github.com/alailsonko/messenger-clone/server/internal/bootstrap"
	"github.com/alailsonko/messenger-clone/server/internal/infra/database"
	"github.com/alailsonko/messenger-clone/server/internal/presentation/routes"
	"github.com/alailsonko/messenger-clone/server/tools/migration/runner"
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm/logger"
)

// main is the application entry point.
//
// It performs the following steps:
//  1. Loads configuration from environment variables
//  2. Establishes database connections (primary for writes, replica for reads)
//  3. Creates and registers services with Fiber's lifecycle manager
//  4. Sets up HTTP routes with CQRS buses
//  5. Starts the HTTP server with graceful shutdown support
//
// The function will block until the server is shut down (via SIGINT/SIGTERM)
// or a fatal error occurs during startup.
func main() {
	log.Println("Starting API server...")

	// ==========================================================================
	// Configuration
	// ==========================================================================
	//
	// Load application configuration from environment variables.
	// The config package provides sensible defaults for local development
	// while allowing full customization via environment variables in production.
	//
	// See: config/config.go for all available options
	cfg := config.Load()

	// ==========================================================================
	// Database Connections
	// ==========================================================================
	//
	// Create the connection manager with separate connections for read and write
	// operations (CQRS pattern). This allows:
	//
	//   - Write operations → Primary database (strong consistency)
	//   - Read operations  → Replica database (eventual consistency, better scalability)
	//
	// The connection manager handles:
	//   - Connection pooling
	//   - Automatic retries on connection failure
	//   - Health checks via Ping()
	//
	// Note: The replica database is synchronized from the primary via PostgreSQL
	// streaming replication. There may be a small delay (usually milliseconds)
	// between writes and their visibility on the replica.
	connManager, err := database.NewConnectionManager(cfg.WriteDB, cfg.ReadDB, logger.Default)
	if err != nil {
		log.Fatalf("Failed to connect to databases: %v", err)
	}

	// ==========================================================================
	// Database Migrations
	// ==========================================================================
	//
	// Run pending database migrations before starting the server.
	// This ensures the database schema is always up-to-date.
	//
	// Migrations are applied to the primary (write) database only.
	// The replica will receive changes through PostgreSQL streaming replication.
	migrationCtx, migrationCancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer migrationCancel()

	if _, err := runner.RunLatest(migrationCtx, connManager.WriteDB()); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// ==========================================================================
	// Service Registration
	// ==========================================================================
	//
	// Services implement fiber.Service interface and are managed by Fiber's
	// built-in lifecycle manager. Each service must implement:
	//
	//   - Start(ctx context.Context) error    → Initialize the service
	//   - Terminate(ctx context.Context) error → Cleanup resources
	//   - String() string                      → Service name for logging
	//   - State(ctx context.Context) (string, error) → Current state
	//
	// Services are started in registration order and terminated in reverse order.

	// DatabaseService wraps the connection manager and provides:
	//   - Health checks during startup (Ping)
	//   - Graceful connection closure during shutdown
	dbService := bootstrap.NewDatabaseService(connManager)

	// ApplicationService initializes the CQRS infrastructure:
	//   - Creates command and query buses
	//   - Registers all command handlers (CreateUser, UpdateUser, DeleteUser)
	//   - Registers all query handlers (GetUser, ListUsers)
	//   - Wires repositories with appropriate database connections
	appService := bootstrap.NewApplicationService(connManager.WriteDB(), connManager.ReadDB())

	// ==========================================================================
	// Fiber Application Setup
	// ==========================================================================
	//
	// Create the Fiber HTTP server with service lifecycle management.
	//
	// Key configuration options:
	//
	//   Services: List of services to be managed by Fiber. Services are started
	//             when the server starts and terminated when it shuts down.
	//
	//   ServicesStartupContextProvider: Provides a context for service startup.
	//             The context includes a timeout to prevent services from hanging
	//             indefinitely during initialization.
	//
	//   ServicesShutdownContextProvider: Provides a context for service shutdown.
	//             The context includes a timeout to ensure graceful termination
	//             doesn't block forever.
	//
	// Performance tuning options:
	//
	//   Concurrency: Maximum number of concurrent connections (default: 256*1024)
	//   ReadBufferSize/WriteBufferSize: Buffer sizes for request/response
	//   ReduceMemoryUsage: Reduces memory but increases CPU (disabled for performance)
	//
	app := fiber.New(fiber.Config{
		// Register services for automatic lifecycle management.
		// Order matters: DatabaseService starts first, terminates last.
		Services: []fiber.Service{
			dbService,  // Started 1st, terminated 2nd
			appService, // Started 2nd, terminated 1st
		},

		// Performance tuning for high concurrency
		Concurrency:       512 * 1024, // Max concurrent connections (512K)
		ReadBufferSize:    8192,       // 8KB read buffer
		WriteBufferSize:   8192,       // 8KB write buffer
		ReduceMemoryUsage: false,      // Don't trade memory for CPU

		// ServicesStartupContextProvider returns a context for service startup.
		//
		// The context includes a 30-second timeout to prevent startup from
		// hanging indefinitely. If a service doesn't start within this timeout,
		// its Start() method will receive a cancelled context.
		//
		// Services should check ctx.Done() during long-running initialization
		// tasks and return early if the context is cancelled.
		ServicesStartupContextProvider: func() context.Context {
			ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
			return ctx
		},

		// ServicesShutdownContextProvider returns a context for service shutdown.
		//
		// The context includes a 30-second timeout for graceful termination.
		// This allows services to:
		//   - Flush pending writes
		//   - Close connections cleanly
		//   - Release external resources
		//
		// If shutdown takes longer than the timeout, services should attempt
		// best-effort cleanup and return.
		ServicesShutdownContextProvider: func() context.Context {
			ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
			return ctx
		},
	})

	// ==========================================================================
	// Route Setup
	// ==========================================================================
	//
	// Configure HTTP routes with the CQRS buses. Routes are organized by domain:
	//
	//   /api/v1/users
	//     POST   /           → CreateUser (UserService)
	//     GET    /           → ListUsers (UserService)
	//     GET    /:id        → GetUser (UserService)
	//     PUT    /:id        → UpdateUser (UserService)
	//     DELETE /:id        → DeleteUser (UserService)
	//
	// The UserService is passed to handlers, encapsulating all user business logic
	// and CQRS operations (write to primary, read from replica).
	routes.SetupRoutes(app, appService.UserService)

	// ==========================================================================
	// Server Startup
	// ==========================================================================
	//
	// Start the HTTP server with the following behavior:
	//
	//   1. Fiber starts all registered services (via Start())
	//   2. Server begins accepting HTTP connections
	//   3. Routes are printed if EnablePrintRoutes is true
	//   4. Server blocks until shutdown signal is received
	//
	// Graceful Shutdown Process:
	//
	//   1. SIGINT or SIGTERM signal is received
	//   2. Server stops accepting new connections
	//   3. Waits up to ShutdownTimeout for in-flight requests
	//   4. Terminates all services in reverse order (via Terminate())
	//   5. Returns from Listen(), causing log.Fatal to exit
	//
	// ListenConfig options:
	//
	//   EnablePrefork: Spawns multiple Go processes (one per CPU core) for
	//                  better performance on multi-core systems. Each process
	//                  listens on the same port using SO_REUSEPORT.
	//                  WARNING: Not compatible with some features like WebSockets.
	//
	//   EnablePrintRoutes: Prints all registered routes on startup for debugging.
	//
	//   ShutdownTimeout: Maximum time to wait for in-flight requests during
	//                    graceful shutdown. After this timeout, connections
	//                    are forcefully closed.
	//
	//   DisableStartupMessage: When false, prints the Fiber ASCII art banner
	//                          and server info on startup.
	log.Fatal(app.Listen(":"+cfg.Server.Port, fiber.ListenConfig{
		// Enable prefork for multi-core performance.
		// This spawns multiple processes that share the same port.
		EnablePrefork: cfg.Server.EnablePrefork,

		// Print all routes on startup for debugging.
		EnablePrintRoutes: true,

		// Maximum time to wait for graceful shutdown of HTTP connections.
		// This is separate from the service shutdown timeout.
		ShutdownTimeout: 30 * time.Second,

		// Show the Fiber startup banner with server information.
		DisableStartupMessage: true,
	}))
}
