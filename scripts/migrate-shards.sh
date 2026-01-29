#!/bin/bash
# =============================================================================
# Shard Migration Script
# =============================================================================
# 
# This script runs database migrations on all shards in the sharded cluster.
#
# Usage:
#   ./scripts/migrate-shards.sh [up|down]
#
# Prerequisites:
#   - All shard databases must be running
#   - Migration tool must be built: cd server && make migration-tool
#
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DIRECTION="${1:-up}"
MIGRATION_TOOL="./server/migration-tool"

# Shard configuration
# Format: "name:host:port"
SHARDS=(
    "shard-0:localhost:5440"
    "shard-1:localhost:5442"
    "shard-2:localhost:5444"
    "shard-3:localhost:5446"
)

# Database credentials (same for all shards in dev)
DB_USER="postgres"
DB_PASS="postgres"
DB_NAME="messenger"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║                    SHARD MIGRATION RUNNER                             ║"
echo "╠═══════════════════════════════════════════════════════════════════════╣"
echo "║  Direction: ${DIRECTION}                                                         ║"
echo "║  Shards:    ${#SHARDS[@]}                                                          ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if migration tool exists
if [ ! -f "$MIGRATION_TOOL" ]; then
    echo -e "${YELLOW}Building migration tool...${NC}"
    cd server && make migration-tool && cd ..
fi

# Function to run migration on a shard
run_migration() {
    local shard_name=$1
    local host=$2
    local port=$3
    
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Migrating ${shard_name} (${host}:${port})...${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Build connection string
    DSN="postgres://${DB_USER}:${DB_PASS}@${host}:${port}/${DB_NAME}?sslmode=disable"
    
    # Check if database is accessible
    if ! pg_isready -h "$host" -p "$port" -U "$DB_USER" > /dev/null 2>&1; then
        echo -e "${RED}✗ Cannot connect to ${shard_name}${NC}"
        return 1
    fi
    
    # Run migration
    # Note: You'll need to modify the migration tool to accept DSN as argument
    # For now, we'll use environment variables
    DB_HOST="$host" \
    DB_PORT="$port" \
    DB_USER="$DB_USER" \
    DB_PASSWORD="$DB_PASS" \
    DB_NAME="$DB_NAME" \
    $MIGRATION_TOOL "$DIRECTION"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ ${shard_name} migration complete${NC}"
    else
        echo -e "${RED}✗ ${shard_name} migration failed${NC}"
        return 1
    fi
}

# Track results
SUCCESS=0
FAILED=0

# Run migrations in parallel (with process limit)
echo ""
echo -e "${BLUE}Starting migrations...${NC}"
echo ""

for shard in "${SHARDS[@]}"; do
    IFS=':' read -r name host port <<< "$shard"
    
    if run_migration "$name" "$host" "$port"; then
        ((SUCCESS++))
    else
        ((FAILED++))
    fi
    
    echo ""
done

# Summary
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║                         MIGRATION SUMMARY                             ║"
echo "╠═══════════════════════════════════════════════════════════════════════╣"
echo -e "║  ${GREEN}Successful: ${SUCCESS}${BLUE}                                                        ║"
echo -e "║  ${RED}Failed:     ${FAILED}${BLUE}                                                        ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Some migrations failed! Check the logs above.${NC}"
    exit 1
fi

echo -e "${GREEN}All migrations completed successfully!${NC}"
