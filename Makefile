# =============================================================================
# Messenger Clone - Main Makefile
# =============================================================================
# 
# 5-shard PostgreSQL cluster with streaming replication and PgBouncer pooling.
# Supports both development (hot reload) and production (prefork) modes.
#
# Quick Start:
#   make up          - Start infrastructure (shards, replicas, pgbouncers)
#   make dev         - Start API server with hot reload
#   make prod        - Start API server in production mode (prefork)
#   make loadtest    - Run standard load test
#
# =============================================================================

include server/Makefile

# =============================================================================
# Docker Compose Commands
# =============================================================================

.PHONY: up down restart logs ps stats

# Start infrastructure only (shards, replicas, pgbouncers, redis)
up:
	@echo "🚀 Starting infrastructure (5 shards + replicas + pgbouncers)..."
	docker compose up -d
	@echo "✅ Infrastructure ready!"
	@echo "   - Shards: 5440-5444 (primaries), 5450-5454 (replicas)"
	@echo "   - PgBouncers: 6430-6434"
	@echo "   - Redis: 6379"

# Start everything (infrastructure + API server with prefork)
dev:
	@echo "🚀 Starting Messenger Clone (infrastructure + API server)..."
	docker compose --profile api up -d --build
	@echo "✅ All services running!"
	@echo "   - API Server: http://localhost:8080 (prefork with 7 workers)"
	@echo "   - Shards: 5440-5444 (primaries), 5450-5454 (replicas)"
	@echo "   - PgBouncers: 6430-6434"
	@echo "   - Redis: 6379"

# Stop all services
down:
	@echo "🛑 Stopping all services..."
	docker compose --profile api --profile loadtest down

# Stop and remove volumes (clean slate)
down-clean:
	@echo "🧹 Stopping all services and removing volumes..."
	docker compose --profile api --profile loadtest down -v
	docker volume prune -f

# Restart API server
restart:
	@echo "🔄 Restarting API server..."
	docker compose --profile api restart messenger_server

# Rebuild and restart API server
rebuild:
	@echo "🔨 Rebuilding and restarting API server..."
	docker compose --profile api up -d --build messenger_server

# View logs
logs:
	docker compose --profile api logs -f messenger_server

# View all logs
logs-all:
	docker compose --profile api logs -f

# Show running containers
ps:
	docker compose --profile api ps

# Show resource usage
stats:
	docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# =============================================================================
# Database & Shard Commands
# =============================================================================

.PHONY: shards shard-stats db-shell

# Check shard health and stats
shards:
	@echo "📊 Shard Statistics:"
	@curl -s http://localhost:8080/api/v1/shards/stats | jq '{total_users, shard_count: (.shards | length), shards: [.shards[] | {shard_name, user_count}] | sort_by(.shard_name)}'

# Alias for shards
shard-stats: shards

# Connect to a shard (usage: make db-shell SHARD=0)
db-shell:
	@SHARD_NUM=$${SHARD:-0}; \
	echo "🔌 Connecting to shard-$$SHARD_NUM..."; \
	docker exec -it shard-$$SHARD_NUM psql -U postgres -d messenger

# Health check
health:
	@curl -s http://localhost:8080/health | jq

# =============================================================================
# Load Testing with Gatling
# =============================================================================

# Build the Gatling load test image
.PHONY: loadtest-build
loadtest-build:
	@echo "🔨 Building Gatling load test image..."
	docker compose build loadtest

# Run smoke test (10 users, quick validation)
.PHONY: loadtest-smoke
loadtest-smoke:
	@echo "🔥 Running Smoke Test (10 users, 30s)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_TYPE=smoke LOADTEST_USERS=10 LOADTEST_DURATION=30 \
		docker compose run --rm loadtest

# Run standard load test (100 users, 1 min)
.PHONY: loadtest
loadtest:
	@echo "📊 Running Load Test (100 users, 60s)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_TYPE=load LOADTEST_USERS=100 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest

# Run load test with custom users (usage: make loadtest-custom USERS=1000)
.PHONY: loadtest-custom
loadtest-custom:
	@USERS=$${USERS:-500}; DURATION=$${DURATION:-60}; \
	echo "📊 Running Load Test ($$USERS users, $${DURATION}s)..."; \
	mkdir -p loadtest/gatling/results; \
	LOADTEST_TYPE=load LOADTEST_USERS=$$USERS LOADTEST_DURATION=$$DURATION \
		docker compose run --rm loadtest

# Run 10K concurrent users test
.PHONY: loadtest-10k
loadtest-10k:
	@echo "🚀 Running 10K Concurrent Users Test..."
	@mkdir -p loadtest/gatling/results
	@BEFORE=$$(curl -s http://localhost:8080/api/v1/shards/stats | jq '.total_users'); \
	echo "Users before: $$BEFORE"; \
	LOADTEST_TYPE=load LOADTEST_USERS=10000 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest; \
	AFTER=$$(curl -s http://localhost:8080/api/v1/shards/stats | jq '.total_users'); \
	echo "Users after:  $$AFTER"; \
	echo "Users added:  $$((AFTER - BEFORE))"

# Run CRUD test (Create, Read, Update, Delete operations)
.PHONY: loadtest-crud
loadtest-crud:
	@echo "🔄 Running CRUD Load Test (1000 users)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_SIMULATION=messenger.UserSimulation LOADTEST_TYPE=load \
	LOADTEST_USERS=1000 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest

# Run stress test (500 users, high load)
.PHONY: loadtest-stress
loadtest-stress:
	@echo "💪 Running Stress Test (500 users, 120s)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_TYPE=stress LOADTEST_USERS=500 LOADTEST_DURATION=120 \
		docker compose run --rm loadtest

# Run spike test (sudden traffic burst)
.PHONY: loadtest-spike
loadtest-spike:
	@echo "⚡ Running Spike Test (300 users, sudden burst)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_TYPE=spike LOADTEST_USERS=300 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest

# Run soak test (extended duration)
.PHONY: loadtest-soak
loadtest-soak:
	@echo "🏊 Running Soak Test (50 users, 5 min)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_TYPE=soak LOADTEST_USERS=50 LOADTEST_DURATION=300 \
		docker compose run --rm loadtest

# Run pagination test
.PHONY: loadtest-pagination
loadtest-pagination:
	@echo "📄 Running Pagination Test (200 users)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_SIMULATION=messenger.UserSimulation LOADTEST_TYPE=pagination \
	LOADTEST_USERS=200 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest

# Run read-heavy test (80% reads)
.PHONY: loadtest-read
loadtest-read:
	@echo "📖 Running Read-Heavy Test (300 users, 80% reads)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_SIMULATION=messenger.UserSimulation LOADTEST_TYPE=read \
	LOADTEST_USERS=300 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest

# Run write-heavy test
.PHONY: loadtest-write
loadtest-write:
	@echo "✍️  Running Write-Heavy Test (100 users)..."
	@mkdir -p loadtest/gatling/results
	LOADTEST_SIMULATION=messenger.UserSimulation LOADTEST_TYPE=write \
	LOADTEST_USERS=100 LOADTEST_DURATION=60 \
		docker compose run --rm loadtest

# Open the latest Gatling report
.PHONY: loadtest-report
loadtest-report:
	@echo "📈 Opening latest Gatling report..."
	@LATEST=$$(ls -t loadtest/gatling/results 2>/dev/null | head -1); \
	if [ -n "$$LATEST" ]; then \
		open "loadtest/gatling/results/$$LATEST/index.html" 2>/dev/null || \
		xdg-open "loadtest/gatling/results/$$LATEST/index.html" 2>/dev/null || \
		echo "Report: loadtest/gatling/results/$$LATEST/index.html"; \
	else \
		echo "No reports found. Run a load test first."; \
	fi

# Clean load test results
.PHONY: loadtest-clean
loadtest-clean:
	@echo "🧹 Cleaning load test results..."
	rm -rf loadtest/gatling/results/*

# =============================================================================
# Help
# =============================================================================

.PHONY: help loadtest-help

help:
	@echo "╔══════════════════════════════════════════════════════════════════════════╗"
	@echo "║                    Messenger Clone - Available Commands                   ║"
	@echo "╠══════════════════════════════════════════════════════════════════════════╣"
	@echo "║ Infrastructure:                                                           ║"
	@echo "║   make up              Start infrastructure (5 shards + replicas)         ║"
	@echo "║   make down            Stop all services                                  ║"
	@echo "║   make down-clean      Stop all and remove volumes                        ║"
	@echo "║   make ps              Show running containers                            ║"
	@echo "║   make stats           Show resource usage                                ║"
	@echo "║   make logs            View API server logs                               ║"
	@echo "╠══════════════════════════════════════════════════════════════════════════╣"
	@echo "║ API Server:                                                               ║"
	@echo "║   make dev             Start everything (infra + API with prefork)        ║"
	@echo "║   make restart         Restart API server                                 ║"
	@echo "║   make rebuild         Rebuild and restart API server                     ║"
	@echo "╠══════════════════════════════════════════════════════════════════════════╣"
	@echo "║ Database:                                                                 ║"
	@echo "║   make shards          Show shard statistics                              ║"
	@echo "║   make health          Check API health                                   ║"
	@echo "║   make db-shell SHARD=0  Connect to shard shell                           ║"
	@echo "╠══════════════════════════════════════════════════════════════════════════╣"
	@echo "║ Load Testing:                                                             ║"
	@echo "║   make loadtest-help   Show all load test commands                        ║"
	@echo "╚══════════════════════════════════════════════════════════════════════════╝"

loadtest-help:
	@echo "╔══════════════════════════════════════════════════════════════════════════╗"
	@echo "║                       Gatling Load Test Commands                          ║"
	@echo "╠══════════════════════════════════════════════════════════════════════════╣"
	@echo "║ Basic Tests:                                                              ║"
	@echo "║   make loadtest-smoke         Quick validation (10 users, 30s)            ║"
	@echo "║   make loadtest               Standard load test (100 users, 60s)         ║"
	@echo "║   make loadtest-custom USERS=N  Custom user count                         ║"
	@echo "║   make loadtest-10k           10,000 concurrent users test                ║"
	@echo "╠══════════════════════════════════════════════════════════════════════════╣"
	@echo "║ Scenario Tests:                                                           ║"
	@echo "║   make loadtest-crud          Full CRUD operations test                   ║"
	@echo "║   make loadtest-stress        High load test (500 users)                  ║"
	@echo "║   make loadtest-spike         Sudden traffic burst test                   ║"
	@echo "║   make loadtest-soak          Extended duration test (5 min)              ║"
	@echo "║   make loadtest-pagination    Pagination endpoint test                    ║"
	@echo "║   make loadtest-read          Read-heavy workload (80% reads)             ║"
	@echo "║   make loadtest-write         Write-heavy workload                        ║"
	@echo "╠══════════════════════════════════════════════════════════════════════════╣"
	@echo "║ Results:                                                                  ║"
	@echo "║   make loadtest-report        Open latest HTML report                     ║"
	@echo "║   make loadtest-clean         Remove test results                         ║"
	@echo "╚══════════════════════════════════════════════════════════════════════════╝"
