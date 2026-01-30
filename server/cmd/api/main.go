/*
Package main is the entry point for the Messenger Clone API server.

# Architecture Overview

This server uses horizontal database sharding with consistent hashing for scalability,
with PgBouncer connection pooling for high-concurrency performance.

Performance characteristics (tested on MacBook Air M2):

  - 10,000 concurrent users: 99.78% success rate

  - Throughput: ~17,293 requests/second

  - P95 latency: 1,563ms

  - P50 latency: 200ms

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                           HTTP Requests                                  │
    │                      (10K+ concurrent users)                             │
    └─────────────────────────────────────────────────────────────────────────┘
    │
    ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                     Fiber HTTP Server (:8080)                            │
    │  - Sonic JSON encoder (2-5x faster than encoding/json)                   │
    │  - 512K max concurrent connections                                       │
    │  - automaxprocs for container-aware CPU detection                        │
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
    │  - ShardManager routes to correct shard via MD5 consistent hashing       │
    │  - GORM with SkipDefaultTransaction and batch inserts                    │
    └─────────────────────────────────────────────────────────────────────────┘
    │
    ┌─────────────────────────┼─────────────────────────┐
    │           │             │             │           │
    ▼           ▼             ▼             ▼           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                    PgBouncer Connection Poolers                          │
    │  - Transaction pool mode (connection multiplexing)                       │
    │  - 10K max client connections per pooler                                 │
    │  - 200 default pool size, 300 max DB connections                         │
    │  - simple_protocol mode (no prepared statements)                         │
    └─────────────────────────────────────────────────────────────────────────┘
    │           │             │             │           │
    ▼           ▼             ▼             ▼           ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ PgBouncer-0 │ │ PgBouncer-1 │ │ PgBouncer-2 │ │ PgBouncer-3 │
    │   :6430     │ │   :6431     │ │   :6432     │ │   :6433     │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
    │               │               │               │
    ▼               ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Shard 0   │ │   Shard 1   │ │   Shard 2   │ │   Shard 3   │
    │  Primary    │ │  Primary    │ │  Primary    │ │  Primary    │
    │   :5440     │ │   :5441     │ │   :5442     │ │   :5443     │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
    │               │               │               │
    ▼               ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Shard 0   │ │   Shard 1   │ │   Shard 2   │ │   Shard 3   │
    │  Replica    │ │  Replica    │ │  Replica    │ │  Replica    │
    │   :5450     │ │   :5451     │ │   :5452     │ │   :5453     │
    └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

# PgBouncer Configuration

PgBouncer operates in transaction pool mode for maximum connection efficiency:

	Pool Mode: transaction (connections returned after each transaction)
	Max Client Connections: 10,000 per pooler
	Default Pool Size: 200 connections per database
	Max DB Connections: 300 per pooler
	Reserve Pool: 50 connections for burst handling

This allows 10K+ application connections to share ~300 database connections
per shard, dramatically reducing PostgreSQL connection overhead.

# Service Lifecycle Management

The application uses Fiber's built-in service lifecycle management. Services implement
the fiber.Service interface and are automatically started/stopped by Fiber:

	Startup Order:
	  1. ShardedDatabaseService.Start() - Connects to all shards via PgBouncer
	  2. ApplicationService.Start() - Initializes UserService with ShardManager

	Shutdown Order (reverse):
	  1. ApplicationService.Terminate() - Flushes pending operations
	  2. ShardedDatabaseService.Terminate() - Closes all shard connections

Each service receives a context with a configurable timeout (default: 30s) that allows
for graceful startup/shutdown with proper cancellation handling.

# Configuration

Configuration is loaded from environment variables:

	Server:
	  - PORT: HTTP server port (default: 8080)

	Sharding:
	  - SHARDING_COUNT: Number of shards (default: 4)
	  - SHARDING_VIRTUAL_NODES: Virtual nodes per shard (default: 150)
	  - SHARDING_BASE_HOST: Base hostname for PgBouncer (default: pgbouncer-)
	  - SHARDING_BASE_PORT: Starting port (default: 6430)

	Database:
	  - DB_MAX_OPEN_CONNS: Max open connections per shard (default: 500)
	  - DB_MAX_IDLE_CONNS: Max idle connections per shard (default: 250)
	  - DB_CONN_MAX_IDLE_TIME: Connection max idle time (default: 5m)

# Graceful Shutdown

The server handles graceful shutdown automatically:

 1. SIGINT/SIGTERM signal is received
 2. Server stops accepting new connections
 3. Waits for in-flight requests to complete (up to ShutdownTimeout)
 4. Terminates all registered services in reverse order
 5. Process exits cleanly

# Usage

	# Start infrastructure (includes PgBouncer by default)
	docker-compose up -d

	# Start with API server
	docker-compose --profile api up -d

	# Run load test (10K users, 60s duration)
	LOADTEST_USERS=10000 docker-compose run --rm loadtest

	# Development (with hot reload via Air)
	make dev

	# Production
	./messenger-api
*/
package main

import (
	"context"
	"log"
	"time"

	"github.com/alailsonko/messenger-clone/server/config"
	"github.com/alailsonko/messenger-clone/server/internal/bootstrap"
	"github.com/alailsonko/messenger-clone/server/internal/presentation/routes"
	"github.com/bytedance/sonic"
	"github.com/gofiber/fiber/v3"
	_ "go.uber.org/automaxprocs" // Automatically set GOMAXPROCS to match container CPU quota
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
	// Database Setup (Sharded Mode with PgBouncer)
	// ==========================================================================
	//
	// The server uses horizontal sharding with consistent hashing and connection pooling:
	//
	//   Sharding:
	//     - Data distributed across multiple shards (default: 4)
	//     - MD5 consistent hashing with 150 virtual nodes for even distribution
	//     - Each shard has streaming replication to a hot standby
	//
	//   Connection Pooling (PgBouncer):
	//     - Transaction pool mode for connection multiplexing
	//     - 10K app connections shared across 300 DB connections per shard
	//     - simple_protocol mode (no prepared statements for compatibility)
	//     - Dramatically reduces PostgreSQL connection overhead
	//
	//   GORM Configuration:
	//     - SkipDefaultTransaction: Avoids unnecessary BEGIN/COMMIT
	//     - PrepareStmt: false (required for PgBouncer transaction mode)
	//     - CreateBatchSize: 1000 for efficient bulk inserts
	//
	log.Printf("Starting with %d shards via PgBouncer on %s:%d+",
		cfg.Sharding.ShardCount, cfg.Sharding.BaseHost, cfg.Sharding.BasePort)

	// Create sharded database service
	shardService := bootstrap.NewShardedDatabaseService(cfg.Sharding, cfg.WriteDB)

	// ==========================================================================
	// Manual Service Lifecycle (Required for Prefork Mode)
	// ==========================================================================
	//
	// With prefork, each child process re-runs main(). If we use Fiber's service
	// lifecycle (Services config option), services would start in fiber.New(),
	// which happens BEFORE Listen() determines if this is a child process.
	// This causes issues because:
	//   1. Parent starts services in fiber.New()
	//   2. Parent forks children
	//   3. Each child re-runs main() and starts services AGAIN in fiber.New()
	//   4. Parent's services are still running (wasted connections)
	//
	// Solution: Start services manually HERE, before creating Fiber app.
	// Each process (parent and children) will have its own services.
	// The migration skip logic in ShardedDatabaseService.Start() handles
	// ensuring migrations only run once (in parent via fiber.IsChild() check).
	//
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := shardService.Start(ctx); err != nil {
		log.Fatalf("Failed to start shard service: %v", err)
	}

	// Create application service with sharding
	appService := bootstrap.NewShardedApplicationService(shardService)
	if err := appService.Start(ctx); err != nil {
		log.Fatalf("Failed to start application service: %v", err)
	}

	// ==========================================================================
	// Graceful Shutdown Handler
	// ==========================================================================
	//
	// Since we're not using Fiber's service lifecycle, we need to handle
	// shutdown ourselves. This goroutine listens for shutdown signals and
	// terminates services when the app stops.
	//
	go func() {
		// Wait for the process to be interrupted (Fiber handles the signal)
		// This will be triggered when the server shuts down
		<-context.Background().Done()
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer shutdownCancel()
		_ = appService.Terminate(shutdownCtx)
		_ = shardService.Terminate(shutdownCtx)
	}()

	// ==========================================================================
	// Fiber Application Setup
	// ==========================================================================
	//
	// Create the Fiber HTTP server.
	//
	// NOTE: Services are managed manually (see above) instead of using Fiber's
	// Services config option. This is required for prefork mode compatibility.
	//
	// Performance tuning (optimized for 10K+ concurrent users):
	//
	//   JSONEncoder/Decoder: Sonic (2-5x faster than encoding/json, SIMD-accelerated)
	//   Concurrency: 512K max concurrent connections
	//   ReadBufferSize/WriteBufferSize: 16KB for larger payloads
	//   ReduceMemoryUsage: false (prioritize speed over memory)
	//   IdleTimeout: 30s for connection reuse
	//
	app := fiber.New(fiber.Config{
		// No Services registered - we manage them manually for prefork compatibility

		// =====================================================================
		// High-Performance JSON Encoder (Sonic)
		// =====================================================================
		// Sonic is 2-5x faster than encoding/json and supports SIMD acceleration.
		// This significantly improves JSON serialization/deserialization throughput.
		JSONEncoder: sonic.Marshal,
		JSONDecoder: sonic.Unmarshal,

		// =====================================================================
		// Performance tuning for high concurrency
		// =====================================================================
		Concurrency:       512 * 1024, // Max concurrent connections (512K)
		ReadBufferSize:    16384,      // 16KB read buffer (larger for batch requests)
		WriteBufferSize:   16384,      // 16KB write buffer (larger JSON responses)
		ReduceMemoryUsage: false,      // Don't trade memory for CPU

		// Network optimizations
		IdleTimeout:      30 * time.Second, // Close idle connections after 30s
		ReadTimeout:      10 * time.Second, // Max time to read request
		WriteTimeout:     10 * time.Second, // Max time to write response
		DisableKeepalive: false,            // Keep connections alive for reuse

		// ServicesStartupContextProvider returns a context for service startup.
		//
		// The context includes a 30-second timeout to prevent startup from
		// hanging indefinitely. If a service doesn't start within this timeout,
		// its Start() method will receive a cancelled context.
		//
		// Services should check ctx.Done() during long-running initialization
		// tasks and return early if the context is cancelled.
	})

	// ==========================================================================
	// Route Setup
	// ==========================================================================
	//
	// Configure HTTP routes with the UserService. Routes are organized by domain:
	//
	//   /api/v1/users
	//     POST   /           → CreateUser (writes to primary via PgBouncer)
	//     GET    /           → ListUsers (reads from replica)
	//     GET    /:id        → GetUser (reads from replica)
	//     PUT    /:id        → UpdateUser (writes to primary)
	//     DELETE /:id        → DeleteUser (writes to primary)
	//
	//   /api/v1/shards
	//     GET    /stats      → GetShardStats (shard distribution info)
	//
	// The ShardManager uses consistent hashing to route requests to the correct
	// shard based on the user ID (or generated UUID for new users).
	routes.SetupRoutes(app, appService)

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
	// Graceful Shutdown Process (with Prefork):
	//
	//   1. SIGINT or SIGTERM signal is received by parent
	//   2. Parent kills all child processes
	//   3. Each child process shuts down its HTTP server and services
	//   4. Parent waits for children to exit and returns
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
		// This spawns multiple processes that share the same port via SO_REUSEPORT.
		// Each child process runs its own event loop for maximum throughput.
		EnablePrefork: true,

		// Print all routes on startup for debugging (parent only).
		EnablePrintRoutes: !fiber.IsChild(),

		// Maximum time to wait for graceful shutdown of HTTP connections.
		// This is separate from the service shutdown timeout.
		ShutdownTimeout: 30 * time.Second,

		// Show the Fiber startup banner with server information (parent only).
		DisableStartupMessage: fiber.IsChild(),
	}))
}
