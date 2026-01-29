# Database Sharding: Complete Implementation Guide

## 📚 Table of Contents

1. [What is Sharding?](#1-what-is-sharding)
2. [Sharding vs Partitioning](#2-sharding-vs-partitioning)
3. [Why Shard?](#3-why-shard)
4. [Architecture Overview](#4-architecture-overview)
5. [Consistent Hashing](#5-consistent-hashing)
6. [Quick Start](#6-quick-start)
7. [Load Test Results](#7-load-test-results)
8. [Monitoring & Operations](#8-monitoring--operations)
9. [Common Pitfalls](#9-common-pitfalls)

---

## 1. What is Sharding?

**Sharding** (horizontal partitioning across servers) splits data across **multiple independent database servers** (shards). Each shard holds a subset of the total data and operates independently.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SHARDED DATABASE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                    ┌───────────────────────────────┐                        │
│                    │       Application Layer       │                        │
│                    │       (Shard Router)          │                        │
│                    └───────────────┬───────────────┘                        │
│                                    │                                        │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          │           │             │             │           │              │
│          ▼           ▼             ▼             ▼           ▼              │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│   │   Shard 0   │ │   Shard 1   │ │   Shard 2   │ │   Shard 3   │          │
│   │  Primary    │ │  Primary    │ │  Primary    │ │  Primary    │          │
│   │   :5440     │ │   :5441     │ │   :5442     │ │   :5443     │          │
│   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘          │
│          │               │               │               │                  │
│          ▼               ▼               ▼               ▼                  │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│   │   Shard 0   │ │   Shard 1   │ │   Shard 2   │ │   Shard 3   │          │
│   │  Replica    │ │  Replica    │ │  Replica    │ │  Replica    │          │
│   │   :5450     │ │   :5451     │ │   :5452     │ │   :5453     │          │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                                             │
│   BENEFITS:                                                                 │
│   ✓ No single point of failure (each shard independent)                     │
│   ✓ Linear scalability (add more shards = more capacity)                    │
│   ✓ Smaller backups (per-shard)                                            │
│   ✓ Parallel processing across shards                                       │
│   ✓ Read replicas per shard for high availability                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Terminology

| Term | Definition | Example |
|------|------------|---------|
| **Shard** | A single database server holding a subset of data | `shard-0` holds ~25% of users |
| **Shard Key** | Column used to determine which shard stores a row | `user_id` |
| **Shard Router** | Application layer that routes queries to correct shard | Our `ShardManager` |
| **Replica** | Hot standby copy of a shard for reads/failover | `shard-0-replica` |
| **Consistent Hashing** | Algorithm minimizing data movement on resharding | MD5 with virtual nodes |

---

## 2. Sharding vs Partitioning

| Aspect | Partitioning | Sharding |
|--------|--------------|----------|
| Location | Same server | Different servers |
| Scale limit | 1 machine max | Unlimited (add servers) |
| Routing | Database handles | Application handles |
| Complexity | Low | High |
| JOINs | Easy (same DB) | Hard (cross-shard) |
| Transactions | ACID guaranteed | Distributed (2PC needed) |
| Failure impact | Entire DB down | Only 1 shard affected |
| Use case | < 1TB, 1 machine OK | > 1TB, need scale-out |

---

## 3. Why Shard?

### Performance Numbers (Our Load Tests)

| Metric | 5K Concurrent Users | 10K Concurrent Users |
|--------|---------------------|----------------------|
| **Throughput** | 7,783 req/sec | 6,245 req/sec |
| **Success Rate** | 99.7% | 95.0% |
| **Mean Response** | 514ms | 1,250ms |
| **95th Percentile** | 2,194ms | 4,981ms |
| **Users Created** | 550,968 | 451,106 (additional) |

### Total Capacity Demonstrated

- **1,002,372 users** stored across 4 shards
- **~250K users per shard** evenly distributed
- **All replicas perfectly synced** under heavy write load
- **Streaming replication** kept up with 6K+ writes/second

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CURRENT ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        ┌─────────────┐                              │
│                        │   Client    │                              │
│                        └──────┬──────┘                              │
│                               │                                     │
│                        ┌──────▼──────┐                              │
│                        │  Go Fiber   │                              │
│                        │    API      │                              │
│                        │  :8080      │                              │
│                        └──────┬──────┘                              │
│                               │                                     │
│                        ┌──────▼──────┐                              │
│                        │   Shard     │                              │
│                        │  Manager    │                              │
│                        └──────┬──────┘                              │
│                               │                                     │
│        ┌──────────────────────┼──────────────────────┐              │
│        │          │           │           │          │              │
│        ▼          ▼           ▼           ▼          │              │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │              │
│   │ Shard 0 │ │ Shard 1 │ │ Shard 2 │ │ Shard 3 │   │              │
│   │ Primary │ │ Primary │ │ Primary │ │ Primary │   │              │
│   │  :5440  │ │  :5441  │ │  :5442  │ │  :5443  │   │              │
│   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │              │
│        │          │           │           │          │              │
│        ▼          ▼           ▼           ▼          │              │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │              │
│   │ Replica │ │ Replica │ │ Replica │ │ Replica │   │              │
│   │  :5450  │ │  :5451  │ │  :5452  │ │  :5453  │   │              │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘   │              │
│                                                     │              │
│                        ┌──────▼──────┐                             │
│                        │    Redis    │                             │
│                        │    :6379    │                             │
│                        └─────────────┘                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Port Assignments

| Service | Port | Description |
|---------|------|-------------|
| API | 8080 | Go Fiber REST API |
| Shard 0 Primary | 5440 | PostgreSQL read/write |
| Shard 1 Primary | 5441 | PostgreSQL read/write |
| Shard 2 Primary | 5442 | PostgreSQL read/write |
| Shard 3 Primary | 5443 | PostgreSQL read/write |
| Shard 0 Replica | 5450 | PostgreSQL read-only |
| Shard 1 Replica | 5451 | PostgreSQL read-only |
| Shard 2 Replica | 5452 | PostgreSQL read-only |
| Shard 3 Replica | 5453 | PostgreSQL read-only |
| Redis | 6379 | Caching layer |

### Key Components

- **ShardManager**: `server/internal/infra/sharding/shard_manager.go`
  - MD5 consistent hashing with 150 virtual nodes per shard
  - Automatic shard selection based on user ID
  - Health checking for all shards

- **ShardedUserRepository**: `server/internal/persistence/repository/sharded_user_repository.go`
  - Automatic routing based on user ID
  - Parallel queries across all shards (scatter-gather)
  - Connection pooling per shard

---

## 5. Consistent Hashing

Our implementation uses consistent hashing with virtual nodes:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONSISTENT HASHING RING                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Imagine a circle (ring) with values 0 to 2^32:                            │
│                                                                             │
│                           0                                                 │
│                           │                                                 │
│                    ┌──────┴──────┐                                          │
│                   ╱               ╲                                         │
│                  │    Shard 0     │                                         │
│                  │    (1/4 of     │                                         │
│       2^32-1 ────│     ring)      │──── 2^31                                │
│          │       │                │       │                                 │
│          │       ╲    Shard 3    ╱        │                                 │
│          │        └──────┬──────┘         │                                 │
│          │      ╱        │        ╲       │                                 │
│          │  Shard 2      │      Shard 1   │                                 │
│          │               │                │                                 │
│          └───────────────┴────────────────┘                                 │
│                                                                             │
│   HOW IT WORKS:                                                             │
│   1. Hash each shard's ID → place on ring (with 150 virtual nodes)          │
│   2. Hash user_id → find position on ring                                   │
│   3. Walk clockwise to find first shard                                     │
│                                                                             │
│   BENEFITS:                                                                 │
│   • Only ~1/N data moves when adding shard N                                │
│   • Virtual nodes ensure even distribution                                  │
│   • MD5 provides good hash distribution                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Quick Start

### Start Sharded Environment

```bash
# Start all shards with replicas
docker-compose up -d

# Verify all containers are healthy
docker ps --format "table {{.Names}}\t{{.Status}}"

# Expected output:
# shard-0           Up (healthy)
# shard-0-replica   Up (healthy)
# shard-1           Up (healthy)
# shard-1-replica   Up (healthy)
# shard-2           Up (healthy)
# shard-2-replica   Up (healthy)
# shard-3           Up (healthy)
# shard-3-replica   Up (healthy)
# redis-sharded     Up
```

### Create Users Table on All Shards

```bash
for i in 0 1 2 3; do
  docker exec shard-$i psql -U postgres -d messenger -c "
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      first_name VARCHAR(255),
      last_name VARCHAR(255)
    );"
done
```

### Run API with Sharding

```bash
cd server
SHARDING_ENABLED=true ./messenger-api
```

### Verify Sharding Works

```bash
# Create a user
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe"}'

# Check shard stats
curl http://localhost:8080/api/v1/shards/stats | jq
```

---

## 7. Load Test Results

### Test Configuration

- **Tool**: Gatling 3.10.3
- **Simulation**: CreateUserSimulation
- **Duration**: 60-75 seconds
- **Environment**: 4 shards with streaming replication

### Results Summary

| Concurrent Users | Requests | Success Rate | Throughput | Mean Response |
|------------------|----------|--------------|------------|---------------|
| 1,000 | 35,000 | 100% | 384/sec | 2ms |
| 5,000 | 552,640 | 99.7% | 7,783/sec | 514ms |
| 10,000 | 474,639 | 95.0% | 6,245/sec | 1,250ms |

### Shard Distribution (After 10K Test)

| Shard | User Count | Percentage |
|-------|------------|------------|
| 0 | 233,831 | 23.3% |
| 1 | 249,883 | 24.9% |
| 2 | 259,295 | 25.9% |
| 3 | 259,363 | 25.9% |
| **Total** | **1,002,372** | **100%** |

### Replication Verification

All replicas perfectly synced under heavy write load (6K+ writes/second):

```
Shard 0: PRIMARY=233,831 REPLICA=233,831 ✓
Shard 1: PRIMARY=249,883 REPLICA=249,883 ✓
Shard 2: PRIMARY=259,295 REPLICA=259,295 ✓
Shard 3: PRIMARY=259,363 REPLICA=259,363 ✓
```

---

## 8. Monitoring & Operations

### Check Shard Stats

```bash
curl http://localhost:8080/api/v1/shards/stats | jq
```

### Verify Replication Status

```bash
for i in 0 1 2 3; do
  echo "=== Shard $i ==="
  docker exec shard-$i psql -U postgres -c "SELECT state FROM pg_stat_replication;"
done
```

### Check Primary/Replica Sync

```bash
for i in 0 1 2 3; do
  PRIMARY=$(docker exec shard-$i psql -U postgres -d messenger -t -c "SELECT COUNT(*) FROM users")
  REPLICA=$(docker exec shard-$i-replica psql -U postgres -d messenger -t -c "SELECT COUNT(*) FROM users")
  echo "Shard $i: PRIMARY=$PRIMARY REPLICA=$REPLICA"
done
```

### View Shard Health

```bash
curl http://localhost:8080/api/v1/shards/health | jq
```

---

## 9. Common Pitfalls

### ❌ Wrong Shard Key Choice

Don't shard by timestamp (new users all go to one shard) or country (uneven distribution).

**✅ Good**: Shard by user_id (UUID) with consistent hashing for even distribution.

### ❌ Too Many Scatter-Gather Queries

Queries that need all shards are slow (limited by slowest shard).

**✅ Good**: Design queries to hit single shard when possible.

### ❌ No Connection Pooling

Each shard needs its own connection pool.

**✅ Good**: Configure GORM with proper pool settings per shard.

---

## 🎓 Summary

Our sharding implementation:

1. **4 PostgreSQL shards** with consistent hashing (MD5 + 150 virtual nodes)
2. **Hot standby replicas** for each shard using streaming replication
3. **~1 million users** distributed evenly across shards
4. **7,783 req/sec throughput** at 5K concurrent users
5. **99.7% success rate** under heavy load

**When to use sharding:**
- Data exceeds single server capacity (> 1-2 TB)
- Need > 50,000 writes/second
- Need geographic distribution
- Single server is a reliability concern
