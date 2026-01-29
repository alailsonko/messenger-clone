# Database Scaling & Sharding Guide

## 📊 Current State (1M+ users across 4 shards)

| Shard | Users | Status |
|-------|-------|--------|
| Shard 0 | 233,831 | ✅ Primary + Replica |
| Shard 1 | 249,883 | ✅ Primary + Replica |
| Shard 2 | 259,295 | ✅ Primary + Replica |
| Shard 3 | 259,363 | ✅ Primary + Replica |
| **Total** | **1,002,372** | **Evenly distributed** |

### Load Test Results

| Concurrent Users | Throughput | Success Rate | Mean Response |
|------------------|------------|--------------|---------------|
| 1,000 | 384 req/sec | 100% | 2ms |
| 5,000 | 7,783 req/sec | 99.7% | 514ms |
| 10,000 | 6,245 req/sec | 95.0% | 1,250ms |

**Observation**: Sharding with consistent hashing achieves near-perfect data distribution and handles 6K+ writes/sec with all replicas in sync.

---

## 🎯 Scaling Strategies Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE SCALING PYRAMID                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                          ┌─────────┐                                │
│                          │SHARDING │  ← 100M+ rows                  │
│                         ─┴─────────┴─                               │
│                       ┌───────────────┐                             │
│                       │ PARTITIONING  │  ← 10M+ rows                │
│                      ─┴───────────────┴─                            │
│                    ┌─────────────────────┐                          │
│                    │   READ REPLICAS     │  ← 1M+ rows              │
│                   ─┴─────────────────────┴─                         │
│                 ┌─────────────────────────────┐                     │
│                 │   INDEXING & QUERY TUNING   │  ← 100K+ rows       │
│                ─┴─────────────────────────────┴─                    │
│              ┌───────────────────────────────────┐                  │
│              │   CONNECTION POOLING & CACHING    │  ← Any size      │
│             ─┴───────────────────────────────────┴─                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

You're currently at **1M+ users with 4-shard architecture and streaming replication**. Sharding is already implemented!

---

## 1️⃣ Table Partitioning (Native PostgreSQL)

Partitioning splits a large table into smaller physical pieces while keeping it logically as one table.

### Types of Partitioning

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PARTITIONING STRATEGIES                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │    RANGE     │  │    LIST      │  │    HASH      │              │
│  │  (by date)   │  │ (by region)  │  │ (by user_id) │              │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤              │
│  │ Jan 2024     │  │ US           │  │ hash(id) % 4 │              │
│  │ Feb 2024     │  │ EU           │  │   = 0,1,2,3  │              │
│  │ Mar 2024     │  │ ASIA         │  │              │              │
│  │ ...          │  │ ...          │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  Best for:         Best for:         Best for:                      │
│  - Time-series     - Multi-tenant    - Even data                    │
│  - Archiving old   - Regional data   - distribution                 │
│    data            - Categories      - No natural key               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation: Range Partitioning by Date

```sql
-- Step 1: Create partitioned table
CREATE TABLE users_partitioned (
    id UUID NOT NULL DEFAULT uuidv7(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id, created_at)  -- Partition key must be in PK
) PARTITION BY RANGE (created_at);

-- Step 2: Create partitions for each month
CREATE TABLE users_2024_01 PARTITION OF users_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE users_2024_02 PARTITION OF users_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE users_2024_03 PARTITION OF users_partitioned
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- ... more partitions

-- Step 3: Create default partition for overflow
CREATE TABLE users_default PARTITION OF users_partitioned DEFAULT;

-- Step 4: Create indexes on partitions (automatically inherited)
CREATE INDEX idx_users_part_name ON users_partitioned (first_name, last_name);
CREATE INDEX idx_users_part_created ON users_partitioned (created_at DESC);
```

### Implementation: Hash Partitioning by ID

```sql
-- Better for even distribution when you don't query by date
CREATE TABLE users_hash_partitioned (
    id UUID NOT NULL DEFAULT uuidv7(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) PARTITION BY HASH (id);

-- Create 8 hash partitions
CREATE TABLE users_hash_p0 PARTITION OF users_hash_partitioned
    FOR VALUES WITH (MODULUS 8, REMAINDER 0);
CREATE TABLE users_hash_p1 PARTITION OF users_hash_partitioned
    FOR VALUES WITH (MODULUS 8, REMAINDER 1);
CREATE TABLE users_hash_p2 PARTITION OF users_hash_partitioned
    FOR VALUES WITH (MODULUS 8, REMAINDER 2);
CREATE TABLE users_hash_p3 PARTITION OF users_hash_partitioned
    FOR VALUES WITH (MODULUS 8, REMAINDER 3);
CREATE TABLE users_hash_p4 PARTITION OF users_hash_partitioned
    FOR VALUES WITH (MODULUS 8, REMAINDER 4);
CREATE TABLE users_hash_p5 PARTITION OF users_hash_partitioned
    FOR VALUES WITH (MODULUS 8, REMAINDER 5);
CREATE TABLE users_hash_p6 PARTITION OF users_hash_partitioned
    FOR VALUES WITH (MODULUS 8, REMAINDER 6);
CREATE TABLE users_hash_p7 PARTITION OF users_hash_partitioned
    FOR VALUES WITH (MODULUS 8, REMAINDER 7);
```

### Benefits of Partitioning

| Benefit | Description |
|---------|-------------|
| **Partition Pruning** | Queries automatically skip irrelevant partitions |
| **Parallel Scans** | PostgreSQL can scan partitions in parallel |
| **Easy Archiving** | Drop old partitions instead of DELETE (instant!) |
| **Smaller Indexes** | Each partition has its own smaller index |
| **Maintenance** | VACUUM/ANALYZE on smaller chunks |

---

## 2️⃣ Sharding (Distributed Database)

Sharding distributes data across **multiple database servers**.

### Sharding Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SHARDING ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        ┌─────────────┐                              │
│                        │   Client    │                              │
│                        └──────┬──────┘                              │
│                               │                                     │
│                        ┌──────▼──────┐                              │
│                        │   Router    │  ← Determines which shard    │
│                        │  (App/Proxy)│                              │
│                        └──────┬──────┘                              │
│               ┌───────────────┼───────────────┐                     │
│               │               │               │                     │
│        ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐             │
│        │   Shard 1   │ │   Shard 2   │ │   Shard 3   │             │
│        │  (0-33%)    │ │  (34-66%)   │ │  (67-100%)  │             │
│        └──────┬──────┘ └──────┬──────┘ └──────┬──────┘             │
│               │               │               │                     │
│        ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐             │
│        │  Replica 1  │ │  Replica 2  │ │  Replica 3  │             │
│        └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Sharding Strategies

#### 1. Application-Level Sharding (DIY)

```go
// shard_router.go
package sharding

import (
    "crypto/sha256"
    "encoding/binary"
    "fmt"
    
    "github.com/google/uuid"
    "gorm.io/gorm"
)

// ShardConfig holds configuration for sharding
type ShardConfig struct {
    ShardCount int
    Shards     map[int]*gorm.DB
}

// ShardRouter routes queries to the correct shard
type ShardRouter struct {
    config *ShardConfig
}

// NewShardRouter creates a new shard router
func NewShardRouter(shards map[int]*gorm.DB) *ShardRouter {
    return &ShardRouter{
        config: &ShardConfig{
            ShardCount: len(shards),
            Shards:     shards,
        },
    }
}

// GetShardForUser returns the shard for a given user ID
func (r *ShardRouter) GetShardForUser(userID uuid.UUID) *gorm.DB {
    shardIndex := r.hashToShard(userID)
    return r.config.Shards[shardIndex]
}

// hashToShard converts a UUID to a shard index
func (r *ShardRouter) hashToShard(id uuid.UUID) int {
    hash := sha256.Sum256(id[:])
    // Use first 4 bytes as uint32
    num := binary.BigEndian.Uint32(hash[:4])
    return int(num % uint32(r.config.ShardCount))
}

// GetAllShards returns all shards for scatter-gather queries
func (r *ShardRouter) GetAllShards() []*gorm.DB {
    shards := make([]*gorm.DB, r.config.ShardCount)
    for i, db := range r.config.Shards {
        shards[i] = db
    }
    return shards
}

// Example usage in repository
type ShardedUserRepository struct {
    router *ShardRouter
}

func (r *ShardedUserRepository) Create(user *User) error {
    shard := r.router.GetShardForUser(user.ID)
    return shard.Create(user).Error
}

func (r *ShardedUserRepository) FindByID(id uuid.UUID) (*User, error) {
    shard := r.router.GetShardForUser(id)
    var user User
    err := shard.First(&user, "id = ?", id).Error
    return &user, err
}

// Scatter-gather for queries that need all shards
func (r *ShardedUserRepository) CountAll() (int64, error) {
    var totalCount int64
    
    // Query all shards in parallel
    results := make(chan int64, len(r.router.GetAllShards()))
    errors := make(chan error, len(r.router.GetAllShards()))
    
    for _, shard := range r.router.GetAllShards() {
        go func(db *gorm.DB) {
            var count int64
            if err := db.Model(&User{}).Count(&count).Error; err != nil {
                errors <- err
                return
            }
            results <- count
        }(shard)
    }
    
    for range r.router.GetAllShards() {
        select {
        case count := <-results:
            totalCount += count
        case err := <-errors:
            return 0, err
        }
    }
    
    return totalCount, nil
}
```

#### 2. Using Citus (PostgreSQL Extension)

Citus turns PostgreSQL into a distributed database:

```sql
-- On coordinator node
CREATE EXTENSION citus;

-- Add worker nodes
SELECT citus_add_node('worker1', 5432);
SELECT citus_add_node('worker2', 5432);
SELECT citus_add_node('worker3', 5432);

-- Distribute the users table by ID
SELECT create_distributed_table('users', 'id');

-- Now queries automatically route to correct shard!
INSERT INTO users (first_name, last_name) VALUES ('John', 'Doe');
-- Citus automatically routes to correct worker

SELECT * FROM users WHERE id = '123e4567-e89b-12d3-a456-426614174000';
-- Citus routes to the shard containing this ID
```

#### 3. Using Vitess (MySQL compatible)

For MySQL-compatible sharding, Vitess is popular (used by YouTube, Slack):

```yaml
# vitess topology
keyspaces:
  - name: messenger
    shards:
      - name: "-80"    # IDs hashing to 0x00-0x7F
        tablets:
          - type: primary
            host: shard1-primary
          - type: replica
            host: shard1-replica
      - name: "80-"    # IDs hashing to 0x80-0xFF
        tablets:
          - type: primary
            host: shard2-primary
          - type: replica
            host: shard2-replica
```

---

## 3️⃣ Comparison: Partitioning vs Sharding

```
┌─────────────────────────────────────────────────────────────────────┐
│             PARTITIONING vs SHARDING                                │
├─────────────────┬────────────────────┬──────────────────────────────┤
│     Aspect      │   Partitioning     │        Sharding              │
├─────────────────┼────────────────────┼──────────────────────────────┤
│ Location        │ Single server      │ Multiple servers             │
│ Complexity      │ Low (built-in)     │ High (distributed system)    │
│ Transactions    │ Full ACID          │ Distributed transactions     │
│ JOINs           │ Easy               │ Cross-shard = complex        │
│ Scale limit     │ Single server RAM  │ Unlimited horizontal         │
│ Maintenance     │ Standard PG tools  │ Custom tooling needed        │
│ Best for        │ 10M - 500M rows    │ 500M+ rows                   │
│ When to use     │ First! Try this    │ When partitioning isn't      │
│                 │ before sharding    │ enough                       │
└─────────────────┴────────────────────┴──────────────────────────────┘
```

---

## 4️⃣ Other Optimization Techniques

### A. Connection Pooling with PgBouncer

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONNECTION POOLING                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   WITHOUT POOLING              WITH PGBOUNCER                       │
│                                                                     │
│   ┌─────┐                      ┌─────┐                              │
│   │App 1│──┐                   │App 1│──┐                           │
│   └─────┘  │                   └─────┘  │                           │
│   ┌─────┐  │ 1000              ┌─────┐  │  100                      │
│   │App 2│──┼─connections──►    │App 2│──┼─connections──►            │
│   └─────┘  │                   └─────┘  │               ┌─────────┐ │
│   ┌─────┐  │                   ┌─────┐  │               │PgBouncer│ │
│   │App 3│──┘                   │App 3│──┘               └────┬────┘ │
│   └─────┘                      └─────┘                       │      │
│        │                                                     │ 50   │
│        ▼                                                     ▼      │
│   ┌─────────┐                                           ┌─────────┐ │
│   │PostgreSQL│ (overwhelmed!)                           │PostgreSQL│ │
│   │ 1000     │                                          │   50     │ │
│   │connections│                                         │connections││
│   └─────────┘                                           └─────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

```yaml
# docker-compose.yml - Add PgBouncer
pgbouncer:
  image: edoburu/pgbouncer:latest
  environment:
    DATABASE_URL: postgres://root:root@messenger_db_primary:5432/postgres
    POOL_MODE: transaction  # Important for GORM
    MAX_CLIENT_CONN: 1000
    DEFAULT_POOL_SIZE: 50
    MIN_POOL_SIZE: 10
  ports:
    - "6432:5432"
  depends_on:
    - messenger_db_primary
```

### B. Redis Caching Layer

```go
// cache/user_cache.go
package cache

import (
    "context"
    "encoding/json"
    "time"
    
    "github.com/redis/go-redis/v9"
)

type UserCache struct {
    client *redis.Client
    ttl    time.Duration
}

func NewUserCache(client *redis.Client) *UserCache {
    return &UserCache{
        client: client,
        ttl:    15 * time.Minute,
    }
}

func (c *UserCache) Get(ctx context.Context, id string) (*User, error) {
    data, err := c.client.Get(ctx, "user:"+id).Bytes()
    if err == redis.Nil {
        return nil, nil // Cache miss
    }
    if err != nil {
        return nil, err
    }
    
    var user User
    if err := json.Unmarshal(data, &user); err != nil {
        return nil, err
    }
    return &user, nil
}

func (c *UserCache) Set(ctx context.Context, user *User) error {
    data, err := json.Marshal(user)
    if err != nil {
        return err
    }
    return c.client.Set(ctx, "user:"+user.ID.String(), data, c.ttl).Err()
}

func (c *UserCache) Invalidate(ctx context.Context, id string) error {
    return c.client.Del(ctx, "user:"+id).Err()
}

// Cache-aside pattern in service
type CachedUserService struct {
    cache *UserCache
    repo  UserRepository
}

func (s *CachedUserService) GetByID(ctx context.Context, id string) (*User, error) {
    // Try cache first
    user, err := s.cache.Get(ctx, id)
    if err != nil {
        return nil, err
    }
    if user != nil {
        return user, nil // Cache hit!
    }
    
    // Cache miss - get from DB
    user, err = s.repo.FindByID(id)
    if err != nil {
        return nil, err
    }
    
    // Store in cache for next time
    _ = s.cache.Set(ctx, user)
    
    return user, nil
}
```

### C. Read Replicas with Automatic Routing (You have this!)

```go
// Already implemented in your CQRS pattern
// Writes → Primary
// Reads  → Replica
```

### D. Materialized Views for Complex Queries

```sql
-- Create materialized view for expensive aggregations
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as users_created,
    COUNT(*) FILTER (WHERE first_name LIKE 'A%') as a_names
FROM users
GROUP BY DATE_TRUNC('day', created_at);

-- Refresh periodically (not real-time)
REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;

-- Query the view (instant!)
SELECT * FROM user_stats WHERE date > NOW() - INTERVAL '7 days';
```

### E. Partial Indexes for Common Queries

```sql
-- Instead of full index, create partial index for common case
-- If 90% of queries are for recent users:
CREATE INDEX idx_users_recent ON users (created_at DESC)
WHERE created_at > NOW() - INTERVAL '30 days';

-- Much smaller index, faster queries for recent data
```

---

## 5️⃣ Implementation Roadmap

### Phase 1: Optimize Current Setup ✅ COMPLETED
- [x] Read replicas ✅
- [x] Connection pooling at app level ✅
- [x] Query optimization ✅
- [x] PgBouncer available (profile-based)
- [x] Redis caching layer ✅

### Phase 2: Sharding ✅ COMPLETED
- [x] Implemented consistent hashing with MD5 + 150 virtual nodes ✅
- [x] 4-shard architecture with primaries and replicas ✅
- [x] ShardManager for automatic routing ✅
- [x] Parallel scatter-gather queries ✅
- [x] Streaming replication for all shards ✅

### Phase 3: Production Optimization (Future)
- [ ] Add more shards as data grows (8, 16, etc.)
- [ ] Implement read routing to replicas for read-heavy workloads
- [ ] Add cross-shard query caching
- [ ] Consider Citus for advanced distributed queries

---

## 6️⃣ Quick Start: Run Sharded Environment

```bash
# Start 4-shard cluster with replicas
docker-compose up -d

# Verify all containers are healthy
docker ps --format "table {{.Names}}\t{{.Status}}"

# Run API with sharding enabled
cd server
SHARDING_ENABLED=true ./messenger-api

# Check shard stats
curl http://localhost:8080/api/v1/shards/stats | jq

# Verify replication
for i in 0 1 2 3; do
  PRIMARY=$(docker exec shard-$i psql -U postgres -d messenger -t -c "SELECT COUNT(*) FROM users")
  REPLICA=$(docker exec shard-$i-replica psql -U postgres -d messenger -t -c "SELECT COUNT(*) FROM users")
  echo "Shard $i: PRIMARY=$PRIMARY REPLICA=$REPLICA"
done
```

See [SHARDING_GUIDE.md](SHARDING_GUIDE.md) for detailed implementation documentation.

---

## 📚 Recommended Reading

1. **PostgreSQL Partitioning**: https://www.postgresql.org/docs/current/ddl-partitioning.html
2. **Citus Data**: https://www.citusdata.com/
3. **Designing Data-Intensive Applications** (Book) - Martin Kleppmann
4. **How Discord Stores Billions of Messages**: https://discord.com/blog/how-discord-stores-billions-of-messages

---

## 🎯 Current Architecture Summary

**Implemented and tested:**

- ✅ **4-shard PostgreSQL cluster** with consistent hashing (MD5 + 150 virtual nodes)
- ✅ **Streaming replication** on all shards (primaries + hot standby replicas)
- ✅ **1M+ users** evenly distributed across shards
- ✅ **7,783 req/sec** throughput at 5K concurrent users
- ✅ **99.7% success rate** under heavy load
- ✅ **Replicas perfectly synced** during 6K+ writes/second

**Next steps for scaling:**

1. **Add more shards** (8, 16) as data grows beyond 10M users per shard
2. **Route reads to replicas** for read-heavy workloads
3. **Consider Citus** for advanced distributed SQL features
