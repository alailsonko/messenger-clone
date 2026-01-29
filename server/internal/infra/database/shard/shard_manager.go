// Package shard implements database sharding with consistent hashing.
//
// This package provides a complete sharding solution that distributes data
// across multiple PostgreSQL instances. It uses consistent hashing to minimize
// data movement when adding or removing shards.
package shard

import (
	"context"
	"crypto/md5"
	"database/sql"
	"encoding/binary"
	"fmt"
	"hash/fnv"
	"sort"
	"sync"
	"time"

	"github.com/alailsonko/messenger-clone/server/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// ShardConfig holds configuration for a single shard
type ShardConfig struct {
	ID              int
	Name            string
	WriteHost       string
	WritePort       int
	WriteUser       string
	WritePassword   string
	WriteDatabase   string
	ReadHost        string
	ReadPort        int
	ReadUser        string
	ReadPassword    string
	ReadDatabase    string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
}

// Shard represents a single database shard with primary/replica connections
type Shard struct {
	ID       int
	Name     string
	WriteDB  *gorm.DB
	ReadDB   *gorm.DB
	IsActive bool
	Config   ShardConfig
}

// ShardManager manages multiple database shards
type ShardManager struct {
	shards       map[int]*Shard
	shardList    []*Shard
	hashRing     *ConsistentHash
	virtualNodes int
	mu           sync.RWMutex
	logger       logger.Interface
}

// ConsistentHash implements a consistent hashing ring
type ConsistentHash struct {
	ring         map[uint32]int
	sortedHashes []uint32
	mu           sync.RWMutex
}

// NewConsistentHash creates a new consistent hash ring
func NewConsistentHash() *ConsistentHash {
	return &ConsistentHash{
		ring:         make(map[uint32]int),
		sortedHashes: make([]uint32, 0),
	}
}

// Add adds a virtual node to the hash ring
// Uses MD5 for better distribution of virtual nodes
func (ch *ConsistentHash) Add(key string, shardID int) {
	ch.mu.Lock()
	defer ch.mu.Unlock()
	hash := ch.hashMD5(key)
	ch.ring[hash] = shardID
	ch.sortedHashes = append(ch.sortedHashes, hash)
	sort.Slice(ch.sortedHashes, func(i, j int) bool {
		return ch.sortedHashes[i] < ch.sortedHashes[j]
	})
}

// GetShardID returns the shard ID for the given key
// Uses FNV-1a for fast key lookups
func (ch *ConsistentHash) GetShardID(key string) int {
	ch.mu.RLock()
	defer ch.mu.RUnlock()

	if len(ch.sortedHashes) == 0 {
		return 0
	}

	hash := ch.hashMD5(key)
	// Binary search for the first hash >= our key's hash
	idx := sort.Search(len(ch.sortedHashes), func(i int) bool {
		return ch.sortedHashes[i] >= hash
	})

	// If we went past the end, wrap around to the first node
	if idx >= len(ch.sortedHashes) {
		idx = 0
	}

	return ch.ring[ch.sortedHashes[idx]]
}

// hash computes a 32-bit hash of the key using FNV-1a
func (ch *ConsistentHash) hash(key string) uint32 {
	h := fnv.New32a()
	h.Write([]byte(key))
	return h.Sum32()
}

// hashMD5 is an alternative hash using MD5 for better distribution
func (ch *ConsistentHash) hashMD5(key string) uint32 {
	digest := md5.Sum([]byte(key))
	return binary.BigEndian.Uint32(digest[:4])
}

// NewShardManager creates a new shard manager with the given configurations
func NewShardManager(configs []ShardConfig, virtualNodes int, log logger.Interface) (*ShardManager, error) {
	if virtualNodes <= 0 {
		virtualNodes = 150 // Default
	}

	manager := &ShardManager{
		shards:       make(map[int]*Shard),
		shardList:    make([]*Shard, 0, len(configs)),
		hashRing:     NewConsistentHash(),
		virtualNodes: virtualNodes,
		logger:       log,
	}

	// Initialize each shard concurrently for faster startup
	type shardResult struct {
		shard *Shard
		cfg   ShardConfig
		err   error
	}

	results := make(chan shardResult, len(configs))
	var wg sync.WaitGroup

	for _, cfg := range configs {
		wg.Add(1)
		go func(c ShardConfig) {
			defer wg.Done()
			shard, err := manager.createShard(c)
			results <- shardResult{shard: shard, cfg: c, err: err}
		}(cfg)
	}

	// Wait for all shards to initialize
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	for result := range results {
		if result.err != nil {
			// Close any already-connected shards
			manager.Close()
			return nil, fmt.Errorf("failed to create shard %d (%s): %w", result.cfg.ID, result.cfg.Name, result.err)
		}
		manager.shards[result.cfg.ID] = result.shard
		manager.shardList = append(manager.shardList, result.shard)

		// Add virtual nodes to hash ring
		for i := 0; i < virtualNodes; i++ {
			virtualNodeKey := fmt.Sprintf("%s-vn%d", result.cfg.Name, i)
			manager.hashRing.Add(virtualNodeKey, result.cfg.ID)
		}
	}

	return manager, nil
}

// warmupPool pre-establishes database connections to reduce latency on first requests
func (sm *ShardManager) warmupPool(db *sql.DB, count int) {
	if count <= 0 {
		count = 10
	}

	ctx := context.Background()
	var wg sync.WaitGroup
	for i := 0; i < count; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			conn, err := db.Conn(ctx)
			if err == nil {
				// Execute a simple query to ensure the connection is truly established
				conn.PingContext(ctx)
				conn.Close() // Return to pool
			}
		}()
	}
	wg.Wait()
}

// createShard creates a single shard with its database connections
func (sm *ShardManager) createShard(cfg ShardConfig) (*Shard, error) {
	// Create write (primary) connection
	// Optimized DSN for high throughput with PgBouncer transaction pooling
	// default_query_exec_mode=simple_protocol disables pgx statement caching for PgBouncer compatibility
	writeDSN := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable connect_timeout=5 default_query_exec_mode=simple_protocol",
		cfg.WriteHost, cfg.WritePort, cfg.WriteUser, cfg.WritePassword, cfg.WriteDatabase,
	)

	writeDB, err := gorm.Open(postgres.Open(writeDSN), &gorm.Config{
		Logger:                 sm.logger,
		SkipDefaultTransaction: true,  // Skip transaction wrapper for single queries (2-3x faster)
		PrepareStmt:            false, // Disabled for PgBouncer transaction pooling mode
		QueryFields:            false, // Don't wrap SELECT * - use explicit column selection
		CreateBatchSize:        1000,  // Batch inserts for better throughput
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to write database: %w", err)
	}

	// Configure write connection pool
	writeSQLDB, err := writeDB.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying write DB: %w", err)
	}

	maxOpen := cfg.MaxOpenConns
	if maxOpen <= 0 {
		maxOpen = 50
	}
	maxIdle := cfg.MaxIdleConns
	if maxIdle <= 0 {
		maxIdle = 25
	}
	maxLifetime := cfg.ConnMaxLifetime
	if maxLifetime <= 0 {
		maxLifetime = 10 * time.Minute
	}

	writeSQLDB.SetMaxOpenConns(maxOpen)
	writeSQLDB.SetMaxIdleConns(maxIdle)
	writeSQLDB.SetConnMaxLifetime(maxLifetime)
	writeSQLDB.SetConnMaxIdleTime(5 * time.Minute) // Close idle connections after 5 min

	// Warm up the connection pool with a small number of connections
	// to reduce latency on first requests without exhausting connection limits
	sm.warmupPool(writeSQLDB, 5)

	// Create read (replica) connection
	var readDB *gorm.DB
	if cfg.ReadHost != "" {
		// Read replicas connect directly to PostgreSQL (not through PgBouncer) but use simple protocol for consistency
		readDSN := fmt.Sprintf(
			"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable connect_timeout=5 default_query_exec_mode=simple_protocol",
			cfg.ReadHost, cfg.ReadPort, cfg.ReadUser, cfg.ReadPassword, cfg.ReadDatabase,
		)

		readDB, err = gorm.Open(postgres.Open(readDSN), &gorm.Config{
			Logger:                 sm.logger,
			SkipDefaultTransaction: true,  // No transactions needed for reads
			PrepareStmt:            false, // Disabled for PgBouncer transaction pooling mode
			QueryFields:            false, // Use explicit column selection
		})
		if err != nil {
			// Close write connection before returning error
			writeSQLDB.Close()
			return nil, fmt.Errorf("failed to connect to read database: %w", err)
		}

		// Configure read connection pool
		readSQLDB, err := readDB.DB()
		if err != nil {
			writeSQLDB.Close()
			return nil, fmt.Errorf("failed to get underlying read DB: %w", err)
		}

		readSQLDB.SetMaxOpenConns(maxOpen)
		readSQLDB.SetMaxIdleConns(maxIdle)
		readSQLDB.SetConnMaxLifetime(maxLifetime)
		readSQLDB.SetConnMaxIdleTime(5 * time.Minute)

		// Warm up read connection pool with small number of connections
		sm.warmupPool(readSQLDB, 5)
	} else {
		// No replica configured, use write DB for reads
		readDB = writeDB
	}

	return &Shard{
		ID:       cfg.ID,
		Name:     cfg.Name,
		WriteDB:  writeDB,
		ReadDB:   readDB,
		IsActive: true,
		Config:   cfg,
	}, nil
}

// GetShardForKey returns the shard that should handle the given key
func (sm *ShardManager) GetShardForKey(key string) *Shard {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	shardID := sm.hashRing.GetShardID(key)
	return sm.shards[shardID]
}

// GetShard returns a specific shard by ID
func (sm *ShardManager) GetShard(id int) *Shard {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	return sm.shards[id]
}

// GetAllShards returns all active shards
func (sm *ShardManager) GetAllShards() []*Shard {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	active := make([]*Shard, 0, len(sm.shardList))
	for _, s := range sm.shardList {
		if s.IsActive {
			active = append(active, s)
		}
	}
	return active
}

// ShardCount returns the number of shards
func (sm *ShardManager) ShardCount() int {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	return len(sm.shardList)
}

// Ping verifies all shards are accessible
func (sm *ShardManager) Ping() error {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	for _, shard := range sm.shardList {
		if !shard.IsActive {
			continue
		}
		// Ping write DB
		writeSQL, err := shard.WriteDB.DB()
		if err != nil {
			return fmt.Errorf("shard %d: failed to get write DB: %w", shard.ID, err)
		}
		if err := writeSQL.Ping(); err != nil {
			return fmt.Errorf("shard %d: write DB ping failed: %w", shard.ID, err)
		}

		// Ping read DB (if different from write)
		if shard.ReadDB != shard.WriteDB {
			readSQL, err := shard.ReadDB.DB()
			if err != nil {
				return fmt.Errorf("shard %d: failed to get read DB: %w", shard.ID, err)
			}
			if err := readSQL.Ping(); err != nil {
				return fmt.Errorf("shard %d: read DB ping failed: %w", shard.ID, err)
			}
		}
	}
	return nil
}

// Close closes all shard connections
func (sm *ShardManager) Close() error {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	var lastErr error
	for _, shard := range sm.shardList {
		// Close write DB
		if writeSQL, err := shard.WriteDB.DB(); err == nil {
			if err := writeSQL.Close(); err != nil {
				lastErr = err
			}
		}
		// Close read DB (if different from write)
		if shard.ReadDB != shard.WriteDB {
			if readSQL, err := shard.ReadDB.DB(); err == nil {
				if err := readSQL.Close(); err != nil {
					lastErr = err
				}
			}
		}
		shard.IsActive = false
	}
	return lastErr
}

// ShardConfigFromEnv creates shard configs from environment-style configuration
func ShardConfigFromEnv(cfg config.Config, shardCount int) []ShardConfig {
	configs := make([]ShardConfig, shardCount)
	for i := 0; i < shardCount; i++ {
		configs[i] = ShardConfig{
			ID:            i,
			Name:          fmt.Sprintf("shard_%d", i),
			WriteHost:     fmt.Sprintf("messenger_shard_%d_primary", i),
			WritePort:     5432,
			WriteUser:     cfg.WriteDB.User,
			WritePassword: cfg.WriteDB.Password,
			WriteDatabase: cfg.WriteDB.Database,
			ReadHost:      fmt.Sprintf("messenger_shard_%d_replica", i),
			ReadPort:      5432,
			ReadUser:      cfg.ReadDB.User,
			ReadPassword:  cfg.ReadDB.Password,
			ReadDatabase:  cfg.ReadDB.Database,
		}
	}
	return configs
}
