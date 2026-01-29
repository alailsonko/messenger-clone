#!/bin/bash
# =============================================================================
# CreateUser Load Test Script
# =============================================================================
# This script runs a load test focused exclusively on the CreateUser endpoint.
#
# Usage:
#   ./scripts/loadtest-create-user.sh [USERS] [DURATION]
#
# Arguments:
#   USERS    - Number of concurrent users (default: 5000)
#   DURATION - Test duration in seconds (default: 120)
#
# Examples:
#   ./scripts/loadtest-create-user.sh           # 5000 users, 120s
#   ./scripts/loadtest-create-user.sh 1000      # 1000 users, 120s
#   ./scripts/loadtest-create-user.sh 10000 300 # 10000 users, 300s
# =============================================================================

set -e

# Default values
USERS=${1:-5000}
DURATION=${2:-120}

echo "========================================"
echo "  CreateUser Load Test"
echo "========================================"
echo "  Concurrent Users: ${USERS}"
echo "  Duration:         ${DURATION}s"
echo "========================================"

cd "$(dirname "$0")/.."

# Export environment variables
export LOADTEST_SIMULATION=messenger.CreateUserSimulation
export LOADTEST_USERS=${USERS}
export LOADTEST_DURATION=${DURATION}
export LOADTEST_RAMP=30

# Run the load test
docker compose -f docker.compose.yml --profile loadtest run --rm loadtest
