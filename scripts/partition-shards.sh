#!/bin/bash
# =============================================================================
# Partition Users Table on All Shards
# =============================================================================
#
# This script converts the users table to a hash-partitioned table with 8
# partitions on each shard. Hash partitioning by UUID provides even distribution.
#
# Benefits:
#   - Parallel query execution within each shard
#   - Smaller indexes per partition
#   - Faster VACUUM and maintenance
#   - Better query performance at scale
#
# Usage:
#   ./scripts/partition-shards.sh
#
# WARNING: This will DROP existing users data! Back up first if needed.
#
# =============================================================================

set -e

echo "=============================================="
echo "  Partitioning Users Table on All Shards"
echo "=============================================="
echo ""

# Number of shards
SHARD_COUNT=${SHARD_COUNT:-4}

for i in $(seq 0 $((SHARD_COUNT - 1))); do
    SHARD="shard-$i"
    echo "=== Processing $SHARD ==="
    
    # Check if already partitioned
    IS_PARTITIONED=$(docker exec $SHARD psql -U postgres -d messenger -t -c \
        "SELECT COUNT(*) FROM pg_inherits WHERE inhparent = 'users'::regclass;" 2>/dev/null | tr -d ' ')
    
    if [ "$IS_PARTITIONED" = "8" ]; then
        echo "  ✓ Already partitioned with 8 partitions, skipping"
        continue
    fi
    
    echo "  Dropping existing table..."
    docker exec $SHARD psql -U postgres -d messenger -c "DROP TABLE IF EXISTS users CASCADE;"
    
    echo "  Creating partitioned table..."
    docker exec $SHARD psql -U postgres -d messenger -c "CREATE TABLE users (id UUID NOT NULL DEFAULT gen_random_uuid(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(), first_name VARCHAR(255), last_name VARCHAR(255), PRIMARY KEY (id)) PARTITION BY HASH (id);"
    
    echo "  Creating 8 partitions..."
    for p in 0 1 2 3 4 5 6 7; do
        docker exec $SHARD psql -U postgres -d messenger -c "CREATE TABLE users_p$p PARTITION OF users FOR VALUES WITH (MODULUS 8, REMAINDER $p);" > /dev/null
    done
    
    echo "  Creating indexes..."
    docker exec $SHARD psql -U postgres -d messenger -c "CREATE INDEX idx_users_name ON users (first_name, last_name); CREATE INDEX idx_users_created_at ON users (created_at DESC);" > /dev/null
    
    echo "  ✓ Done"
    echo ""
done

echo "=============================================="
echo "  Verification"
echo "=============================================="

for i in $(seq 0 $((SHARD_COUNT - 1))); do
    SHARD="shard-$i"
    PART_COUNT=$(docker exec $SHARD psql -U postgres -d messenger -t -c \
        "SELECT COUNT(*) FROM pg_inherits WHERE inhparent = 'users'::regclass;" | tr -d ' ')
    echo "$SHARD: $PART_COUNT partitions ✓"
done

echo ""
echo "=============================================="
echo "  All shards are now partitioned!"
echo "=============================================="
