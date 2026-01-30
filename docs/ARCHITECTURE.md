# Messenger Clone Architecture Guide

> **A complete learning resource for understanding distributed systems, database scaling, and high-performance Go applications**

## 📚 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Who Uses This Architecture?](#2-who-uses-this-architecture)
3. [System Architecture](#3-system-architecture)
4. [Clean Architecture Pattern](#4-clean-architecture-pattern)
5. [Database Layer Deep Dive](#5-database-layer-deep-dive)
6. [Sharding Explained](#6-sharding-explained)
7. [Migrations In-Depth](#7-migrations-in-depth)
8. [Foreign Keys & Relations in Sharded Systems](#8-foreign-keys--relations-in-sharded-systems)
9. [Connection Pooling with PgBouncer](#9-connection-pooling-with-pgbouncer)
10. [Real-World Scenarios](#10-real-world-scenarios)
11. [Performance Optimization](#11-performance-optimization)
12. [Glossary](#12-glossary)

---

## 1. Project Overview

### What We're Building

A **high-performance messenger application** backend that can:
- Handle **10,000+ concurrent users**
- Store **millions of users** across distributed databases
- Achieve **sub-millisecond response times**
- Scale horizontally by adding more database servers

### Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TECHNOLOGY STACK                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         Go (Golang) 1.25                            │   │
│   │    - Fiber v3 (HTTP framework with prefork for multi-core)          │   │
│   │    - GORM (ORM with query optimization)                             │   │
│   │    - Sonic (high-performance JSON encoder)                          │   │
│   │    - automaxprocs (container-aware CPU detection)                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     PgBouncer (Connection Pooler)                   │   │
│   │    - 10,000 max client connections per instance                     │   │
│   │    - Transaction-mode pooling                                       │   │
│   │    - 5 instances (one per shard)                                    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      PostgreSQL 16 (Sharded)                        │   │
│   │    - 5 primary shards (write operations)                            │   │
│   │    - 5 streaming replicas (read operations)                         │   │
│   │    - UUIDv7 for time-ordered IDs                                    │   │
│   │    - Hash partitioning per shard                                    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Supporting Infrastructure:                                                │
│   - Docker & Docker Compose (containerization)                              │
│   - Gatling (load testing at 10K concurrent users)                          │
│   - Redis (caching layer - future)                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Metrics Achieved

| Metric | Value | Context |
|--------|-------|---------|
| Concurrent Users | 10,000 | Simulated with Gatling |
| Success Rate | 100% | Zero failed requests |
| Mean Response Time | 2ms | P50 latency |
| Throughput | 5,000+ req/sec | Sustained write load |
| Total Users Stored | 1M+ | Across 5 shards |
| Data Distribution | ±5% | Nearly perfect balance |

---

## 2. Who Uses This Architecture?

### 🏢 Companies Using Similar Patterns

#### **Facebook/Meta**
- **Scale**: 3+ billion users
- **Sharding**: User data sharded by user_id
- **Why**: Single database can't handle billions of users
- **Pattern**: Consistent hashing like ours

```
Facebook's Approach:
┌─────────────────────────────────────────────────────────────┐
│  User ID: 12345                                             │
│       │                                                     │
│       ▼                                                     │
│  hash(12345) % N → Shard 3                                  │
│       │                                                     │
│       ▼                                                     │
│  Shard 3 holds: user profile, posts, friends list           │
│  (All related data co-located for fast JOINs)               │
└─────────────────────────────────────────────────────────────┘
```

#### **Instagram**
- **Scale**: 2+ billion users
- **Sharding**: PostgreSQL sharded by user_id
- **Why**: Started on PostgreSQL, scaled with sharding
- **Learning**: Same database, just distributed!

#### **Discord**
- **Scale**: 150+ million users
- **Sharding**: Messages sharded by channel_id
- **Why**: Channels are the access pattern
- **Pattern**: Similar consistent hashing

#### **Uber**
- **Scale**: Millions of rides/day
- **Sharding**: Rides sharded by city + time
- **Why**: Geographic isolation
- **Pattern**: Range sharding by region

#### **Pinterest**
- **Scale**: 450+ million users
- **Sharding**: Pins sharded by user_id
- **Why**: User's pins always accessed together
- **Technology**: MySQL + custom sharding layer

### 🎯 When to Use This Architecture

| Scenario | Recommendation |
|----------|---------------|
| < 1 million users | Single PostgreSQL with read replicas |
| 1-10 million users | Consider sharding, start with 2-4 shards |
| 10-100 million users | Sharding required, 8-16+ shards |
| 100+ million users | Sharding + additional caching layers |

### 📊 Decision Matrix

```
Should you shard? Ask yourself:

1. Is a single database a bottleneck?
   ├── No  → Don't shard yet (YAGNI principle)
   └── Yes → Continue to question 2

2. Is the bottleneck reads or writes?
   ├── Reads  → Add read replicas first (simpler)
   ├── Writes → Sharding may be needed
   └── Both   → Sharding + read replicas (our approach)

3. Can you vertically scale (bigger machine)?
   ├── Yes and affordable → Do that first
   └── No or too expensive → Shard

4. Do you have a good shard key?
   ├── Yes (user_id, tenant_id) → Proceed with sharding
   └── No  → Reconsider your data model first
```

---

## 3. System Architecture

### High-Level Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          REQUEST FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Client Request: POST /api/users {"firstName": "John", "lastName": "Doe"}  │
│           │                                                                 │
│           ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ 1. FIBER HTTP SERVER (Prefork Mode)                                 │   │
│   │    - Receives request on worker process #3 (out of 7)               │   │
│   │    - Parses JSON using Sonic encoder (3x faster than stdlib)        │   │
│   │    - Validates request                                              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ 2. PRESENTATION LAYER (Handler)                                     │   │
│   │    - Routes request to UserController.CreateUser()                  │   │
│   │    - Converts HTTP request to domain DTO                            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ 3. APPLICATION LAYER (Service)                                      │   │
│   │    - UserService.CreateUser(dto)                                    │   │
│   │    - Generates UUIDv7: "019478a1-3c5f-7d9e-8b3c-..."                │   │
│   │    - Creates User entity                                            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ 4. SHARD ROUTER (ShardManager)                                      │   │
│   │    - hash = MD5("019478a1-3c5f-7d9e-8b3c-...") → 0x7A3B...          │   │
│   │    - Binary search in hash ring → Shard 2                           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ 5. PGBOUNCER (Connection Pool - Port 6432)                          │   │
│   │    - Gets idle connection from pool (0ms wait)                      │   │
│   │    - Transaction mode: connection returned after query              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ 6. POSTGRESQL SHARD 2 PRIMARY (Port 5442)                           │   │
│   │    - INSERT INTO users (id, first_name, last_name) VALUES (...)     │   │
│   │    - WAL written to disk                                            │   │
│   │    - Streamed to Replica 2 (async)                                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           ▼                                                                 │
│   Response: 201 Created {"id": "019478a1-3c5f-7d9e-8b3c-...", ...}      │
│                                                                             │
│   Total Time: ~2ms                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOCKER COMPOSE NETWORK                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    messenger_server (:8080)                         │   │
│   │              7 prefork workers (1 per CPU core)                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                  │                                          │
│            ┌─────────┬─────────┬─┴───────┬─────────┬─────────┐              │
│            ▼         ▼         ▼         ▼         ▼         │              │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│   │ pgbouncer-0 │ │ pgbouncer-1 │ │ pgbouncer-2 │ │ pgbouncer-3 │ ...      │
│   │   :6430     │ │   :6431     │ │   :6432     │ │   :6433     │          │
│   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘          │
│          │               │               │               │                  │
│          ▼               ▼               ▼               ▼                  │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│   │   shard-0   │ │   shard-1   │ │   shard-2   │ │   shard-3   │ ...      │
│   │  PRIMARY    │ │  PRIMARY    │ │  PRIMARY    │ │  PRIMARY    │          │
│   │   :5440     │ │   :5441     │ │   :5442     │ │   :5443     │          │
│   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘          │
│          │               │               │               │                  │
│   Streaming       Streaming       Streaming       Streaming                 │
│   Replication     Replication     Replication     Replication               │
│          │               │               │               │                  │
│          ▼               ▼               ▼               ▼                  │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│   │  replica-0  │ │  replica-1  │ │  replica-2  │ │  replica-3  │ ...      │
│   │    READ     │ │    READ     │ │    READ     │ │    READ     │          │
│   │   :5450     │ │   :5451     │ │   :5452     │ │   :5453     │          │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Clean Architecture Pattern

### Layer Overview

Our project follows **Clean Architecture** (also known as Hexagonal/Onion Architecture):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLEAN ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                    ┌─────────────────────────────┐                          │
│                    │     PRESENTATION LAYER      │                          │
│                    │  (HTTP Handlers, Routes)    │                          │
│                    │                             │                          │
│                    │  server/internal/           │                          │
│                    │    presentation/            │                          │
│                    │      controllers/           │                          │
│                    │      routes/                │                          │
│                    └──────────────┬──────────────┘                          │
│                                   │ depends on                              │
│                                   ▼                                         │
│                    ┌─────────────────────────────┐                          │
│                    │     APPLICATION LAYER       │                          │
│                    │  (Services, Use Cases)      │                          │
│                    │                             │                          │
│                    │  server/internal/           │                          │
│                    │    application/             │                          │
│                    │      services/              │                          │
│                    └──────────────┬──────────────┘                          │
│                                   │ depends on                              │
│                                   ▼                                         │
│                    ┌─────────────────────────────┐                          │
│                    │       DOMAIN LAYER          │                          │
│                    │  (Entities, Repository      │                          │
│                    │   Interfaces, DTOs)         │                          │
│                    │                             │                          │
│                    │  server/internal/domain/    │                          │
│                    │    entity/                  │                          │
│                    │    repository/              │                          │
│                    │    dto/                     │                          │
│                    └──────────────┬──────────────┘                          │
│                                   │ implemented by                          │
│                                   ▼                                         │
│                    ┌─────────────────────────────┐                          │
│                    │    INFRASTRUCTURE LAYER     │                          │
│                    │  (Database, External APIs)  │                          │
│                    │                             │                          │
│                    │  server/internal/           │                          │
│                    │    persistence/             │                          │
│                    │      repository/            │                          │
│                    │    infra/                   │                          │
│                    │      database/              │                          │
│                    │      shard/                 │                          │
│                    └─────────────────────────────┘                          │
│                                                                             │
│   DEPENDENCY RULE: Dependencies point INWARD only!                          │
│   - Presentation depends on Application                                     │
│   - Application depends on Domain                                           │
│   - Infrastructure implements Domain interfaces                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Directory Structure Explained

```
server/
├── cmd/api/main.go              # Application entry point
├── config/config.go             # Configuration management
├── internal/
│   ├── domain/                  # DOMAIN LAYER (Business logic)
│   │   ├── entity/              # Domain models
│   │   │   └── user.go          # User entity
│   │   ├── repository/          # Repository interfaces (contracts)
│   │   │   └── user.go          # UserRepository interface
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   └── user.go          # CreateUserDTO, UserResponseDTO
│   │   └── errors/              # Domain-specific errors
│   │
│   ├── application/             # APPLICATION LAYER (Use cases)
│   │   └── services/
│   │       └── user.go          # UserService (business logic)
│   │
│   ├── presentation/            # PRESENTATION LAYER (HTTP)
│   │   ├── controllers/
│   │   │   └── user.go          # UserController
│   │   └── routes/
│   │       └── routes.go        # HTTP route definitions
│   │
│   ├── persistence/             # INFRASTRUCTURE - Persistence
│   │   ├── gorm/
│   │   │   ├── common/
│   │   │   │   └── CommonModel.go    # Base model with ID, timestamps
│   │   │   └── models/
│   │   │       ├── user.go           # UserModel (GORM)
│   │   │       ├── account.go        # AccountModel (GORM)
│   │   │       └── user_account.go   # UserAccountModel (Junction table)
│   │   └── repository/
│   │       └── sharded_user_repository.go  # Implements UserRepository
│   │
│   ├── infra/                   # INFRASTRUCTURE - External
│   │   ├── database/
│   │   │   ├── database.go      # Single database connection
│   │   │   └── shard/
│   │   │       └── shard_manager.go  # Sharding logic
│   │   └── logger/
│   │       └── logger.go        # Logging
│   │
│   └── bootstrap/               # Application startup
│       ├── application.go       # ApplicationService
│       └── shard_service.go     # ShardedDatabaseService
│
├── migrations/                  # Database migrations
│   ├── 20251213161251_add_account_table.go
│   ├── 20251221154500_add_user_table.go
│   └── 20251221162915_add_user_account_table.go
│
└── tools/migration/             # Migration CLI tool
    ├── main.go                  # CLI entry point
    ├── runner/runner.go         # Migration execution
    └── registry/registry.go     # Migration registration
```

### Why Clean Architecture?

| Benefit | Explanation |
|---------|-------------|
| **Testability** | Domain logic can be tested without database |
| **Flexibility** | Switch databases without changing business logic |
| **Maintainability** | Clear separation of concerns |
| **Scalability** | Easy to add new features in isolation |

---

## 5. Database Layer Deep Dive

### Entity Definition

```go
// server/internal/domain/entity/user.go
package entity

type User struct {
    ID        string    // UUIDv7 - time-ordered, unique across shards
    FirstName string
    LastName  string
    CreatedAt time.Time
    UpdatedAt time.Time
}

// NewUser creates a new User entity with generated ID
func NewUser(firstName, lastName string) *User {
    return &User{
        ID:        uuid.New().String(),  // Generated in application, not DB
        FirstName: firstName,
        LastName:  lastName,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }
}
```

### GORM Model (Database Representation)

```go
// server/internal/persistence/gorm/models/user.go
package models

// CommonModel provides shared fields for all models
type CommonModel struct {
    Id        uuid.UUID `gorm:"type:uuid;default:uuidv7();primaryKey"`
    CreatedAt time.Time `gorm:"autoCreateTime"`
    UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

// UserModel is the database representation of a User
type UserModel struct {
    CommonModel                    // Embedded: ID, CreatedAt, UpdatedAt
    FirstName string `gorm:"size:100;not null;index:idx_user_name"`
    LastName  string `gorm:"size:100;not null;index:idx_user_name"`
}

func (UserModel) TableName() string {
    return "users"  // Explicit table name
}
```

### Why UUIDv7?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UUIDv7 STRUCTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   UUIDv7: 019478a1-3c5f-7d9e-8b3c-4a5f6e7d8c9b                             │
│           ├──────┤├──┤├──┤├──┤├────────────┤                               │
│           │       │    │    │    │                                          │
│           │       │    │    │    └── Random bits (uniqueness)               │
│           │       │    │    └─────── Variant (RFC 4122)                     │
│           │       │    └──────────── Version (7)                            │
│           │       └───────────────── Sub-millisecond precision              │
│           └───────────────────────── Unix timestamp (milliseconds)          │
│                                                                             │
│   BENEFITS:                                                                 │
│   ✅ Globally unique (no coordination needed between shards)                │
│   ✅ Time-ordered (good for range queries, B-tree indexes)                  │
│   ✅ Generated in application (not database)                                │
│   ✅ 128 bits = no collision risk                                           │
│                                                                             │
│   WHY NOT AUTO-INCREMENT?                                                   │
│   ❌ Requires coordination between shards                                   │
│   ❌ Reveals data volume (security issue)                                   │
│   ❌ ID gaps when records deleted                                           │
│   ❌ Can't be generated before INSERT                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Sharding Explained

### What is Sharding?

**Sharding** = Splitting data horizontally across multiple database servers.

```
Without Sharding:                    With Sharding:
┌──────────────────────┐            ┌────────────┐  ┌────────────┐
│   Single Database    │            │   Shard 0  │  │   Shard 1  │
│                      │            │   Users    │  │   Users    │
│   ALL 10M Users      │   ───►     │   A-E      │  │   F-J      │
│                      │            │   2M users │  │   2M users │
│   (Bottleneck!)      │            └────────────┘  └────────────┘
└──────────────────────┘            ┌────────────┐  ┌────────────┐
                                    │   Shard 2  │  │   Shard 3  │
                                    │   Users    │  │   Users    │
                                    │   K-P      │  │   Q-Z      │
                                    │   2M users │  │   4M users │
                                    └────────────┘  └────────────┘
```

### Our Consistent Hashing Implementation

```go
// server/internal/infra/database/shard/shard_manager.go

// GetShardForKey returns the shard for a given key (user ID)
func (sm *ShardManager) GetShardForKey(key string) *Shard {
    shardID := sm.hashRing.GetShardID(key)
    return sm.shards[shardID]
}

// ConsistentHash uses MD5 for even distribution
func (ch *ConsistentHash) GetShardID(key string) int {
    hash := ch.hashMD5(key)  // Convert key to 32-bit number
    
    // Binary search for first virtual node >= hash
    idx := sort.Search(len(ch.sortedHashes), func(i int) bool {
        return ch.sortedHashes[i] >= hash
    })
    
    // Wrap around if needed
    if idx >= len(ch.sortedHashes) {
        idx = 0
    }
    
    return ch.ring[ch.sortedHashes[idx]]
}
```

### Visual: Consistent Hash Ring

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONSISTENT HASH RING                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              0 (top)                                        │
│                               │                                             │
│                       Shard0-vn0                                            │
│                              ╱│╲                                            │
│                            ╱  │  ╲                                          │
│                          ╱    │    ╲                                        │
│                  Shard3-vn2   │   Shard1-vn0                                │
│                      ╱        │        ╲                                    │
│              ──────●──────────┼──────────●──────                            │
│                   ╱           │           ╲                                 │
│                  ╱            │            ╲                                │
│         Shard3-vn1         ●───●         Shard1-vn1                         │
│              ╱          ╱user123╲            ╲                              │
│             ╱          hash lands             ╲                             │
│            ╱           here → Shard2           ╲                            │
│     ──────●────────────────────────────────────●──────                      │
│           │                                     │                           │
│    Shard2-vn0                             Shard1-vn2                        │
│           │                                     │                           │
│           └──────────●──────────────●───────────┘                           │
│                 Shard2-vn1      Shard2-vn2                                  │
│                                                                             │
│   How it works:                                                             │
│   1. User ID "user123" → MD5 hash → 0x7A3B...                              │
│   2. Find first virtual node >= 0x7A3B... on the ring                      │
│   3. That virtual node belongs to Shard 2                                  │
│   4. Route request to Shard 2                                              │
│                                                                             │
│   Virtual Nodes: Each shard has 150 virtual nodes spread around the ring   │
│   Why? Ensures even distribution even with few physical shards             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Shard Configuration

```yaml
# Environment variables for 5 shards
SHARDING_COUNT=5
GOMAXPROCS=7

# Each shard has:
# - Primary (writes): port 544X
# - Replica (reads): port 545X
# - PgBouncer: port 643X
```

### Code: Sharded Repository

```go
// server/internal/persistence/repository/sharded_user_repository.go

// Create inserts a user into the correct shard
func (r *ShardedUserRepository) Create(ctx context.Context, user *entity.User) error {
    // 1. Ensure user has ID (for routing)
    if user.ID == "" {
        user.ID = uuid.New().String()
    }
    
    // 2. Determine shard using consistent hashing
    shard := r.shardManager.GetShardForKey(user.ID)
    
    // 3. Insert into that shard's PRIMARY database
    userModel := toUserModel(user)
    if err := shard.WriteDB.WithContext(ctx).Create(&userModel).Error; err != nil {
        return fmt.Errorf("shard %d: %w", shard.ID, err)
    }
    
    return nil
}

// FindByID reads from the correct shard's REPLICA
func (r *ShardedUserRepository) FindByID(ctx context.Context, id string) (*entity.User, error) {
    // 1. Determine shard
    shard := r.shardManager.GetShardForKey(id)
    
    // 2. Query that shard's READ REPLICA
    var userModel models.UserModel
    err := shard.ReadDB.WithContext(ctx).
        Where("id = ?", id).
        Take(&userModel).Error
    
    if err != nil {
        if err == gorm.ErrRecordNotFound {
            return nil, nil  // Not found
        }
        return nil, fmt.Errorf("shard %d: %w", shard.ID, err)
    }
    
    user := toUserEntity(userModel)
    return &user, nil
}

// FindAll uses SCATTER-GATHER pattern (query all shards)
func (r *ShardedUserRepository) FindAll(ctx context.Context, pagination *Pagination) ([]entity.User, error) {
    shards := r.shardManager.GetAllShards()
    
    // Scatter: Query all shards in PARALLEL
    results := make(chan shardResult, len(shards))
    var wg sync.WaitGroup
    
    for _, shard := range shards {
        wg.Add(1)
        go func(s *Shard) {
            defer wg.Done()
            var users []models.UserModel
            err := s.ReadDB.WithContext(ctx).
                Limit(perShardLimit).
                Find(&users).Error
            results <- shardResult{users: users, err: err}
        }(shard)
    }
    
    // Gather: Collect results from all shards
    wg.Wait()
    close(results)
    
    var allUsers []entity.User
    for result := range results {
        if result.err != nil {
            return nil, result.err
        }
        for _, u := range result.users {
            allUsers = append(allUsers, toUserEntity(u))
        }
    }
    
    return allUsers, nil
}
```

---

## 7. Migrations In-Depth

### What Are Migrations?

Migrations are **version-controlled database schema changes**. Think of them like Git for your database structure.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WHY MIGRATIONS?                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   WITHOUT MIGRATIONS:                                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Developer A: "Hey, did you run the ALTER TABLE command?"            │   │
│   │ Developer B: "Which one? I have like 5 SQL files..."                │   │
│   │ Production:   *crashes because schema doesn't match*                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   WITH MIGRATIONS:                                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ $ make migrate-up                                                   │   │
│   │ [MIGRATION] Applying 20251213161251_add_account_table.go            │   │
│   │ [MIGRATION] Applying 20251221154500_add_user_table.go               │   │
│   │ [MIGRATION] Database is up to date                                  │   │
│   │                                                                     │   │
│   │ ✅ Every developer has same schema                                  │   │
│   │ ✅ Production matches development                                   │   │
│   │ ✅ Changes are tracked in Git                                       │   │
│   │ ✅ Can rollback if something breaks                                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Our Migration System

```go
// server/migrations/20251221154500_add_user_table.go

package migrations

func init() {
    // Register this migration so it can be discovered
    registry.Register(
        "20251221154500_add_user_table.go",  // Name (timestamp + description)
        Up_20251221154500,                    // Up function (apply)
        Down_20251221154500,                  // Down function (rollback)
    )
}

// Up_20251221154500 creates the users table
func Up_20251221154500(db *gorm.DB) error {
    // GORM automatically generates SQL from the model:
    // CREATE TABLE users (
    //     id UUID PRIMARY KEY DEFAULT uuidv7(),
    //     first_name VARCHAR(100) NOT NULL,
    //     last_name VARCHAR(100) NOT NULL,
    //     created_at TIMESTAMPTZ DEFAULT NOW(),
    //     updated_at TIMESTAMPTZ DEFAULT NOW()
    // );
    // CREATE INDEX idx_user_name ON users(first_name, last_name);
    return db.Migrator().CreateTable(&models.UserModel{})
}

// Down_20251221154500 drops the users table (rollback)
func Down_20251221154500(db *gorm.DB) error {
    return db.Migrator().DropTable(&models.UserModel{})
}
```

### Migration Runner Explained

```go
// server/tools/migration/runner/runner.go

func RunLatest(ctx context.Context, db *gorm.DB) (int, error) {
    migrationRepository := migration_repository.NewMigrationRepository(db)
    
    // 1. Create tracking table if not exists
    //    This table records which migrations have run
    //    | id | name                              | applied_at          |
    //    |----|-----------------------------------|---------------------|
    //    | 1  | 20251213161251_add_account_table  | 2025-12-13 16:12:51 |
    //    | 2  | 20251221154500_add_user_table     | 2025-12-21 15:45:00 |
    if err := migrationRepository.CreateTablesIfNotExists(); err != nil {
        return 0, err
    }
    
    // 2. Acquire lock (prevent concurrent migrations)
    //    Important for distributed systems!
    locked, _ := migrationRepository.IsLocked()
    if locked {
        log.Println("[MIGRATION] Locked, another process may be running")
        return 0, nil
    }
    migrationRepository.UpdateLock(true)
    defer migrationRepository.UpdateLock(false)
    
    // 3. Get all registered migrations and sort by timestamp
    allMigrations := registry.All()
    var migrationNames []string
    for name := range allMigrations {
        migrationNames = append(migrationNames, name)
    }
    sort.Strings(migrationNames)  // 20251213... < 20251221...
    
    // 4. Apply pending migrations in a transaction
    applied := 0
    for _, migrationName := range migrationNames {
        isApplied, _ := isMigrationApplied(db, migrationName)
        if isApplied {
            continue  // Already applied, skip
        }
        
        mig, _ := registry.Get(migrationName)
        log.Printf("[MIGRATION] Applying: %s", mig.Name)
        
        // Transaction ensures atomicity
        err := db.Transaction(func(tx *gorm.DB) error {
            // Run the Up function
            if err := mig.Up(tx); err != nil {
                return err  // Rollback on failure
            }
            // Record that we applied it
            return tx.Create(&models.MigrationModel{Name: mig.Name}).Error
        }, &sql.TxOptions{Isolation: sql.LevelSerializable})
        
        if err != nil {
            return applied, err
        }
        applied++
    }
    
    return applied, nil
}
```

### Migration Commands

```bash
# Create a new migration
make migrate-make NAME=add_email_to_users
# Creates: server/migrations/20260130123456_add_email_to_users.go

# Apply all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Run migrations on all shards
make migrate-shards
```

### How Migrations Run on Shards

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MIGRATION ON SHARDED DATABASE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. Application starts                                                     │
│           │                                                                 │
│           ▼                                                                 │
│   2. ShardedDatabaseService.Start()                                         │
│           │                                                                 │
│           ├──► Connect to Shard 0 ──► Run migrations ──► CREATE TABLE users │
│           ├──► Connect to Shard 1 ──► Run migrations ──► CREATE TABLE users │
│           ├──► Connect to Shard 2 ──► Run migrations ──► CREATE TABLE users │
│           ├──► Connect to Shard 3 ──► Run migrations ──► CREATE TABLE users │
│           └──► Connect to Shard 4 ──► Run migrations ──► CREATE TABLE users │
│           │                                                                 │
│           ▼                                                                 │
│   3. All shards have identical schema!                                      │
│                                                                             │
│   IMPORTANT: Each shard has its own migrations table                        │
│   - shard-0.migrations: tracks shard-0's applied migrations                 │
│   - shard-1.migrations: tracks shard-1's applied migrations                 │
│   - etc.                                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Foreign Keys & Relations in Sharded Systems

### The Challenge

Foreign keys **don't work across shards** because:
- Shard 0 can't verify a reference to data on Shard 1
- PostgreSQL can only enforce constraints within one database

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FOREIGN KEY PROBLEM IN SHARDING                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   SCENARIO: User has many Messages                                          │
│                                                                             │
│   Traditional (Single DB):                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   users                          messages                           │   │
│   │   ┌────────┬──────────┐         ┌────────┬───────────┬──────────┐  │   │
│   │   │ id     │ name     │         │ id     │ user_id   │ content  │  │   │
│   │   ├────────┼──────────┤         ├────────┼───────────┼──────────┤  │   │
│   │   │ 1      │ Alice    │◄────────│ 101    │ 1 (FK)    │ Hello!   │  │   │
│   │   │ 2      │ Bob      │◄────────│ 102    │ 2 (FK)    │ Hi!      │  │   │
│   │   └────────┴──────────┘         └────────┴───────────┴──────────┘  │   │
│   │                                                                     │   │
│   │   ✅ FK enforced: Can't create message for non-existent user        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Sharded (Multiple DBs):                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Shard 0                         Shard 1                           │   │
│   │   ┌────────┬──────────┐         ┌────────┬──────────┐              │   │
│   │   │ id     │ name     │         │ id     │ name     │              │   │
│   │   ├────────┼──────────┤         ├────────┼──────────┤              │   │
│   │   │ 1      │ Alice    │         │ 2      │ Bob      │              │   │
│   │   └────────┴──────────┘         └────────┴──────────┘              │   │
│   │                                                                     │   │
│   │   ❌ Can't have FK from Shard 0 → Shard 1                           │   │
│   │   ❌ Database can't verify cross-shard references                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Solution 1: Co-locate Related Data (Same Shard Key)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOLUTION: CO-LOCATE BY USER_ID                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Shard Key = user_id for ALL related tables                                │
│                                                                             │
│   Shard 0 (hash(user_id) = 0)       Shard 1 (hash(user_id) = 1)            │
│   ┌─────────────────────────────┐   ┌─────────────────────────────┐        │
│   │ users                       │   │ users                       │        │
│   │ ├── id: user-001            │   │ ├── id: user-002            │        │
│   │ └── name: Alice             │   │ └── name: Bob               │        │
│   │                             │   │                             │        │
│   │ messages (user-001's)       │   │ messages (user-002's)       │        │
│   │ ├── id: msg-101             │   │ ├── id: msg-201             │        │
│   │ │   user_id: user-001       │   │ │   user_id: user-002       │        │
│   │ │   content: "Hello!"       │   │ │   content: "Hi there!"    │        │
│   │ ├── id: msg-102             │   │ └── ...                     │        │
│   │ │   user_id: user-001       │   │                             │        │
│   │ └── ...                     │   │ profiles (user-002's)       │        │
│   │                             │   │ └── ...                     │        │
│   │ profiles (user-001's)       │   │                             │        │
│   │ └── ...                     │   └─────────────────────────────┘        │
│   └─────────────────────────────┘                                          │
│                                                                             │
│   ✅ All of a user's data on same shard                                     │
│   ✅ FK can be enforced within shard                                        │
│   ✅ JOINs are fast (same database)                                         │
│   ✅ Transactions work (ACID within shard)                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Solution 2: Application-Level Enforcement

When co-location isn't possible, enforce in application code:

```go
// Example: Checking user exists before creating a message
func (s *MessageService) CreateMessage(ctx context.Context, userID, content string) error {
    // 1. Get the shard for this user
    userShard := s.shardManager.GetShardForKey(userID)
    
    // 2. Verify user exists (application-level FK check)
    var count int64
    userShard.ReadDB.Model(&UserModel{}).Where("id = ?", userID).Count(&count)
    if count == 0 {
        return errors.New("user not found")  // Like FK violation
    }
    
    // 3. Create message on same shard as user
    message := &MessageModel{
        ID:      uuid.New().String(),
        UserID:  userID,
        Content: content,
    }
    return userShard.WriteDB.Create(message).Error
}
```

### Our Junction Table Example

```go
// server/internal/persistence/gorm/models/user_account.go

type UserAccountModel struct {
    CommonModel
    
    // Foreign key to User (same shard)
    UserID  uuid.UUID  `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_account"`
    User    UserModel  `gorm:"foreignKey:UserID;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
    
    // Foreign key to Account (same shard)
    AccountID  uuid.UUID    `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_account"`
    Account    AccountModel `gorm:"foreignKey:AccountID;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
```

### Foreign Key Tags Explained

```go
`gorm:"foreignKey:UserID;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

// foreignKey:UserID     → This column (UserID) is the FK
// references:Id         → Points to User.Id
// OnUpdate:CASCADE      → If User.Id changes, update UserID
// OnDelete:CASCADE      → If User deleted, delete this row too
```

### Relationship Types in GORM

```go
// ONE-TO-ONE: User has one Profile
type User struct {
    ID      uuid.UUID
    Profile Profile `gorm:"foreignKey:UserID"`  // Profile.UserID → User.ID
}

type Profile struct {
    ID     uuid.UUID
    UserID uuid.UUID  // FK to User
    Bio    string
}

// ONE-TO-MANY: User has many Messages
type User struct {
    ID       uuid.UUID
    Messages []Message `gorm:"foreignKey:UserID"`  // Message.UserID → User.ID
}

type Message struct {
    ID      uuid.UUID
    UserID  uuid.UUID  // FK to User
    Content string
}

// MANY-TO-MANY: Users have many Accounts (through junction table)
type User struct {
    ID       uuid.UUID
    Accounts []Account `gorm:"many2many:users_accounts;"`
}

type Account struct {
    ID    uuid.UUID
    Users []User `gorm:"many2many:users_accounts;"`
}
// GORM auto-creates: users_accounts (user_id, account_id)
```

### Best Practices for Sharded Relations

| Scenario | Recommendation |
|----------|---------------|
| User → Messages | Same shard key (user_id) - FK works |
| User → Profile | Same shard key (user_id) - FK works |
| User → User (Friends) | Application-level check |
| Order → Products | Embed product info in order (denormalize) |
| Cross-shard reference | Store ID only, lookup separately |

---

## 9. Connection Pooling with PgBouncer

### Why PgBouncer?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE CONNECTION PROBLEM                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   WITHOUT POOLING:                                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   10,000 concurrent users × 1 connection each = 10,000 connections   │   │
│   │                                                                     │   │
│   │   PostgreSQL:                                                       │   │
│   │   - max_connections = 500 (default)                                 │   │
│   │   - Each connection = ~10MB RAM                                     │   │
│   │   - 10,000 connections = 100GB RAM 💥                               │   │
│   │                                                                     │   │
│   │   Result: "FATAL: too many connections"                             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   WITH PGBOUNCER:                                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   10,000 concurrent users ──► PgBouncer ──► 100 PostgreSQL conns    │   │
│   │                                                                     │   │
│   │   How it works:                                                     │   │
│   │   1. User request arrives                                          │   │
│   │   2. PgBouncer assigns idle connection from pool                   │   │
│   │   3. Query executes (10ms)                                         │   │
│   │   4. Connection returned to pool                                   │   │
│   │   5. Next request reuses same connection                           │   │
│   │                                                                     │   │
│   │   100 connections can serve 10,000 users!                          │   │
│   │   (Because most time is spent in application, not database)        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### PgBouncer Configuration

```ini
; database/pgbouncer/pgbouncer.ini

[databases]
; Map "messenger" database to actual PostgreSQL
messenger = host=shard-0 port=5432 dbname=messenger

[pgbouncer]
; Listen on all interfaces, port 6432
listen_addr = 0.0.0.0
listen_port = 6432

; TRANSACTION MODE: Connection returned after each transaction
; Best for high-concurrency, short-lived queries
pool_mode = transaction

; Accept up to 10,000 client connections
max_client_conn = 10000

; Only open 100 connections to PostgreSQL
default_pool_size = 100

; Authentication file
auth_file = /etc/pgbouncer/userlist.txt
```

### Pool Modes Explained

| Mode | Connection Returned | Best For |
|------|---------------------|----------|
| **Session** | When client disconnects | Long-running sessions, SET commands |
| **Transaction** | After COMMIT/ROLLBACK | Most web apps (our choice) |
| **Statement** | After each query | Simple queries, no transactions |

### Our Architecture with PgBouncer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PGBOUNCER PER SHARD                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Application (7 Prefork Workers)                                           │
│         │                                                                   │
│         ├───► pgbouncer-0 (:6430) ───► shard-0 (:5440) ───► replica-0      │
│         │     max_client: 10K          max_conn: 500                       │
│         │     pool_size: 100                                               │
│         │                                                                   │
│         ├───► pgbouncer-1 (:6431) ───► shard-1 (:5441) ───► replica-1      │
│         │                                                                   │
│         ├───► pgbouncer-2 (:6432) ───► shard-2 (:5442) ───► replica-2      │
│         │                                                                   │
│         ├───► pgbouncer-3 (:6433) ───► shard-3 (:5443) ───► replica-3      │
│         │                                                                   │
│         └───► pgbouncer-4 (:6434) ───► shard-4 (:5444) ───► replica-4      │
│                                                                             │
│   Total Capacity:                                                           │
│   - 50,000 client connections (10K × 5 pgbouncers)                         │
│   - 500 PostgreSQL connections per shard (100 pooled × 5)                  │
│   - 2,500 total PostgreSQL connections                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Real-World Scenarios

### Scenario 1: User Registration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCENARIO: USER REGISTRATION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Request: POST /api/users {"firstName": "John", "lastName": "Doe"}         │
│                                                                             │
│   Step 1: Generate UUIDv7                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   id = "019478a1-3c5f-7d9e-8b3c-4a5f6e7d8c9b"                       │   │
│   │                                                                     │   │
│   │   Why UUIDv7?                                                       │   │
│   │   - Globally unique (no coordination between shards)                │   │
│   │   - Time-ordered (good for indexes)                                 │   │
│   │   - Generated in app (not database)                                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 2: Determine Shard                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   hash = MD5("019478a1-3c5f-7d9e-8b3c-4a5f6e7d8c9b")                │   │
│   │        = 0x7A3B2C1D                                                 │   │
│   │                                                                     │   │
│   │   Consistent hash ring lookup → Shard 2                             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 3: Insert into Shard 2                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Connection: App → PgBouncer-2 (:6432) → Shard-2 Primary (:5442)  │   │
│   │                                                                     │   │
│   │   SQL: INSERT INTO users (id, first_name, last_name)               │   │
│   │        VALUES ('019478a1-...', 'John', 'Doe')                      │   │
│   │                                                                     │   │
│   │   Time: 1-2ms                                                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 4: Streaming Replication                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Shard-2 Primary → WAL → Replica-2                                │   │
│   │                                                                     │   │
│   │   Async replication (sub-millisecond lag under normal load)        │   │
│   │   Read-after-write: May need to read from primary briefly          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Response: 201 Created {"id": "019478a1-...", "firstName": "John", ...}   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Scenario 2: Get User by ID (Cache Miss)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCENARIO: GET USER BY ID                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Request: GET /api/users/019478a1-3c5f-7d9e-8b3c-4a5f6e7d8c9b             │
│                                                                             │
│   Step 1: Determine Shard (same hash as creation)                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   hash("019478a1-...") → Shard 2                                    │   │
│   │                                                                     │   │
│   │   IMPORTANT: Same ID always maps to same shard!                     │   │
│   │   This is the magic of consistent hashing.                          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 2: Query Shard 2's REPLICA (read scaling)                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Connection: App → PgBouncer-2 → Replica-2 (:5452)                │   │
│   │                                                                     │   │
│   │   SQL: SELECT id, first_name, last_name, created_at, updated_at    │   │
│   │        FROM users WHERE id = '019478a1-...'                        │   │
│   │                                                                     │   │
│   │   Why REPLICA?                                                      │   │
│   │   - Offloads read traffic from primary                              │   │
│   │   - Primary can focus on writes                                     │   │
│   │   - Better read scaling                                             │   │
│   │                                                                     │   │
│   │   Time: <1ms (indexed lookup)                                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Response: 200 OK {"id": "019478a1-...", "firstName": "John", ...}        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Scenario 3: List All Users (Scatter-Gather)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCENARIO: LIST ALL USERS (EXPENSIVE!)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Request: GET /api/users?limit=100                                         │
│                                                                             │
│   Step 1: Scatter - Query ALL shards in parallel                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                     │   │
│   │   goroutine 1 → Shard 0 Replica: SELECT * FROM users LIMIT 100     │   │
│   │   goroutine 2 → Shard 1 Replica: SELECT * FROM users LIMIT 100     │   │
│   │   goroutine 3 → Shard 2 Replica: SELECT * FROM users LIMIT 100     │   │
│   │   goroutine 4 → Shard 3 Replica: SELECT * FROM users LIMIT 100     │   │
│   │   goroutine 5 → Shard 4 Replica: SELECT * FROM users LIMIT 100     │   │
│   │                                                                     │   │
│   │   All queries run CONCURRENTLY                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 2: Gather - Collect and merge results                                │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Shard 0: 100 users (20ms)                                        │   │
│   │   Shard 1: 100 users (15ms)                                        │   │
│   │   Shard 2: 100 users (25ms) ← Slowest                              │   │
│   │   Shard 3: 100 users (18ms)                                        │   │
│   │   Shard 4: 100 users (12ms)                                        │   │
│   │                                                                     │   │
│   │   Total time: 25ms (limited by slowest shard)                      │   │
│   │   Total results: 500 users                                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 3: Trim to requested limit                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Return first 100 users (sorted by created_at)                    │   │
│   │                                                                     │   │
│   │   WARNING: This is inefficient for large datasets!                 │   │
│   │   Better: Use cursor-based pagination with shard-local ordering    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Response: 200 OK [{"id": "...", ...}, ...]                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Scenario 4: High Load (10K Concurrent Users)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCENARIO: 10K CONCURRENT USERS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Load Pattern:                                                             │
│   - 10,000 users sending 1 request/second each                             │
│   - Mix: 80% reads, 20% writes                                             │
│   - Duration: 60 seconds                                                    │
│                                                                             │
│   Distribution Across Components:                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Fiber Prefork (7 workers):                                        │   │
│   │   - ~1,428 requests/second per worker                               │   │
│   │   - Each worker: single-threaded, no lock contention                │   │
│   │                                                                     │   │
│   │   PgBouncer (5 instances):                                          │   │
│   │   - ~2,000 requests/second per instance                             │   │
│   │   - Transaction mode: connections recycled every ~5ms               │   │
│   │                                                                     │   │
│   │   PostgreSQL (5 shards):                                            │   │
│   │   - ~2,000 requests/second per shard                                │   │
│   │   - Writes: Primary only                                            │   │
│   │   - Reads: Distributed to replicas                                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Results:                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Metric              │ Value                                       │   │
│   │   ────────────────────┼──────────────────────────────────────────  │   │
│   │   Total Requests      │ 600,000                                     │   │
│   │   Success Rate        │ 100%                                        │   │
│   │   Throughput          │ 5,000+ req/sec                              │   │
│   │   Mean Latency        │ 2ms                                         │   │
│   │   P95 Latency         │ 5ms                                         │   │
│   │   P99 Latency         │ 15ms                                        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Performance Optimization

### GORM Optimizations

```go
// server/internal/infra/database/database.go

db, err := gorm.Open(dialect, &gorm.Config{
    // Skip default transaction for single queries
    // Saves ~30% overhead on simple queries
    SkipDefaultTransaction: true,
    
    // Cache prepared statements
    // Reuses query plans for repeated queries
    PrepareStmt: true,
})

// Connection pool tuning
sqlDB.SetMaxOpenConns(100)                  // Match ~20% of PostgreSQL max
sqlDB.SetMaxIdleConns(50)                   // Keep connections warm
sqlDB.SetConnMaxLifetime(10 * time.Minute)  // Recycle periodically
sqlDB.SetConnMaxIdleTime(5 * time.Minute)   // Close truly idle connections
```

### Fiber Prefork Mode

```go
// server/cmd/api/main.go

app := fiber.New(fiber.Config{
    // Prefork: One process per CPU core
    // Each process is independent (no shared state)
    Prefork: true,
    
    // Sonic JSON encoder (3x faster than encoding/json)
    JSONEncoder: sonic.Marshal,
    JSONDecoder: sonic.Unmarshal,
    
    // Buffer sizes
    ReadBufferSize:  8192,  // 8KB read buffer
    WriteBufferSize: 8192,  // 8KB write buffer
    
    // Timeouts
    ReadTimeout:  10 * time.Second,
    WriteTimeout: 10 * time.Second,
})
```

### Index Optimization

```go
// server/internal/persistence/gorm/models/user.go

type UserModel struct {
    CommonModel
    FirstName string `gorm:"size:100;not null;index:idx_user_name"`  // Indexed
    LastName  string `gorm:"size:100;not null;index:idx_user_name"`  // Composite index
}

// Results in SQL:
// CREATE INDEX idx_user_name ON users(first_name, last_name);
```

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **Sharding** | Splitting data across multiple database servers |
| **Consistent Hashing** | Algorithm that minimizes data movement when adding/removing shards |
| **Virtual Node** | Multiple hash ring positions per physical shard for better distribution |
| **Scatter-Gather** | Query pattern: send to all shards, combine results |
| **Prefork** | Server spawns multiple processes before accepting requests |
| **Connection Pooling** | Reusing database connections across requests |
| **Transaction Mode** | PgBouncer returns connection after each transaction |
| **Streaming Replication** | Real-time copying of writes to replica databases |
| **WAL** | Write-Ahead Log - PostgreSQL's transaction log |
| **UUIDv7** | Time-ordered UUID format (RFC 9562) |
| **GORM** | Go Object-Relational Mapping library |
| **Migration** | Version-controlled database schema change |
| **Foreign Key** | Database constraint enforcing referential integrity |
| **Clean Architecture** | Software design separating concerns into layers |
| **DTO** | Data Transfer Object - carries data between layers |
| **CQRS** | Command Query Responsibility Segregation (separate read/write paths) |

---

## Further Reading

- [docs/DATABASE_SCALING.md](DATABASE_SCALING.md) - Detailed scaling strategies
- [docs/SHARDING_GUIDE.md](SHARDING_GUIDE.md) - Sharding implementation details
- [docs/PARTITIONING_GUIDE.md](PARTITIONING_GUIDE.md) - PostgreSQL partitioning
- [docs/PERFORMANCE_TUNING.md](PERFORMANCE_TUNING.md) - Optimization techniques
- [README.md](../README.md) - Quick start guide

---

*This documentation is part of the Messenger Clone project - a learning resource for distributed systems.*
