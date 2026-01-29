#!/bin/bash

# =============================================================================
# PostgreSQL Performance Tuning Script for High-Concurrency Sharding
# =============================================================================
#
# This script applies PostgreSQL tuning parameters to all shards for handling
# 20,000+ concurrent connections with PgBouncer.
#
# Usage:
#   ./scripts/tune-postgres.sh
#
# =============================================================================

set -e

echo "🔧 Applying PostgreSQL performance tuning to all shards..."

# Performance tuning parameters optimized for:
# - 4 shards with PgBouncer
# - 20,000+ concurrent users
# - Transaction pooling mode
# - SSD storage

TUNING_PARAMS="
-- Connection Settings (PgBouncer handles app connections, PostgreSQL only sees pooled connections)
ALTER SYSTEM SET max_connections = 500;
ALTER SYSTEM SET superuser_reserved_connections = 5;

-- Memory Settings (adjust based on available RAM, assuming 4GB per shard)
ALTER SYSTEM SET shared_buffers = '1GB';
ALTER SYSTEM SET effective_cache_size = '3GB';
ALTER SYSTEM SET work_mem = '32MB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';

-- WAL Settings (optimized for write-heavy workloads)
ALTER SYSTEM SET wal_buffers = '64MB';
ALTER SYSTEM SET max_wal_size = '2GB';
ALTER SYSTEM SET min_wal_size = '512MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET checkpoint_timeout = '10min';

-- Parallel Query Settings
ALTER SYSTEM SET max_parallel_workers_per_gather = 2;
ALTER SYSTEM SET max_parallel_workers = 4;
ALTER SYSTEM SET max_parallel_maintenance_workers = 2;

-- Background Writer (reduces checkpoint spikes)
ALTER SYSTEM SET bgwriter_delay = '20ms';
ALTER SYSTEM SET bgwriter_lru_maxpages = 200;
ALTER SYSTEM SET bgwriter_lru_multiplier = 2.0;

-- Planner Settings
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET default_statistics_target = 100;

-- Logging (reduce overhead in production)
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_lock_waits = on;

-- Vacuum Settings
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.05;
ALTER SYSTEM SET autovacuum_analyze_scale_factor = 0.025;
ALTER SYSTEM SET autovacuum_max_workers = 3;
ALTER SYSTEM SET autovacuum_naptime = '30s';
"

# Apply tuning to all shards
for i in {0..3}; do
    PORT=$((5440 + i))
    echo ""
    echo "📊 Tuning shard-$i (port $PORT)..."
    
    # Apply settings
    echo "$TUNING_PARAMS" | psql -h localhost -p $PORT -U postgres -d messenger
    
    # Reload configuration
    psql -h localhost -p $PORT -U postgres -d messenger -c "SELECT pg_reload_conf();"
    
    echo "✅ Shard-$i tuned successfully"
done

echo ""
echo "=============================================="
echo "✅ PostgreSQL tuning applied to all shards!"
echo "=============================================="
echo ""
echo "Note: Some settings (like max_connections, shared_buffers) require a restart."
echo "To restart shards: docker-compose restart shard-0 shard-1 shard-2 shard-3"
echo ""
echo "Current settings can be verified with:"
echo "  psql -h localhost -p 5440 -U postgres -d messenger -c \"SHOW ALL;\""
