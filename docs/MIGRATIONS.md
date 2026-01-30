# Migration System Deep Dive

> **Understanding database migrations, schema versioning, and how to safely evolve your database**

## 📚 Table of Contents

1. [What Are Migrations?](#1-what-are-migrations)
2. [Why Migrations Matter](#2-why-migrations-matter)
3. [Our Migration Architecture](#3-our-migration-architecture)
4. [Writing Migrations](#4-writing-migrations)
5. [Migration Execution Flow](#5-migration-execution-flow)
6. [Migrations in Sharded Databases](#6-migrations-in-sharded-databases)
7. [Best Practices](#7-best-practices)
8. [Common Patterns](#8-common-patterns)
9. [Troubleshooting](#9-troubleshooting)
10. [Real-World Examples](#10-real-world-examples)

---

## 1. What Are Migrations?

### Definition

**Database migrations** are version-controlled, incremental changes to your database schema. Think of them as "Git commits for your database structure."

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVOLUTION OF A DATABASE SCHEMA                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Version 1 (Initial)                                                       │
│   ┌─────────────────────────────────┐                                       │
│   │ users                           │                                       │
│   │ ├── id (UUID, PK)               │                                       │
│   │ ├── name (VARCHAR)              │                                       │
│   │ └── created_at (TIMESTAMP)      │                                       │
│   └─────────────────────────────────┘                                       │
│                    │                                                        │
│                    │ Migration: 20251221_split_name                         │
│                    ▼                                                        │
│   Version 2 (Name Split)                                                    │
│   ┌─────────────────────────────────┐                                       │
│   │ users                           │                                       │
│   │ ├── id (UUID, PK)               │                                       │
│   │ ├── first_name (VARCHAR)  ← NEW │                                       │
│   │ ├── last_name (VARCHAR)   ← NEW │                                       │
│   │ └── created_at (TIMESTAMP)      │                                       │
│   └─────────────────────────────────┘                                       │
│                    │                                                        │
│                    │ Migration: 20251225_add_email                          │
│                    ▼                                                        │
│   Version 3 (Email Added)                                                   │
│   ┌─────────────────────────────────┐                                       │
│   │ users                           │                                       │
│   │ ├── id (UUID, PK)               │                                       │
│   │ ├── first_name (VARCHAR)        │                                       │
│   │ ├── last_name (VARCHAR)         │                                       │
│   │ ├── email (VARCHAR)       ← NEW │                                       │
│   │ └── created_at (TIMESTAMP)      │                                       │
│   └─────────────────────────────────┘                                       │
│                                                                             │
│   Each migration is:                                                        │
│   - Timestamped (order matters)                                             │
│   - Reversible (up/down functions)                                          │
│   - Tracked in database (won't run twice)                                   │
│   - Version controlled (in Git)                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Up Migration** | Applies a change (e.g., CREATE TABLE) |
| **Down Migration** | Reverses a change (e.g., DROP TABLE) |
| **Migration Lock** | Prevents concurrent migrations |
| **Migration Table** | Tracks which migrations have been applied |
| **Idempotent** | Running twice has same effect as once |

---

## 2. Why Migrations Matter

### The Problem Without Migrations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WITHOUT MIGRATIONS: CHAOS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Developer A's Machine:          Developer B's Machine:                    │
│   ┌──────────────────────┐        ┌──────────────────────┐                 │
│   │ users                │        │ users                │                 │
│   │ ├── id               │        │ ├── id               │                 │
│   │ ├── name             │        │ ├── first_name       │  ← Different!   │
│   │ └── created_at       │        │ ├── last_name        │                 │
│   └──────────────────────┘        │ └── created_at       │                 │
│                                   └──────────────────────┘                 │
│                                                                             │
│   Production:                     Staging:                                  │
│   ┌──────────────────────┐        ┌──────────────────────┐                 │
│   │ users                │        │ users                │                 │
│   │ ├── id               │        │ ├── id               │                 │
│   │ ├── name             │        │ ├── name             │                 │
│   │ ├── email            │ ← ???  │ └── created_at       │  ← Missing!     │
│   │ └── created_at       │        └──────────────────────┘                 │
│   └──────────────────────┘                                                 │
│                                                                             │
│   Problems:                                                                 │
│   ❌ "It works on my machine!"                                              │
│   ❌ No way to know what changes have been applied                          │
│   ❌ Deployment breaks because schema doesn't match code                    │
│   ❌ Can't reproduce bugs (different schemas)                               │
│   ❌ Rolling back is manual and error-prone                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Solution: Migrations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WITH MIGRATIONS: ORDER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Git Repository (Single Source of Truth):                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ migrations/                                                         │   │
│   │ ├── 20251213161251_add_account_table.go    ← Applied first          │   │
│   │ ├── 20251221154500_add_user_table.go       ← Applied second         │   │
│   │ └── 20251221162915_add_user_account_table.go ← Applied third        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Every Environment:                                                        │
│   ┌──────────────────────────────────────────────────────────────────┐     │
│   │ $ make migrate-up                                                │     │
│   │ [MIGRATION] Applying 20251213161251_add_account_table.go         │     │
│   │ [MIGRATION] Applying 20251221154500_add_user_table.go            │     │
│   │ [MIGRATION] Applying 20251221162915_add_user_account_table.go    │     │
│   │ [MIGRATION] Database is up to date                               │     │
│   └──────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│   Benefits:                                                                 │
│   ✅ All environments have identical schema                                 │
│   ✅ Changes tracked in version control                                     │
│   ✅ Easy rollback if something breaks                                      │
│   ✅ New developers get schema automatically                                │
│   ✅ CI/CD can verify migrations work                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Our Migration Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MIGRATION SYSTEM ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        CLI Entry Point                              │   │
│   │                  tools/migration/main.go                            │   │
│   │                                                                     │   │
│   │   Commands:                                                         │   │
│   │   - gorm-migration latest   (apply all pending)                     │   │
│   │   - gorm-migration up       (apply one)                             │   │
│   │   - gorm-migration down     (rollback one)                          │   │
│   │   - gorm-migration make     (create new migration)                  │   │
│   └────────────────────────────────┬────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        Migration Registry                           │   │
│   │                  tools/migration/registry/                          │   │
│   │                                                                     │   │
│   │   - Stores all registered migrations                                │   │
│   │   - Migrations self-register via init()                             │   │
│   │   - Sorted by timestamp for ordering                                │   │
│   └────────────────────────────────┬────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        Migration Runner                             │   │
│   │                  tools/migration/runner/                            │   │
│   │                                                                     │   │
│   │   - Compares registry vs database (what's pending?)                 │   │
│   │   - Acquires lock (prevent concurrent runs)                         │   │
│   │   - Executes Up/Down in transaction                                 │   │
│   │   - Records applied migrations                                      │   │
│   └────────────────────────────────┬────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        Migration Repository                         │   │
│   │                  tools/migration/repository/                        │   │
│   │                                                                     │   │
│   │   Database Tables:                                                  │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │ migrations                                                  │   │   │
│   │   │ ├── id (SERIAL PK)                                          │   │   │
│   │   │ ├── name (VARCHAR) ← "20251221154500_add_user_table.go"     │   │   │
│   │   │ └── created_at (TIMESTAMP)                                  │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │ migration_lock                                              │   │   │
│   │   │ ├── id (INT PK, always 1)                                   │   │   │
│   │   │ └── is_locked (BOOLEAN)                                     │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
server/
├── migrations/                              # Migration files
│   ├── 20251213161251_add_account_table.go  # Creates accounts table
│   ├── 20251221154500_add_user_table.go     # Creates users table
│   ├── 20251221162915_add_user_account_table.go  # Junction table
│   ├── 20260128200000_add_user_indexes.go   # Performance indexes
│   └── 20260129170000_partition_users_table.go   # Table partitioning
│
└── tools/migration/
    ├── main.go                # CLI entry point (Cobra commands)
    ├── cmd/                   # Command implementations
    │   ├── latest.go          # Apply all pending
    │   ├── up.go              # Apply one migration
    │   ├── down.go            # Rollback one migration
    │   └── make.go            # Create new migration
    ├── runner/
    │   └── runner.go          # Core execution logic
    ├── registry/
    │   └── registry.go        # Migration registration
    ├── repository/
    │   └── migration/
    │       └── migration.go   # Database operations
    └── template/
        └── migration.go.tmpl  # Template for new migrations
```

---

## 4. Writing Migrations

### Anatomy of a Migration

```go
// server/migrations/20251221154500_add_user_table.go

package migrations

import (
    "github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/models"
    "github.com/alailsonko/messenger-clone/server/tools/migration/registry"
    "gorm.io/gorm"
)

// init() runs automatically when package is imported
// This is how migrations self-register
func init() {
    registry.Register(
        "20251221154500_add_user_table.go",  // Unique name (timestamp_description)
        Up_20251221154500,                    // Function to apply change
        Down_20251221154500,                  // Function to reverse change
    )
}

// Up_20251221154500 applies the migration (CREATE TABLE)
func Up_20251221154500(db *gorm.DB) error {
    // GORM's AutoMigrate reads the model struct and generates SQL:
    //
    // CREATE TABLE IF NOT EXISTS "users" (
    //     "id" uuid DEFAULT uuidv7() PRIMARY KEY,
    //     "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    //     "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    //     "first_name" varchar(100) NOT NULL,
    //     "last_name" varchar(100) NOT NULL
    // );
    // CREATE INDEX "idx_user_name" ON "users" ("first_name", "last_name");
    
    return db.Migrator().CreateTable(&models.UserModel{})
}

// Down_20251221154500 reverses the migration (DROP TABLE)
func Down_20251221154500(db *gorm.DB) error {
    // This is the "undo" operation
    // WARNING: This destroys data! Use carefully in production.
    return db.Migrator().DropTable(&models.UserModel{})
}
```

### The Model That Drives the Migration

```go
// server/internal/persistence/gorm/models/user.go

package models

import (
    "github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/common"
)

// UserModel defines the database schema
// GORM reads these tags to generate DDL
type UserModel struct {
    common.CommonModel  // Embedded: id, created_at, updated_at
    
    // size:100      → VARCHAR(100)
    // not null      → NOT NULL constraint
    // index:name    → Creates index with that name
    FirstName string `gorm:"size:100;not null;index:idx_user_name"`
    LastName  string `gorm:"size:100;not null;index:idx_user_name"`
}

// TableName overrides default table name
// Without this, GORM would use "user_models"
func (UserModel) TableName() string {
    return "users"
}
```

### Common Model (Base Fields)

```go
// server/internal/persistence/gorm/common/CommonModel.go

package common

import (
    "time"
    "github.com/google/uuid"
)

// CommonModel provides fields shared by all entities
// Embedding this gives every table: id, created_at, updated_at
type CommonModel struct {
    // type:uuid         → PostgreSQL UUID type
    // default:uuidv7()  → Auto-generate UUIDv7
    // primaryKey        → This is the PK
    Id uuid.UUID `gorm:"type:uuid;default:uuidv7();primaryKey"`
    
    // autoCreateTime    → Set automatically on INSERT
    CreatedAt time.Time `gorm:"autoCreateTime"`
    
    // autoUpdateTime    → Set automatically on UPDATE
    UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
```

### Creating a New Migration

```bash
# Using the CLI
make migrate-make NAME=add_email_to_users

# This creates:
# server/migrations/20260130143022_add_email_to_users.go
```

Generated template:

```go
// server/migrations/20260130143022_add_email_to_users.go

package migrations

import (
    "github.com/alailsonko/messenger-clone/server/tools/migration/registry"
    "gorm.io/gorm"
)

func init() {
    registry.Register("20260130143022_add_email_to_users.go", Up_20260130143022, Down_20260130143022)
}

func Up_20260130143022(db *gorm.DB) error {
    // TODO: Implement your migration
    // Example: return db.Exec("ALTER TABLE users ADD COLUMN email VARCHAR(255)").Error
    return nil
}

func Down_20260130143022(db *gorm.DB) error {
    // TODO: Implement rollback
    // Example: return db.Exec("ALTER TABLE users DROP COLUMN email").Error
    return nil
}
```

---

## 5. Migration Execution Flow

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MIGRATION EXECUTION FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   $ make migrate-up                                                         │
│                                                                             │
│   Step 1: Connect to Database                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   config := LoadConfig("migration.yml")                             │   │
│   │   db := gorm.Open(postgres.Open(dsn))                               │   │
│   │                                                                     │   │
│   │   DSN: host=shard-0 port=5440 user=postgres dbname=messenger        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 2: Create Tracking Tables (if not exist)                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   CREATE TABLE IF NOT EXISTS migrations (                           │   │
│   │       id SERIAL PRIMARY KEY,                                        │   │
│   │       name VARCHAR(255) NOT NULL UNIQUE,                            │   │
│   │       created_at TIMESTAMPTZ DEFAULT NOW()                          │   │
│   │   );                                                                │   │
│   │                                                                     │   │
│   │   CREATE TABLE IF NOT EXISTS migration_lock (                       │   │
│   │       id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),                  │   │
│   │       is_locked BOOLEAN DEFAULT FALSE                               │   │
│   │   );                                                                │   │
│   │   INSERT INTO migration_lock (id) VALUES (1) ON CONFLICT DO NOTHING;│   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 3: Acquire Lock                                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   SELECT is_locked FROM migration_lock WHERE id = 1;                │   │
│   │   → false (not locked)                                              │   │
│   │                                                                     │   │
│   │   UPDATE migration_lock SET is_locked = TRUE WHERE id = 1;          │   │
│   │   → Lock acquired!                                                  │   │
│   │                                                                     │   │
│   │   Why lock? Prevents two servers from running migrations            │   │
│   │   simultaneously during deployment.                                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 4: Get Pending Migrations                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Registered (in code):                                             │   │
│   │   ├── 20251213161251_add_account_table.go                           │   │
│   │   ├── 20251221154500_add_user_table.go                              │   │
│   │   └── 20251221162915_add_user_account_table.go                      │   │
│   │                                                                     │   │
│   │   Applied (in database):                                            │   │
│   │   SELECT name FROM migrations;                                      │   │
│   │   ├── 20251213161251_add_account_table.go                           │   │
│   │   └── 20251221154500_add_user_table.go                              │   │
│   │                                                                     │   │
│   │   Pending = Registered - Applied:                                   │   │
│   │   └── 20251221162915_add_user_account_table.go  ← Needs to run      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 5: Apply Each Pending Migration (in transaction)                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   BEGIN TRANSACTION;                                                │   │
│   │   SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;                     │   │
│   │                                                                     │   │
│   │   -- Execute Up function                                            │   │
│   │   CREATE TABLE users_accounts (...);                                │   │
│   │                                                                     │   │
│   │   -- Record that we applied it                                      │   │
│   │   INSERT INTO migrations (name) VALUES                              │   │
│   │       ('20251221162915_add_user_account_table.go');                 │   │
│   │                                                                     │   │
│   │   COMMIT;  -- All or nothing!                                       │   │
│   │                                                                     │   │
│   │   If any part fails → ROLLBACK (schema unchanged)                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Step 6: Release Lock                                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   UPDATE migration_lock SET is_locked = FALSE WHERE id = 1;         │   │
│   │                                                                     │   │
│   │   (Done in defer, so it runs even if migration fails)               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Output:                                                                   │
│   [MIGRATION] Applying: 20251221162915_add_user_account_table.go           │
│   [MIGRATION] Applied: 20251221162915_add_user_account_table.go            │
│   [MIGRATION] 1 migration(s) applied                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Runner Code

```go
// server/tools/migration/runner/runner.go

func RunLatest(ctx context.Context, db *gorm.DB) (int, error) {
    migrationRepository := migration_repository.NewMigrationRepository(db)
    
    // Step 2: Create tracking tables
    if err := migrationRepository.CreateTablesIfNotExists(); err != nil {
        return 0, fmt.Errorf("failed to create migration tables: %w", err)
    }
    
    // Step 3: Acquire lock
    locked, err := migrationRepository.IsLocked()
    if err != nil {
        return 0, fmt.Errorf("failed to check lock: %w", err)
    }
    if locked {
        log.Println("[MIGRATION] Locked, skipping (another process may be running)")
        return 0, nil
    }
    
    if err := migrationRepository.UpdateLock(true); err != nil {
        return 0, fmt.Errorf("failed to acquire lock: %w", err)
    }
    // Step 6: Release lock (even on failure)
    defer migrationRepository.UpdateLock(false)
    
    // Step 4: Get pending migrations
    allMigrations := registry.All()
    var names []string
    for name := range allMigrations {
        names = append(names, name)
    }
    sort.Strings(names)  // Timestamp ordering
    
    // Step 5: Apply each pending migration
    applied := 0
    for _, name := range names {
        isApplied, _ := isMigrationApplied(db, name)
        if isApplied {
            continue
        }
        
        mig, _ := registry.Get(name)
        log.Printf("[MIGRATION] Applying: %s", mig.Name)
        
        // Transaction ensures atomicity
        err := db.Transaction(func(tx *gorm.DB) error {
            if err := mig.Up(tx); err != nil {
                return err  // Triggers ROLLBACK
            }
            return tx.Create(&models.MigrationModel{Name: mig.Name}).Error
        }, &sql.TxOptions{Isolation: sql.LevelSerializable})
        
        if err != nil {
            return applied, err
        }
        
        log.Printf("[MIGRATION] Applied: %s", mig.Name)
        applied++
    }
    
    return applied, nil
}
```

---

## 6. Migrations in Sharded Databases

### The Challenge

With 5 database shards, migrations must run on ALL of them:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SHARDED MIGRATION CHALLENGE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Application Code: CREATE TABLE users (...)                                │
│                                                                             │
│   Must be applied to:                                                       │
│   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                    │
│   │   Shard 0     │ │   Shard 1     │ │   Shard 2     │ ...                │
│   │   :5440       │ │   :5441       │ │   :5442       │                    │
│   │               │ │               │ │               │                    │
│   │   ✅ users    │ │   ✅ users    │ │   ✅ users    │                    │
│   │   table       │ │   table       │ │   table       │                    │
│   └───────────────┘ └───────────────┘ └───────────────┘                    │
│                                                                             │
│   All shards must have IDENTICAL schema!                                    │
│   (Otherwise, queries will fail on some shards)                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Our Solution: Automatic Shard Migration

```go
// server/internal/bootstrap/shard_service.go

func (s *ShardedDatabaseService) Start(ctx context.Context) <-chan error {
    done := make(chan error, 1)
    
    go func() {
        // Connect to all shards
        manager, err := shard.NewShardManager(configs, s.config.VirtualNodes, logger)
        if err != nil {
            done <- err
            return
        }
        
        // Run migrations on ALL shards
        if err := s.runMigrations(manager); err != nil {
            done <- err
            return
        }
        
        s.shardManager = manager
        close(done)
    }()
    
    return done
}

func (s *ShardedDatabaseService) runMigrations(manager *shard.ShardManager) error {
    for _, shard := range manager.GetAllShards() {
        log.Printf("[MIGRATION] Running on shard %d...", shard.ID)
        
        // Run migrations on this shard's PRIMARY
        applied, err := runner.RunLatest(context.Background(), shard.WriteDB)
        if err != nil {
            return fmt.Errorf("shard %d migration failed: %w", shard.ID, err)
        }
        
        log.Printf("[MIGRATION] Shard %d: %d migration(s) applied", shard.ID, applied)
    }
    return nil
}
```

### Migration Flow Across Shards

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SHARDED MIGRATION FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Application Startup                                                       │
│         │                                                                   │
│         ▼                                                                   │
│   ShardedDatabaseService.Start()                                            │
│         │                                                                   │
│         ├──► Connect to Shard 0 (:5440)                                     │
│         │         │                                                         │
│         │         ├── Check migrations table                                │
│         │         ├── Pending: [20251221162915_add_user_account_table]      │
│         │         ├── BEGIN TRANSACTION                                     │
│         │         ├── CREATE TABLE users_accounts (...)                     │
│         │         ├── INSERT INTO migrations (...)                          │
│         │         └── COMMIT                                                │
│         │                                                                   │
│         ├──► Connect to Shard 1 (:5441)                                     │
│         │         │                                                         │
│         │         ├── Check migrations table                                │
│         │         ├── Pending: [20251221162915_add_user_account_table]      │
│         │         └── ... (same process)                                    │
│         │                                                                   │
│         ├──► Connect to Shard 2, 3, 4...                                    │
│         │         └── ... (same process for each)                           │
│         │                                                                   │
│         ▼                                                                   │
│   All shards have identical schema ✅                                       │
│         │                                                                   │
│         ▼                                                                   │
│   Application ready to accept requests                                      │
│                                                                             │
│   IMPORTANT: Each shard has its OWN migrations table                        │
│   - shard-0.migrations tracks shard-0's applied migrations                  │
│   - shard-1.migrations tracks shard-1's applied migrations                  │
│   - This allows independent migration tracking per shard                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Manual Shard Migration

```bash
# Run migrations on all shards manually
make migrate-shards

# This runs:
for shard in 0 1 2 3 4; do
    echo "Migrating shard-$shard..."
    docker exec shard-$shard psql -U postgres -d messenger -c "..."
done
```

---

## 7. Best Practices

### ✅ DO: Make Migrations Small and Focused

```go
// GOOD: One table per migration
func Up_20251221154500(db *gorm.DB) error {
    return db.Migrator().CreateTable(&models.UserModel{})
}

// BAD: Multiple unrelated changes
func Up_20251221154500(db *gorm.DB) error {
    db.Migrator().CreateTable(&models.UserModel{})
    db.Migrator().CreateTable(&models.MessageModel{})  // Should be separate
    db.Exec("ALTER TABLE accounts ADD COLUMN phone VARCHAR(20)")  // Should be separate
    return nil
}
```

### ✅ DO: Write Reversible Migrations

```go
// GOOD: Every Up has a corresponding Down
func Up_20260130143022(db *gorm.DB) error {
    return db.Exec("ALTER TABLE users ADD COLUMN email VARCHAR(255)").Error
}

func Down_20260130143022(db *gorm.DB) error {
    return db.Exec("ALTER TABLE users DROP COLUMN email").Error
}

// BAD: Down doesn't properly reverse Up
func Down_20260130143022(db *gorm.DB) error {
    return nil  // Can't rollback!
}
```

### ✅ DO: Test Migrations Before Production

```bash
# 1. Run on development
make migrate-up

# 2. Verify schema
make db-shell
\d users  # Describe table

# 3. Run on staging with production-like data
# 4. Finally run on production
```

### ❌ DON'T: Modify Existing Migrations

```go
// BAD: Changing a migration that's already applied
// This migration was applied last week
func Up_20251221154500(db *gorm.DB) error {
    return db.Migrator().CreateTable(&models.UserModel{})
    // Adding this after the fact WON'T work:
    // return db.Exec("CREATE INDEX ...").Error
}

// GOOD: Create a NEW migration for the change
func Up_20260130150000(db *gorm.DB) error {
    return db.Exec("CREATE INDEX idx_email ON users(email)").Error
}
```

### ❌ DON'T: Use Destructive Operations in Production Without Backup

```go
// DANGEROUS in production!
func Up_20260130160000(db *gorm.DB) error {
    // This DELETES DATA permanently
    return db.Exec("ALTER TABLE users DROP COLUMN legacy_field").Error
}

// SAFER approach: Deprecate first, delete later
// Migration 1: Add new column
// Migration 2: Copy data to new column
// Migration 3: Update code to use new column
// Migration 4: (Weeks later) Remove old column
```

---

## 8. Common Patterns

### Pattern 1: Add Column with Default

```go
func Up_20260130170000(db *gorm.DB) error {
    // Add column with default value (no table lock in PostgreSQL 11+)
    return db.Exec(`
        ALTER TABLE users 
        ADD COLUMN status VARCHAR(20) 
        DEFAULT 'active' 
        NOT NULL
    `).Error
}

func Down_20260130170000(db *gorm.DB) error {
    return db.Exec("ALTER TABLE users DROP COLUMN status").Error
}
```

### Pattern 2: Add Index Concurrently

```go
func Up_20260130180000(db *gorm.DB) error {
    // CONCURRENTLY doesn't lock the table for writes
    // Important for large tables in production!
    return db.Exec(`
        CREATE INDEX CONCURRENTLY idx_users_email 
        ON users(email)
    `).Error
}

func Down_20260130180000(db *gorm.DB) error {
    return db.Exec("DROP INDEX CONCURRENTLY idx_users_email").Error
}
```

### Pattern 3: Create Junction Table (Many-to-Many)

```go
func Up_20260130190000(db *gorm.DB) error {
    return db.Exec(`
        CREATE TABLE users_roles (
            id UUID PRIMARY KEY DEFAULT uuidv7(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, role_id)  -- Prevent duplicates
        )
    `).Error
}

func Down_20260130190000(db *gorm.DB) error {
    return db.Exec("DROP TABLE users_roles").Error
}
```

### Pattern 4: Rename Column (Zero Downtime)

```go
// Step 1: Add new column
func Up_20260130200000(db *gorm.DB) error {
    return db.Exec("ALTER TABLE users ADD COLUMN full_name VARCHAR(200)").Error
}

// Step 2: Copy data (in separate migration, after code handles both)
func Up_20260130200100(db *gorm.DB) error {
    return db.Exec("UPDATE users SET full_name = name WHERE full_name IS NULL").Error
}

// Step 3: Remove old column (after code no longer uses it)
func Up_20260130200200(db *gorm.DB) error {
    return db.Exec("ALTER TABLE users DROP COLUMN name").Error
}
```

---

## 9. Troubleshooting

### Problem: "Migration is locked"

```
[MIGRATION] Migration is locked, skipping (another process may be running)
```

**Cause**: Previous migration crashed without releasing lock.

**Solution**:
```sql
-- Connect to database
make db-shell

-- Release lock manually
UPDATE migration_lock SET is_locked = FALSE WHERE id = 1;
```

### Problem: "Table already exists"

```
ERROR: relation "users" already exists
```

**Cause**: Migration ran partially before, or table created manually.

**Solution**:
```go
func Up_20260130210000(db *gorm.DB) error {
    // Check if table exists before creating
    if !db.Migrator().HasTable(&models.UserModel{}) {
        return db.Migrator().CreateTable(&models.UserModel{})
    }
    return nil
}
```

### Problem: Migrations out of sync between shards

**Cause**: One shard failed during migration.

**Solution**:
```bash
# Check each shard's migration status
for shard in 0 1 2 3 4; do
    echo "=== Shard $shard ==="
    docker exec shard-$shard psql -U postgres -d messenger \
        -c "SELECT name FROM migrations ORDER BY name"
done

# Manually run missing migration on failed shard
docker exec shard-2 psql -U postgres -d messenger \
    -c "CREATE TABLE users_accounts (...)"
```

---

## 10. Real-World Examples

### Example: Instagram's Migration Strategy

Instagram runs PostgreSQL at massive scale. Their approach:

1. **Forward-only migrations**: Never rollback in production
2. **Schema changes in code first**: Code handles old AND new schema
3. **Gradual rollout**: Schema change → Deploy code → Cleanup

### Example: Stripe's Safe Migration Pattern

```go
// Stripe uses a 4-phase approach for zero-downtime migrations:

// Phase 1: Add new column (nullable)
func Up_Phase1(db *gorm.DB) error {
    return db.Exec("ALTER TABLE payments ADD COLUMN currency_v2 VARCHAR(3)").Error
}

// Phase 2: Dual-write (code writes to both old and new)
// (This is a code change, not a migration)

// Phase 3: Backfill old data
func Up_Phase3(db *gorm.DB) error {
    return db.Exec("UPDATE payments SET currency_v2 = currency WHERE currency_v2 IS NULL").Error
}

// Phase 4: Remove old column (weeks later, after verifying)
func Up_Phase4(db *gorm.DB) error {
    return db.Exec("ALTER TABLE payments DROP COLUMN currency").Error
}
```

### Example: Our User Account Migration

```go
// server/migrations/20251221162915_add_user_account_table.go

// This creates a many-to-many relationship between users and accounts
func Up_20251221162915(db *gorm.DB) error {
    m := db.Migrator()
    
    // Ensure dependencies exist first
    if !m.HasTable(&models.UserModel{}) {
        if err := m.CreateTable(&models.UserModel{}); err != nil {
            return err
        }
    }
    if !m.HasTable(&models.AccountModel{}) {
        if err := m.CreateTable(&models.AccountModel{}); err != nil {
            return err
        }
    }
    
    // Now create junction table with FKs
    return m.CreateTable(&models.UserAccountModel{})
}

func Down_20251221162915(db *gorm.DB) error {
    return db.Migrator().DropTable(&models.UserAccountModel{})
}
```

---

## Summary

| Aspect | Key Point |
|--------|-----------|
| **What** | Version-controlled database schema changes |
| **Why** | Consistent schema across all environments |
| **How** | Timestamped files with Up/Down functions |
| **When** | Run on application startup or deployment |
| **Where** | On ALL shards (each has own migrations table) |
| **Safety** | Transactions, locks, reversible operations |

---

## Quick Reference

```bash
# Create new migration
make migrate-make NAME=description

# Apply all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Run on all shards
make migrate-shards

# Check migration status
make db-shell
SELECT * FROM migrations ORDER BY name;
```

---

*This documentation is part of the Messenger Clone project - a learning resource for distributed systems.*
