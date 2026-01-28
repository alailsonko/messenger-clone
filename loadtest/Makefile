.PHONY: build run clean

# Build the load test binary
build:
	go build -o bin/loadtest ./cmd/loadtest

# Run tests
run: build
	./bin/loadtest -c 100 -d 30s

# Full CRUD test with 200 workers for 1 minute
stress: build
	./bin/loadtest -c 200 -d 1m -t all

# Read-only test (highest throughput)
read: build
	./bin/loadtest -c 500 -d 30s -t read

# Create-only test  
create: build
	./bin/loadtest -c 100 -d 30s -t create

# Test maximum concurrent connections
concurrent: build
	./bin/loadtest -c 1000 -t concurrent

# Breakpoint test - keep increasing until failure
breakpoint: build
	@echo "Testing 100 workers..."
	./bin/loadtest -c 100 -d 10s -t read || true
	@echo "\nTesting 500 workers..."
	./bin/loadtest -c 500 -d 10s -t read || true
	@echo "\nTesting 1000 workers..."
	./bin/loadtest -c 1000 -d 10s -t read || true
	@echo "\nTesting 2000 workers..."
	./bin/loadtest -c 2000 -d 10s -t read || true

clean:
	rm -rf bin/

# Custom URL
URL ?= http://localhost:8080
run-custom: build
	./bin/loadtest -url $(URL) -c 100 -d 30s
