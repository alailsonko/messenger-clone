# 📚 Documentation Index

> **Complete learning resource for distributed systems, database scaling, and high-performance Go applications**

## 🎯 Start Here

| If You Want To... | Read This |
|-------------------|-----------|
| Understand the full architecture | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Learn about database sharding | [SHARDING_GUIDE.md](SHARDING_GUIDE.md) |
| Understand migrations | [MIGRATIONS.md](MIGRATIONS.md) |
| Learn about foreign keys in sharded DBs | [FOREIGN_KEYS.md](FOREIGN_KEYS.md) |
| Optimize performance | [PERFORMANCE_TUNING.md](PERFORMANCE_TUNING.md) |
| Scale your database | [DATABASE_SCALING.md](DATABASE_SCALING.md) |
| Use PostgreSQL partitioning | [PARTITIONING_GUIDE.md](PARTITIONING_GUIDE.md) |

---

## 📖 Documentation Overview

### 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md)
**The complete project overview - START HERE!**

- Project overview and technology stack
- Who uses this architecture (Facebook, Instagram, Discord, Uber)
- System architecture with diagrams
- Clean Architecture pattern explained
- Database layer deep dive
- Request flow walkthrough
- Real-world scenarios with 10K users
- Glossary of terms

### 🔀 [SHARDING_GUIDE.md](SHARDING_GUIDE.md)
**Everything about horizontal database scaling**

- What is sharding?
- Sharding vs Partitioning comparison
- Why shard (with load test results)?
- Architecture overview with diagrams
- Consistent hashing explained
- Quick start guide
- Monitoring & operations
- Common pitfalls

### 🔄 [MIGRATIONS.md](MIGRATIONS.md)
**Database schema versioning explained**

- What are migrations?
- Why migrations matter (with examples)
- Our migration architecture
- Writing migrations step-by-step
- Migration execution flow
- Migrations in sharded databases
- Best practices
- Common patterns (add column, create index, etc.)
- Troubleshooting guide
- Real-world examples (Instagram, Stripe)

### 🔗 [FOREIGN_KEYS.md](FOREIGN_KEYS.md)
**Handling relationships in distributed databases**

- Foreign key fundamentals
- Foreign keys in PostgreSQL
- The sharding challenge (why FKs don't work cross-shard)
- Solution strategies:
  - Co-location
  - Application-level enforcement
  - Denormalization
  - Event-driven consistency
- GORM relationship patterns
- Real-world examples (Instagram, Discord)
- Best practices

### ⚡ [PERFORMANCE_TUNING.md](PERFORMANCE_TUNING.md)
**How we achieved 100% success at 10K users**

- Results comparison (before/after)
- Architecture overview
- Database connection pool tuning
- GORM ORM optimizations
- PostgreSQL server tuning
- Fiber HTTP server tuning
- Application-level optimizations
- Query optimizations
- Middleware configuration
- Load testing methodology

### 📊 [DATABASE_SCALING.md](DATABASE_SCALING.md)
**Comprehensive scaling strategies**

- Current state (1M+ users)
- Scaling strategies pyramid
- Table partitioning (range, list, hash)
- Read replicas
- Connection pooling
- Sharding implementation
- Migration strategies
- Monitoring

### 📦 [PARTITIONING_GUIDE.md](PARTITIONING_GUIDE.md)
**Deep dive into PostgreSQL partitioning**

- What is partitioning?
- Why partition (with benchmarks)?
- Types of partitioning
- How hash partitioning works
- Step-by-step migration
- PostgreSQL query routing
- Performance benefits
- Best practices
- Hands-on exercises

---

## 🎓 Learning Paths

### Path 1: Complete Beginner
1. [ARCHITECTURE.md](ARCHITECTURE.md) - Understand the big picture
2. [MIGRATIONS.md](MIGRATIONS.md) - Learn how schema changes work
3. [FOREIGN_KEYS.md](FOREIGN_KEYS.md) - Understand relationships

### Path 2: Scaling Your Database
1. [DATABASE_SCALING.md](DATABASE_SCALING.md) - Overview of strategies
2. [SHARDING_GUIDE.md](SHARDING_GUIDE.md) - Deep dive into sharding
3. [PARTITIONING_GUIDE.md](PARTITIONING_GUIDE.md) - Table partitioning

### Path 3: Performance Optimization
1. [PERFORMANCE_TUNING.md](PERFORMANCE_TUNING.md) - All optimizations
2. [DATABASE_SCALING.md](DATABASE_SCALING.md) - Connection pooling
3. [SHARDING_GUIDE.md](SHARDING_GUIDE.md) - Distributed performance

### Path 4: Building Similar Systems
1. [ARCHITECTURE.md](ARCHITECTURE.md) - Learn the patterns
2. [SHARDING_GUIDE.md](SHARDING_GUIDE.md) - Implement sharding
3. [MIGRATIONS.md](MIGRATIONS.md) - Set up migrations
4. [FOREIGN_KEYS.md](FOREIGN_KEYS.md) - Handle relationships
5. [PERFORMANCE_TUNING.md](PERFORMANCE_TUNING.md) - Optimize

---

## 🏢 Companies Using These Patterns

| Company | Scale | Key Pattern | Our Equivalent |
|---------|-------|-------------|----------------|
| **Facebook** | 3B users | User-based sharding | ShardManager |
| **Instagram** | 2B users | PostgreSQL sharding | Same! |
| **Discord** | 150M users | Channel-based sharding | Consistent hashing |
| **Uber** | 100M users | City/time sharding | Range sharding |
| **Pinterest** | 450M users | User-based sharding | Same approach |
| **Stripe** | Millions txn | Safe migrations | Our migration system |

---

## 🔧 Quick Command Reference

```bash
# Development
make dev              # Start everything (infra + API with prefork)
make up               # Start infrastructure only
make down             # Stop everything

# Database
make db-shell         # Connect to shard-0 PostgreSQL
make migrate-up       # Run pending migrations
make migrate-make NAME=desc  # Create new migration

# Load Testing
make loadtest-read    # 10K concurrent read test
make loadtest-write   # 10K concurrent write test
make loadtest-crud    # Full CRUD test

# Monitoring
make health           # Check all services
make stats            # Show shard statistics
make logs             # Tail all logs
```

---

## 📁 Project Structure

```
messenger-clone/
├── docs/                    # 📖 You are here
│   ├── INDEX.md             # This file
│   ├── ARCHITECTURE.md      # System overview
│   ├── SHARDING_GUIDE.md    # Sharding deep dive
│   ├── MIGRATIONS.md        # Schema versioning
│   ├── FOREIGN_KEYS.md      # Relationships in sharded DBs
│   ├── PERFORMANCE_TUNING.md # Optimization guide
│   ├── DATABASE_SCALING.md  # Scaling strategies
│   └── PARTITIONING_GUIDE.md # Table partitioning
│
├── server/                  # Go API server
│   ├── cmd/api/             # Entry point
│   ├── internal/            # Clean architecture layers
│   └── migrations/          # Database migrations
│
├── database/                # Database configuration
│   ├── postgres/            # PostgreSQL config
│   └── pgbouncer/           # Connection pooler config
│
├── loadtest/                # Gatling load tests
│   └── gatling/simulations/ # Test scenarios
│
├── docker-compose.yml       # Infrastructure orchestration
├── Makefile                 # Build commands
└── README.md                # Quick start
```

---

## 🎯 Key Metrics

| Metric | Our Achievement |
|--------|-----------------|
| Concurrent Users | 10,000 |
| Success Rate | 100% |
| Mean Latency | 2ms |
| P95 Latency | 5ms |
| Throughput | 5,000+ req/sec |
| Total Users | 1M+ |
| Shards | 5 |
| Prefork Workers | 7 |

---

*Happy learning! If you have questions, the architecture docs are a great place to start.*
