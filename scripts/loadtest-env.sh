# =============================================================================
# High-Performance Load Test Environment Configuration
# =============================================================================
#
# These settings optimize the application for handling 20,000+ concurrent users
# with PgBouncer connection pooling.
#
# Usage:
#   source scripts/loadtest-env.sh && go run cmd/api/main.go
#   OR
#   env $(cat scripts/loadtest-env.sh | grep -v '#' | xargs) go run cmd/api/main.go
#
# =============================================================================

# Server Configuration
PORT=8080
ENABLE_PREFORK=true

# Sharding Configuration (connect through PgBouncer)
SHARDING_ENABLED=true
SHARDING_COUNT=4
SHARDING_VIRTUAL_NODES=150

# Use PgBouncer ports (6430-6433) instead of direct PostgreSQL (5440-5443)
# PgBouncer provides connection pooling: 10000 app connections → 100 DB connections
SHARDING_BASE_HOST=localhost
SHARDING_BASE_PORT=6430
SHARDING_REPLICA_BASE_PORT=5450

# Connection Pool Settings (optimized for PgBouncer transaction mode)
# With PgBouncer, we can use higher MaxOpenConns since PgBouncer multiplexes
DB_WRITE_MAX_OPEN_CONNS=200
DB_WRITE_MAX_IDLE_CONNS=100
DB_WRITE_CONN_MAX_LIFETIME=10

# Database credentials (same as always)
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=messenger

# Redis Cache Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_CACHE_TTL=300

# Performance Tuning
GOMAXPROCS=8
