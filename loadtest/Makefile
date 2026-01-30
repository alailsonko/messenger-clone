# =============================================================================
# Load Test Makefile - Gatling Load Testing
# =============================================================================
#
# This Makefile is for running Gatling load tests via Docker Compose.
# For standalone Go-based load testing, use the commands below.
#
# Preferred: Use the main Makefile commands from the project root:
#   make loadtest          - Standard load test
#   make loadtest-10k      - 10K concurrent users
#   make loadtest-crud     - Full CRUD operations
#   make loadtest-help     - Show all options
#
# =============================================================================

.PHONY: help smoke load stress crud clean

# Default target
help:
	@echo "Load Test Commands (run from project root recommended):"
	@echo ""
	@echo "  make smoke    - Quick smoke test (10 users)"
	@echo "  make load     - Standard load test (100 users)"
	@echo "  make stress   - Stress test (500 users)"
	@echo "  make crud     - CRUD operations test"
	@echo "  make clean    - Clean results"
	@echo ""
	@echo "Or use Docker Compose from project root:"
	@echo "  cd .. && make loadtest-help"

# Quick smoke test
smoke:
	@echo "Running smoke test..."
	cd .. && LOADTEST_TYPE=smoke LOADTEST_USERS=10 LOADTEST_DURATION=30 \
		docker compose run --rm loadtest

# Standard load test
load:
	@echo "Running load test (100 users)..."
	cd .. && LOADTEST_TYPE=load LOADTEST_USERS=100 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest

# Stress test
stress:
	@echo "Running stress test (500 users)..."
	cd .. && LOADTEST_TYPE=stress LOADTEST_USERS=500 LOADTEST_DURATION=120 \
		docker compose run --rm loadtest

# CRUD test
crud:
	@echo "Running CRUD test..."
	cd .. && LOADTEST_SIMULATION=messenger.UserSimulation LOADTEST_TYPE=load \
		LOADTEST_USERS=1000 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest

# Clean results
clean:
	@echo "Cleaning load test results..."
	rm -rf gatling/results/*
