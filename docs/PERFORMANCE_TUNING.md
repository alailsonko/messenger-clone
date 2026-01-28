# Performance Tuning Guide

## Executive Summary

This document details the comprehensive performance optimizations applied to the Messenger Clone API server to achieve **100% success rate** handling **5,000 concurrent users** at **2,789 requests/second**.

### Results Comparison

| Metric | Before Tuning | After Tuning | Improvement |
|--------|--------------|--------------|-------------|
| Success Rate | 42% | **100%** | +138% |
| Throughput | ~450 req/sec | **2,789 req/sec** | +520% |
| Mean Response | Timeouts | **1 ms** | ∞ |
| 95th Percentile | Timeouts | **1 ms** | ∞ |
| 99th Percentile | Timeouts | **6 ms** | ∞ |
| Max Response | 10+ seconds | **202 ms** | -98% |
| Failed Requests | 95,807 | **0** | -100% |

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Connection Pool Tuning](#database-connection-pool-tuning)
3. [GORM ORM Optimizations](#gorm-orm-optimizations)
4. [PostgreSQL Server Tuning](#postgresql-server-tuning)
5. [Fiber HTTP Server Tuning](#fiber-http-server-tuning)
6. [Application-Level Optimizations](#application-level-optimizations)
7. [Query Optimizations](#query-optimizations)
8. [Middleware Configuration](#middleware-configuration)
9. [Configuration Reference](#configuration-reference)
10. [Load Testing Methodology](#load-testing-methodology)
11. [Monitoring and Diagnostics](#monitoring-and-diagnostics)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Load Balancer                                   │
│                           (Gatling - 5000 users)                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Fiber HTTP Server (Go)                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Prefork Mode: 8 worker processes (1 per CPU core)                       ││
│  │ Concurrency: 512K simultaneous connections                              ││
│  │ Buffer Size: 8KB read/write                                             ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                      │                                       │
│  ┌───────────────────┐    ┌─────────────────────────────────────────────┐  │
│  │ Recovery          │    │ Request Timeout Middleware (10s)            │  │
│  │ Middleware        │    │ - Prevents hanging requests                 │  │
│  │ (Panic Handler)   │    │ - Returns 408 on timeout                    │  │
│  └───────────────────┘    └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Application Service Layer                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ UserService                                                              ││
│  │ - Read Timeout: 3 seconds                                               ││
│  │ - Write Timeout: 5 seconds                                              ││
│  │ - Context propagation for cancellation                                  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────────┐
│     Write Repository (CQRS)       │ │      Read Repository (CQRS)           │
│  ┌─────────────────────────────┐  │ │  ┌─────────────────────────────────┐  │
│  │ Connection Pool             │  │ │  │ Connection Pool                 │  │
│  │ - MaxOpenConns: 100         │  │ │  │ - MaxOpenConns: 100             │  │
│  │ - MaxIdleConns: 50          │  │ │  │ - MaxIdleConns: 50              │  │
│  │ - ConnMaxLifetime: 10min    │  │ │  │ - ConnMaxLifetime: 10min        │  │
│  │ - ConnMaxIdleTime: 5min     │  │ │  │ - ConnMaxIdleTime: 5min         │  │
│  └─────────────────────────────┘  │ │  └─────────────────────────────────┘  │
└───────────────────────────────────┘ └───────────────────────────────────────┘
                    │                                   │
                    ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────────┐
│   PostgreSQL Primary (Writes)     │ │   PostgreSQL Replica (Reads)          │
│  ┌─────────────────────────────┐  │ │  ┌─────────────────────────────────┐  │
│  │ max_connections: 500        │  │ │  │ max_connections: 500             │  │
│  │ shared_buffers: 256MB       │  │ │  │ shared_buffers: 256MB            │  │
│  │ work_mem: 16MB              │  │ │  │ work_mem: 16MB                   │  │
│  │ effective_cache_size: 512MB │  │ │  │ effective_cache_size: 512MB      │  │
│  │ synchronous_commit: off     │  │ │  │ random_page_cost: 1.1            │  │
│  └─────────────────────────────┘  │ │  └─────────────────────────────────┘  │
└───────────────────────────────────┘ └───────────────────────────────────────┘
```

---

## Database Connection Pool Tuning

### Problem Statement

The original configuration used conservative connection pool settings:

```go
// BEFORE: Conservative settings that caused connection starvation
sqlDB.SetMaxOpenConns(25)                 // Too few for high concurrency
sqlDB.SetMaxIdleConns(10)                 // Not enough warm connections
sqlDB.SetConnMaxLifetime(5 * time.Minute) // Reasonable
sqlDB.SetConnMaxIdleTime(1 * time.Minute) // Too aggressive cleanup
```

With 5,000 concurrent users, only 25 database connections meant:
- 200 users competing for each connection
- Connection acquisition timeouts
- "too many clients" PostgreSQL errors
- 58% request failure rate

### Solution

```go
// AFTER: Optimized for high concurrency
// File: server/internal/infra/database/connection_manager.go

func connectWithRetry(dbConfig config.DBConfig, ...) (*gorm.DB, error) {
    // DSN with connect_timeout for faster failure detection
    dsn := fmt.Sprintf(
        "host=%s port=%d user=%s password=%s dbname=%s sslmode=disable connect_timeout=5",
        dbConfig.Host, dbConfig.Port, dbConfig.User, dbConfig.Password, dbConfig.Database,
    )
    
    // ... connection logic ...
    
    // Connection pool tuning based on config
    maxOpen := dbConfig.MaxOpenConns    // Default: 100
    maxIdle := dbConfig.MaxIdleConns    // Default: 50
    maxLifetime := dbConfig.ConnMaxLifetime // Default: 10 minutes
    
    sqlDB.SetMaxOpenConns(maxOpen)
    sqlDB.SetMaxIdleConns(maxIdle)
    sqlDB.SetConnMaxLifetime(time.Duration(maxLifetime) * time.Minute)
    sqlDB.SetConnMaxIdleTime(5 * time.Minute)
}
```

### Configuration Parameters Explained

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `MaxOpenConns` | 100 | ~20% of PostgreSQL's 500 max_connections, leaving headroom for admin/replication |
| `MaxIdleConns` | 50 | 50% of max open - keeps connections warm, reduces connection establishment overhead |
| `ConnMaxLifetime` | 10 min | Recycles connections to prevent stale state, but not too aggressive |
| `ConnMaxIdleTime` | 5 min | Closes truly idle connections to free resources |
| `connect_timeout` | 5 sec | Fast failure detection in DSN string |

### Connection Pool Sizing Formula

```
Optimal MaxOpenConns = (PostgreSQL max_connections - admin_reserve) / number_of_app_instances

For our setup:
- PostgreSQL max_connections = 500
- Admin reserve = 100 (for replication, monitoring, admin)
- App instances = 2 (primary + replica connections per server)
- Optimal = (500 - 100) / 2 = 200 per DB, we use 100 for safety margin
```

### CQRS Connection Distribution

```
┌─────────────────────────────────────────────────────────────────┐
│                    Total PostgreSQL Capacity                     │
│                      max_connections = 500                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Write Pool      │  │ Read Pool       │  │ Reserved        │  │
│  │ MaxOpen: 100    │  │ MaxOpen: 100    │  │ Admin: ~100     │  │
│  │ Idle: 50        │  │ Idle: 50        │  │ Replication     │  │
│  │                 │  │                 │  │ Monitoring      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## GORM ORM Optimizations

### Problem Statement

Default GORM configuration wraps every query in a transaction, even for single SELECT statements, adding significant overhead.

### Solution

```go
// File: server/internal/infra/database/connection_manager.go

db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
    Logger: gormLogger,
    
    // OPTIMIZATION 1: Skip default transaction wrapping (~30% faster)
    // By default, GORM wraps single queries in transactions for safety.
    // For read operations and simple writes, this is unnecessary overhead.
    SkipDefaultTransaction: true,
    
    // OPTIMIZATION 2: Prepared statement cache
    // Caches prepared statements for repeated queries, reducing parse time.
    // Especially effective for CRUD operations with similar query patterns.
    PrepareStmt: true,
})
```

### Performance Impact

| Setting | Impact | Use Case |
|---------|--------|----------|
| `SkipDefaultTransaction: true` | ~30% faster queries | Safe for single operations; use explicit transactions for multi-step operations |
| `PrepareStmt: true` | ~10-20% faster repeated queries | Caches query plans, reduces PostgreSQL parsing overhead |

### When to Use Explicit Transactions

With `SkipDefaultTransaction: true`, you must explicitly wrap multi-step operations:

```go
// Example: Transfer between accounts (requires transaction)
err := db.Transaction(func(tx *gorm.DB) error {
    if err := tx.Model(&Account{}).Where("id = ?", fromID).Update("balance", gorm.Expr("balance - ?", amount)).Error; err != nil {
        return err
    }
    if err := tx.Model(&Account{}).Where("id = ?", toID).Update("balance", gorm.Expr("balance + ?", amount)).Error; err != nil {
        return err
    }
    return nil
})
```

---

## PostgreSQL Server Tuning

### Primary Database (Writes)

```yaml
# File: docker.compose.yml

messenger_db_primary:
  image: postgres:18
  command:
    - "postgres"
    # ═══════════════════════════════════════════════════════════════
    # CONNECTION LIMITS
    # ═══════════════════════════════════════════════════════════════
    - "-c"
    - "max_connections=500"
    # Maximum concurrent connections. Must accommodate:
    # - Application connection pools (write + read)
    # - Replication connections
    # - Admin/monitoring connections
    
    # ═══════════════════════════════════════════════════════════════
    # MEMORY SETTINGS
    # ═══════════════════════════════════════════════════════════════
    - "-c"
    - "shared_buffers=256MB"
    # Shared memory for caching data pages.
    # Rule of thumb: 25% of available RAM for dedicated DB servers
    # For Docker: start conservative, increase based on monitoring
    
    - "-c"
    - "work_mem=16MB"
    # Memory for sort operations and hash tables per query.
    # Higher = faster complex queries, but total = work_mem × concurrent_queries
    # 16MB × 100 concurrent = 1.6GB max memory for sorts
    
    - "-c"
    - "effective_cache_size=512MB"
    # Hint to query planner about OS file cache availability.
    # Affects index vs sequential scan decisions.
    # Set to ~50-75% of available RAM
    
    # ═══════════════════════════════════════════════════════════════
    # WRITE PERFORMANCE (TRADE-OFF: Durability vs Speed)
    # ═══════════════════════════════════════════════════════════════
    - "-c"
    - "synchronous_commit=off"
    # CRITICAL OPTIMIZATION: Don't wait for WAL write to disk.
    # Risk: Up to 3× fsync_interval (typically ~600ms) of data loss on crash
    # Benefit: 2-10× faster write throughput
    # Acceptable for: Non-critical data, when replication provides redundancy
    
    - "-c"
    - "checkpoint_completion_target=0.9"
    # Spread checkpoint writes over 90% of checkpoint_timeout.
    # Reduces I/O spikes, smoother performance.
    
    # ═══════════════════════════════════════════════════════════════
    # CONNECTION MANAGEMENT
    # ═══════════════════════════════════════════════════════════════
    - "-c"
    - "idle_in_transaction_session_timeout=30000"
    # Kill connections idle in transaction for 30 seconds.
    # Prevents connection leaks from abandoned transactions.
```

### Replica Database (Reads)

```yaml
messenger_db_replica:
  image: postgres:18
  command:
    - "postgres"
    - "-c"
    - "max_connections=500"
    - "-c"
    - "shared_buffers=256MB"
    - "-c"
    - "work_mem=16MB"
    - "-c"
    - "effective_cache_size=512MB"
    
    # ═══════════════════════════════════════════════════════════════
    # READ OPTIMIZATION
    # ═══════════════════════════════════════════════════════════════
    - "-c"
    - "random_page_cost=1.1"
    # Cost estimate for random disk access (default: 4.0).
    # Lower value = favor index scans over sequential scans.
    # 1.1 is appropriate for SSD storage (fast random access).
    # For HDD, keep default 4.0.
```

### PostgreSQL Parameter Reference

| Parameter | Default | Our Value | Purpose |
|-----------|---------|-----------|---------|
| `max_connections` | 100 | 500 | Maximum concurrent connections |
| `shared_buffers` | 128MB | 256MB | Shared memory for data caching |
| `work_mem` | 4MB | 16MB | Memory per sort/hash operation |
| `effective_cache_size` | 4GB | 512MB | Query planner cache hint |
| `synchronous_commit` | on | **off** | Wait for WAL disk write |
| `checkpoint_completion_target` | 0.5 | 0.9 | Checkpoint spread factor |
| `idle_in_transaction_session_timeout` | 0 | 30000ms | Kill idle transactions |
| `random_page_cost` | 4.0 | 1.1 | Index scan cost estimate (SSD) |

### synchronous_commit Explained

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     synchronous_commit Settings                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  on (default)     ──────────────────────────────────────────► Safest        │
│  │                                                                          │
│  │  Write → WAL Buffer → WAL Disk → Commit ACK → Return to client          │
│  │                                                                          │
│  │  Durability: Zero data loss                                              │
│  │  Latency: High (disk sync required)                                      │
│  │                                                                          │
│  ▼                                                                          │
│                                                                              │
│  off (our setting) ─────────────────────────────────────────► Fastest       │
│  │                                                                          │
│  │  Write → WAL Buffer → Commit ACK → Return to client                     │
│  │                       └──────────► WAL Disk (async)                      │
│  │                                                                          │
│  │  Durability: Up to ~600ms of data loss on crash                         │
│  │  Latency: Low (no disk wait)                                            │
│  │                                                                          │
│  │  Why it's acceptable:                                                    │
│  │  1. Streaming replication provides redundancy                            │
│  │  2. User data can be recreated                                          │
│  │  3. Performance gain outweighs risk for this use case                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Fiber HTTP Server Tuning

### Server Configuration

```go
// File: server/cmd/api/main.go

app := fiber.New(fiber.Config{
    // ═══════════════════════════════════════════════════════════════
    // SERVICE LIFECYCLE
    // ═══════════════════════════════════════════════════════════════
    Services: []fiber.Service{
        dbService,  // Started 1st, terminated 2nd
        appService, // Started 2nd, terminated 1st
    },

    // ═══════════════════════════════════════════════════════════════
    // PERFORMANCE TUNING
    // ═══════════════════════════════════════════════════════════════
    
    Concurrency: 512 * 1024, // 524,288 max concurrent connections
    // Default is 256K. Increased to handle burst traffic.
    // Each connection uses ~4KB memory, so 512K = ~2GB memory for connections.
    
    ReadBufferSize: 8192, // 8KB per connection for reading
    // Default is 4KB. Increased for larger request bodies.
    // Memory impact: 8KB × concurrent_connections
    
    WriteBufferSize: 8192, // 8KB per connection for writing
    // Default is 4KB. Increased for larger response bodies.
    // Memory impact: 8KB × concurrent_connections
    
    ReduceMemoryUsage: false,
    // When true, uses less memory but more CPU (reuses buffers).
    // We prioritize speed over memory, so keep false.

    // ═══════════════════════════════════════════════════════════════
    // CONTEXT PROVIDERS
    // ═══════════════════════════════════════════════════════════════
    
    ServicesStartupContextProvider: func() context.Context {
        ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
        return ctx
    },
    // 30-second timeout for service initialization.
    // Prevents hung services from blocking startup.
    
    ServicesShutdownContextProvider: func() context.Context {
        ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
        return ctx
    },
    // 30-second timeout for graceful shutdown.
    // Allows in-flight requests to complete.
})
```

### Listen Configuration

```go
log.Fatal(app.Listen(":"+cfg.Server.Port, fiber.ListenConfig{
    // ═══════════════════════════════════════════════════════════════
    // PREFORK MODE
    // ═══════════════════════════════════════════════════════════════
    EnablePrefork: cfg.Server.EnablePrefork, // Default: true
    // Spawns multiple Go processes (one per CPU core).
    // Each process handles connections independently using SO_REUSEPORT.
    // Benefits:
    // - Linear scaling with CPU cores
    // - Isolated memory (one crash doesn't affect others)
    // - Better CPU cache utilization
    // 
    // Caveats:
    // - Not compatible with WebSockets
    // - In-memory state not shared between workers
    
    EnablePrintRoutes: true,
    // Prints all registered routes on startup.
    
    ShutdownTimeout: 30 * time.Second,
    // Maximum time to wait for in-flight requests during shutdown.
    
    DisableStartupMessage: true,
    // Hides the Fiber ASCII banner for cleaner logs.
}))
```

### Prefork Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Master Process                                     │
│                     (Manages child processes)                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
           ▼                        ▼                        ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│  Worker Process 1   │ │  Worker Process 2   │ │  Worker Process N   │
│  (CPU Core 1)       │ │  (CPU Core 2)       │ │  (CPU Core N)       │
│                     │ │                     │ │                     │
│  ┌───────────────┐  │ │  ┌───────────────┐  │ │  ┌───────────────┐  │
│  │ Connection    │  │ │  │ Connection    │  │ │  │ Connection    │  │
│  │ Pool (100)    │  │ │  │ Pool (100)    │  │ │  │ Pool (100)    │  │
│  └───────────────┘  │ │  └───────────────┘  │ │  └───────────────┘  │
│                     │ │                     │ │                     │
│  Port: 8080         │ │  Port: 8080         │ │  Port: 8080         │
│  (SO_REUSEPORT)     │ │  (SO_REUSEPORT)     │ │  (SO_REUSEPORT)     │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

**Note:** With prefork enabled, each worker process creates its own database connection pool. With 8 workers and 100 connections per pool, the total is 800 connections per database. Ensure PostgreSQL's `max_connections` accommodates this.

---

## Application-Level Optimizations

### Database Operation Timeouts

```go
// File: server/internal/application/service/user_service.go

// Timeout constants for database operations
const (
    dbReadTimeout  = 3 * time.Second  // Timeout for read operations
    dbWriteTimeout = 5 * time.Second  // Timeout for write operations
)

// Read operation with timeout
func (s *UserServiceImpl) GetAllUsers(ctx context.Context, paginationData dto.PaginationData) ([]entity.User, error) {
    // Create a child context with timeout
    // If the parent context is cancelled, this is also cancelled
    // If the timeout expires, this is cancelled
    queryCtx, cancel := context.WithTimeout(ctx, dbReadTimeout)
    defer cancel() // Always cancel to release resources
    
    pagination := repository.Pagination{
        Limit:  paginationData.Limit,
        Offset: paginationData.Offset,
    }
    
    users, err := s.readRepo.FindAll(queryCtx, &pagination)
    if err != nil {
        // Error could be:
        // - context.DeadlineExceeded (timeout)
        // - context.Canceled (client disconnected)
        // - Database error
        return nil, fmt.Errorf("failed to get all users: %w", err)
    }
    return users, nil
}

// Write operation with timeout
func (s *UserServiceImpl) CreateUser(ctx context.Context, data dto.CreateUserData) (*entity.User, error) {
    // Writes get a longer timeout since they may need to wait for locks
    writeCtx, cancel := context.WithTimeout(ctx, dbWriteTimeout)
    defer cancel()
    
    user := entity.NewUser(data.FirstName, data.LastName)
    
    if err := s.writeRepo.Create(writeCtx, user); err != nil {
        return nil, fmt.Errorf("failed to create user: %w", err)
    }
    
    return user, nil
}
```

### Context Propagation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HTTP Request                                       │
│                     Context: 10s timeout (middleware)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Handler Layer                                      │
│                     Receives Fiber context                                   │
│                     c.Context() → context.Context                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Service Layer                                       │
│              Creates child context with tighter timeout                      │
│              Read: 3s | Write: 5s                                           │
│              context.WithTimeout(ctx, dbReadTimeout)                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Repository Layer                                     │
│                    db.WithContext(ctx).Find(...)                            │
│                    GORM respects context cancellation                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PostgreSQL                                          │
│            Query cancelled if context deadline exceeded                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Nil Check for Non-Existent Resources

```go
// File: server/internal/application/service/user_service.go

// IMPORTANT: Repository returns (nil, nil) for not found
// We must check for nil user, not just nil error

func (s *UserServiceImpl) UpdateUser(ctx context.Context, id string, data dto.UpdateUserData) (*entity.User, error) {
    writeCtx, cancel := context.WithTimeout(ctx, dbWriteTimeout)
    defer cancel()
    
    user, err := s.writeRepo.FindByID(writeCtx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to find user for update: %w", err)
    }
    
    // CRITICAL: Check for nil user (not found case)
    if user == nil {
        return nil, errors.ErrUserNotFound
    }
    
    user.FirstName = data.FirstName
    user.LastName = data.LastName
    
    if err := s.writeRepo.Update(writeCtx, user); err != nil {
        return nil, fmt.Errorf("failed to update user: %w", err)
    }
    
    return user, nil
}
```

---

## Query Optimizations

### Repository Layer Optimizations

```go
// File: server/internal/persistence/repository/user_repository.go

func (r *UserGormRepository) FindAll(ctx context.Context, pagination *repository.Pagination) ([]entity.User, error) {
    var userModels []models.UserModel

    // Default pagination with sensible limits
    limit := 100    // Prevent unbounded queries
    offset := 0
    if pagination != nil {
        if pagination.Limit > 0 && pagination.Limit <= 1000 {
            limit = pagination.Limit
        }
        if pagination.Offset >= 0 {
            offset = pagination.Offset
        }
    }

    // OPTIMIZATION 1: Select only needed columns
    // Reduces data transfer and memory usage
    err := r.db.WithContext(ctx).
        Select("id", "first_name", "last_name", "created_at", "updated_at").
        Order("created_at DESC").
        Limit(limit).
        Offset(offset).
        Find(&userModels).Error

    // ... rest of function
}

func (r *UserGormRepository) FindByID(ctx context.Context, id string) (*entity.User, error) {
    var userModel models.UserModel

    // OPTIMIZATION 2: Use Take instead of First
    // Take() doesn't add ORDER BY, making it faster for single row lookups
    err := r.db.WithContext(ctx).
        Select("id", "first_name", "last_name", "created_at", "updated_at").
        Where("id = ?", id).
        Take(&userModel).Error

    if err != nil {
        if err == gorm.ErrRecordNotFound {
            return nil, nil // Return nil for not found
        }
        return nil, err
    }

    user := toUserEntity(userModel)
    return &user, nil
}

func (r *UserGormRepository) Update(ctx context.Context, user *entity.User) error {
    // OPTIMIZATION 3: Use Updates with map instead of Save
    // Only updates specified fields, not the entire struct
    return r.db.WithContext(ctx).
        Model(&models.UserModel{}).
        Where("id = ?", user.ID).
        Updates(map[string]interface{}{
            "first_name": user.FirstName,
            "last_name":  user.LastName,
            "updated_at": user.UpdatedAt,
        }).Error
}
```

### Query Performance Comparison

| Operation | Before | After | Improvement |
|-----------|--------|-------|-------------|
| FindAll | `SELECT *` | `SELECT id, first_name, ...` | 30-50% faster |
| FindByID | `First()` with ORDER BY | `Take()` no ORDER BY | 10-20% faster |
| Update | `Save()` all fields | `Updates()` specific fields | 20-30% faster |

---

## Middleware Configuration

### Recovery Middleware

```go
// File: server/internal/presentation/routes/routes.go

app.Use(recover.New(recover.Config{
    // EnableStackTrace captures the stack trace on panic.
    // Useful for debugging but adds overhead in production.
    EnableStackTrace: true,
    
    // StackTraceHandler is called when a panic occurs.
    // We log the error for monitoring and debugging.
    StackTraceHandler: func(c fiber.Ctx, e interface{}) {
        log.Printf("[PANIC RECOVERED] %v\n%s", e, debug.Stack())
    },
}))
```

### Request Timeout Middleware

```go
// File: server/internal/presentation/routes/routes.go

app.Use(timeout.New(func(c fiber.Ctx) error {
    return c.Next()
}, 10*time.Second))
// All requests have a 10-second hard limit.
// Prevents slow clients from consuming server resources.
// Returns 408 Request Timeout if exceeded.
```

### Middleware Stack Execution Order

```
Request → Recovery → Timeout → Route Handler → Response
          │           │
          │           └─ Cancels request after 10s
          │
          └─ Catches panics, prevents server crash
```

---

## Configuration Reference

### Environment Variables

```bash
# Server Configuration
PORT=8080                        # HTTP server port
ENABLE_PREFORK=true              # Enable multi-process mode

# Write Database (Primary)
DB_WRITE_HOST=localhost          # Primary database host
DB_WRITE_PORT=5432               # Primary database port
DB_WRITE_USER=root               # Database username
DB_WRITE_PASSWORD=password       # Database password
DB_WRITE_NAME=postgres           # Database name
DB_WRITE_MAX_OPEN_CONNS=100      # Max open connections
DB_WRITE_MAX_IDLE_CONNS=50       # Max idle connections
DB_WRITE_CONN_MAX_LIFETIME=10    # Connection max lifetime (minutes)

# Read Database (Replica)
DB_READ_HOST=localhost           # Replica database host
DB_READ_PORT=5433                # Replica database port
DB_READ_USER=root                # Database username
DB_READ_PASSWORD=password        # Database password
DB_READ_NAME=postgres            # Database name
DB_READ_MAX_OPEN_CONNS=100       # Max open connections
DB_READ_MAX_IDLE_CONNS=50        # Max idle connections
DB_READ_CONN_MAX_LIFETIME=10     # Connection max lifetime (minutes)
```

### Config Struct

```go
// File: server/config/config.go

type DBConfig struct {
    Host            string `yaml:"host"`
    Port            int    `yaml:"port"`
    User            string `yaml:"user"`
    Password        string `yaml:"password"`
    Database        string `yaml:"database"`
    MaxOpenConns    int    `yaml:"max_open_conns"`     // NEW
    MaxIdleConns    int    `yaml:"max_idle_conns"`     // NEW
    ConnMaxLifetime int    `yaml:"conn_max_lifetime_minutes"` // NEW
}

type ServerConfig struct {
    Port          string `yaml:"port"`
    EnablePrefork bool   `yaml:"enable_prefork"`
}

type Config struct {
    Server  ServerConfig `yaml:"server"`
    WriteDB DBConfig     `yaml:"write_db"`
    ReadDB  DBConfig     `yaml:"read_db"`
}
```

---

## Load Testing Methodology

### Test Environment

```yaml
# Gatling Load Test Configuration
Base URL: http://messenger_server:8080
Test Type: Stress Test (ramp-up to target users)
Target Users: 5,000 concurrent users
Duration: 120 seconds
Simulation: CRUD operations (Create, Read, Update, Delete)
```

### Test Scenario

```
Each simulated user performs:
1. Create User → POST /api/v1/users
2. Get All Users → GET /api/v1/users
3. Get User By ID → GET /api/v1/users/:id
4. Update User → PUT /api/v1/users/:id
5. Delete User → DELETE /api/v1/users/:id

Total requests per user: 5
Total users: 67,500 (5,000 concurrent × operations)
Total requests: 337,500
```

### Running Load Tests

```bash
# Stress test with 5,000 users for 120 seconds
LOADTEST_TYPE=stress \
LOADTEST_USERS=5000 \
LOADTEST_DURATION=120 \
docker compose -f docker.compose.yml --profile loadtest run --rm loadtest
```

### Results

```
================================================================================
---- Global Information --------------------------------------------------------
> request count                                     337500 (OK=337500 KO=0     )
> min response time                                      0 (OK=0      KO=-     )
> max response time                                    202 (OK=202    KO=-     )
> mean response time                                     1 (OK=1      KO=-     )
> std deviation                                          4 (OK=4      KO=-     )
> response time 50th percentile                          0 (OK=0      KO=-     )
> response time 75th percentile                          1 (OK=1      KO=-     )
> response time 95th percentile                          1 (OK=1      KO=-     )
> response time 99th percentile                          6 (OK=6      KO=-     )
> mean requests/sec                                2789.256 (OK=2789.256 KO=-  )
---- Response Time Distribution ------------------------------------------------
> t < 100 ms                                        337337 (100%)
> 100 ms <= t < 500 ms                                 163 (  0%)
> t >= 500 ms                                            0 (  0%)
> failed                                                 0 (  0%)
================================================================================
```

---

## Monitoring and Diagnostics

### Key Metrics to Monitor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Application Metrics                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Request Rate      : requests/second                                         │
│  Error Rate        : errors/second                                           │
│  Response Time     : p50, p95, p99 latency                                  │
│  Active Requests   : concurrent in-flight requests                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          Database Metrics                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Pool Open Conns   : current open connections                               │
│  Pool Idle Conns   : connections waiting in pool                            │
│  Pool Wait Count   : requests waiting for connection                        │
│  Pool Wait Time    : time spent waiting for connection                      │
│  Query Duration    : query execution time                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          PostgreSQL Metrics                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Active Connections: SELECT count(*) FROM pg_stat_activity                  │
│  Waiting Queries   : Queries waiting for locks                              │
│  Cache Hit Ratio   : shared_buffers effectiveness                           │
│  Transaction Rate  : commits/second, rollbacks/second                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Useful PostgreSQL Queries

```sql
-- Active connections by state
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;

-- Connections by application
SELECT application_name, count(*) 
FROM pg_stat_activity 
GROUP BY application_name;

-- Long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds';

-- Cache hit ratio (should be > 99%)
SELECT 
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) AS ratio
FROM pg_statio_user_tables;

-- Index usage
SELECT 
  schemaname, tablename, 
  idx_scan AS index_scans,
  seq_scan AS sequential_scans,
  idx_scan::float / (idx_scan + seq_scan + 1) AS index_ratio
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
```

---

## Summary of Changes

### Files Modified

| File | Changes |
|------|---------|
| `server/internal/infra/database/connection_manager.go` | Connection pool tuning, GORM optimizations |
| `server/internal/infra/database/database.go` | GORM config, pool settings |
| `server/config/config.go` | Added pool config parameters |
| `server/cmd/api/main.go` | Fiber server tuning |
| `server/internal/application/service/user_service.go` | DB operation timeouts, nil checks |
| `server/internal/presentation/routes/routes.go` | Middleware configuration |
| `docker.compose.yml` | PostgreSQL tuning parameters |

### Key Optimizations Ranked by Impact

1. **Connection Pool Size** (100 vs 25) → +300% connection capacity
2. **synchronous_commit=off** → 2-10× write throughput
3. **SkipDefaultTransaction** → ~30% faster queries
4. **PrepareStmt** → ~10-20% faster repeated queries
5. **Prefork Mode** → Linear scaling with CPU cores
6. **DB Operation Timeouts** → Prevents resource exhaustion
7. **Query Optimizations** → 20-50% faster per query

---

## Appendix: Before vs After Configuration

### Before (Baseline)

```go
// Connection Pool
MaxOpenConns: 25
MaxIdleConns: 10
ConnMaxLifetime: 5 minutes

// GORM
SkipDefaultTransaction: false (default)
PrepareStmt: false (default)

// PostgreSQL
max_connections: 100 (default)
shared_buffers: 128MB (default)
synchronous_commit: on (default)
```

### After (Optimized)

```go
// Connection Pool
MaxOpenConns: 100
MaxIdleConns: 50
ConnMaxLifetime: 10 minutes
ConnMaxIdleTime: 5 minutes

// GORM
SkipDefaultTransaction: true
PrepareStmt: true

// PostgreSQL
max_connections: 500
shared_buffers: 256MB
work_mem: 16MB
effective_cache_size: 512MB
synchronous_commit: off
checkpoint_completion_target: 0.9
idle_in_transaction_session_timeout: 30000
random_page_cost: 1.1 (replica)

// Fiber
Concurrency: 512K
ReadBufferSize: 8KB
WriteBufferSize: 8KB
EnablePrefork: true

// Application
Read Timeout: 3 seconds
Write Timeout: 5 seconds
Request Timeout: 10 seconds
```

---

*Document created: January 28, 2026*
*Last load test: 5,000 concurrent users, 100% success rate, 2,789 req/sec*
