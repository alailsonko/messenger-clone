package shard

import (
	"fmt"
	"testing"

	"github.com/google/uuid"
)

// TestConsistentHashDistribution verifies that keys are evenly distributed
func TestConsistentHashDistribution(t *testing.T) {
	ch := NewConsistentHash()

	numShards := 4
	virtualNodes := 150

	// Add shards with virtual nodes
	for shardID := 0; shardID < numShards; shardID++ {
		for i := 0; i < virtualNodes; i++ {
			ch.Add(fmt.Sprintf("shard-%d-vnode-%d", shardID, i), shardID)
		}
	}

	// Generate test keys (simulate user IDs)
	numKeys := 100000
	distribution := make(map[int]int)

	for i := 0; i < numKeys; i++ {
		key := uuid.New().String()
		shardID := ch.GetShardID(key)
		distribution[shardID]++
	}

	// Check distribution
	expectedPerShard := float64(numKeys) / float64(numShards)
	tolerance := 0.10 // 10% tolerance

	t.Logf("Distribution Test Results:")
	t.Logf("Total keys: %d", numKeys)
	t.Logf("Expected per shard: %.0f", expectedPerShard)

	for shardID := 0; shardID < numShards; shardID++ {
		count := distribution[shardID]
		pct := float64(count) * 100 / float64(numKeys)
		deviation := float64(count)/expectedPerShard - 1.0

		t.Logf("Shard %d: %d keys (%.2f%%), deviation: %+.2f%%",
			shardID, count, pct, deviation*100)

		if deviation > tolerance || deviation < -tolerance {
			t.Errorf("Shard %d has uneven distribution: %d keys (deviation: %.2f%%)",
				shardID, count, deviation*100)
		}
	}
}

// TestConsistentHashConsistency verifies that the same key always goes to the same shard
func TestConsistentHashConsistency(t *testing.T) {
	ch := NewConsistentHash()

	// Add 4 shards
	for shardID := 0; shardID < 4; shardID++ {
		for i := 0; i < 150; i++ {
			ch.Add(fmt.Sprintf("shard-%d-vnode-%d", shardID, i), shardID)
		}
	}

	// Test that same key always returns same shard
	testKeys := []string{
		"user-abc123",
		"user-def456",
		"user-ghi789",
		uuid.New().String(),
		uuid.New().String(),
	}

	for _, key := range testKeys {
		first := ch.GetShardID(key)
		for i := 0; i < 100; i++ {
			if got := ch.GetShardID(key); got != first {
				t.Errorf("Key %s: got shard %d on iteration %d, expected %d",
					key, got, i, first)
			}
		}
	}
}

// TestAddShardMinimizesMovement tests that adding a shard only moves ~25% of keys
func TestAddShardMinimizesMovement(t *testing.T) {
	// Create initial ring with 3 shards
	ch1 := NewConsistentHash()
	for shardID := 0; shardID < 3; shardID++ {
		for i := 0; i < 150; i++ {
			ch1.Add(fmt.Sprintf("shard-%d-vnode-%d", shardID, i), shardID)
		}
	}

	// Create ring with 4 shards
	ch2 := NewConsistentHash()
	for shardID := 0; shardID < 4; shardID++ {
		for i := 0; i < 150; i++ {
			ch2.Add(fmt.Sprintf("shard-%d-vnode-%d", shardID, i), shardID)
		}
	}

	// Test how many keys move
	numKeys := 100000
	movedCount := 0

	for i := 0; i < numKeys; i++ {
		key := uuid.New().String()
		shard1 := ch1.GetShardID(key)
		shard2 := ch2.GetShardID(key)

		if shard1 != shard2 {
			movedCount++
		}
	}

	movedPct := float64(movedCount) * 100 / float64(numKeys)
	expectedMoved := 100.0 / 4.0 // ~25% when adding 4th shard

	t.Logf("Shard Addition Test:")
	t.Logf("Keys moved: %d (%.2f%%)", movedCount, movedPct)
	t.Logf("Expected:   ~%.0f%%", expectedMoved)

	// Should move approximately 25% (+/- 5%)
	if movedPct < expectedMoved-5 || movedPct > expectedMoved+5 {
		t.Errorf("Expected ~%.0f%% keys to move, got %.2f%%", expectedMoved, movedPct)
	}
}

// BenchmarkConsistentHashLookup benchmarks the lookup performance
func BenchmarkConsistentHashLookup(b *testing.B) {
	ch := NewConsistentHash()

	// Setup: 8 shards with 150 virtual nodes each
	for shardID := 0; shardID < 8; shardID++ {
		for i := 0; i < 150; i++ {
			ch.Add(fmt.Sprintf("shard-%d-vnode-%d", shardID, i), shardID)
		}
	}

	// Pre-generate keys
	keys := make([]string, 10000)
	for i := range keys {
		keys[i] = uuid.New().String()
	}

	b.ResetTimer()
	b.ReportAllocs()

	for i := 0; i < b.N; i++ {
		_ = ch.GetShardID(keys[i%len(keys)])
	}
}
