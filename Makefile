include server/Makefile

.PHONY: compose-down

compose-down:
	docker compose -f docker.compose.yml down -v
	docker volume prune -f

.PHONY: compose-up

compose-up:
	docker compose -f docker.compose.yml up -d --remove-orphans

# =============================================================================
# Load Testing with Gatling (Java-based, industry standard)
# =============================================================================

# Build the Gatling load test image
.PHONY: loadtest-build
loadtest-build:
	docker compose -f docker.compose.yml build loadtest

# Run smoke test (10 users, quick validation)
.PHONY: loadtest-smoke
loadtest-smoke:
	@echo "🔥 Running Gatling Smoke Test..."
	@mkdir -p loadtest/results
	LOADTEST_TYPE=smoke LOADTEST_USERS=10 LOADTEST_DURATION=30 \
		docker compose -f docker.compose.yml --profile loadtest run --rm loadtest

# Run standard load test (100 users, 1 min)
.PHONY: loadtest
loadtest:
	@echo "📊 Running Gatling Load Test (100 users, 60s)..."
	@mkdir -p loadtest/results
	LOADTEST_TYPE=load LOADTEST_USERS=100 LOADTEST_DURATION=60 \
		docker compose -f docker.compose.yml --profile loadtest run --rm loadtest

# Run stress test (500 users, high load)
.PHONY: loadtest-stress
loadtest-stress:
	@echo "💪 Running Gatling Stress Test (500 users)..."
	@mkdir -p loadtest/results
	LOADTEST_TYPE=stress LOADTEST_USERS=500 LOADTEST_DURATION=120 \
		docker compose -f docker.compose.yml --profile loadtest run --rm loadtest

# Run spike test (sudden traffic burst)
.PHONY: loadtest-spike
loadtest-spike:
	@echo "⚡ Running Gatling Spike Test..."
	@mkdir -p loadtest/results
	LOADTEST_TYPE=spike LOADTEST_USERS=300 LOADTEST_DURATION=60 \
		docker compose -f docker.compose.yml --profile loadtest run --rm loadtest

# Run soak test (extended duration)
.PHONY: loadtest-soak
loadtest-soak:
	@echo "🏊 Running Gatling Soak Test (5 min)..."
	@mkdir -p loadtest/results
	LOADTEST_TYPE=soak LOADTEST_USERS=50 LOADTEST_DURATION=300 \
		docker compose -f docker.compose.yml --profile loadtest run --rm loadtest

# Run pagination test
.PHONY: loadtest-pagination
loadtest-pagination:
	@echo "📄 Running Pagination Load Test..."
	@mkdir -p loadtest/results
	LOADTEST_TYPE=pagination LOADTEST_USERS=200 LOADTEST_DURATION=60 \
		docker compose -f docker.compose.yml --profile loadtest run --rm loadtest

# Run read-heavy test (80% reads)
.PHONY: loadtest-read
loadtest-read:
	@echo "📖 Running Read-Heavy Load Test..."
	@mkdir -p loadtest/results
	LOADTEST_TYPE=read LOADTEST_USERS=300 LOADTEST_DURATION=60 \
		docker compose -f docker.compose.yml --profile loadtest run --rm loadtest

# Run write-heavy test
.PHONY: loadtest-write
loadtest-write:
	@echo "✍️  Running Write-Heavy Load Test..."
	@mkdir -p loadtest/results
	LOADTEST_TYPE=write LOADTEST_USERS=100 LOADTEST_DURATION=60 \
		docker compose -f docker.compose.yml --profile loadtest run --rm loadtest

# Open the latest Gatling report
.PHONY: loadtest-report
loadtest-report:
	@echo "📈 Opening latest Gatling report..."
	@open loadtest/results/$$(ls -t loadtest/results | head -1)/index.html 2>/dev/null || \
		echo "No reports found. Run a load test first."

# Clean load test results
.PHONY: loadtest-clean
loadtest-clean:
	@echo "🧹 Cleaning load test results..."
	rm -rf loadtest/results/*

# Show available load test commands
.PHONY: loadtest-help
loadtest-help:
	@echo "Gatling Load Test Commands:"
	@echo "  make loadtest-smoke      - Quick validation (10 users)"
	@echo "  make loadtest            - Standard load test (100 users, 1 min)"
	@echo "  make loadtest-stress     - High load test (500 users)"
	@echo "  make loadtest-spike      - Sudden traffic burst test"
	@echo "  make loadtest-soak       - Extended duration test (5 min)"
	@echo "  make loadtest-pagination - Pagination endpoint test"
	@echo "  make loadtest-read       - Read-heavy workload (80% reads)"
	@echo "  make loadtest-write      - Write-heavy workload"
	@echo "  make loadtest-report     - Open latest HTML report"
	@echo "  make loadtest-clean      - Remove test results"
