# Load Testing with Gatling

This directory contains load testing tools for the Messenger Clone API.

## 🎯 Quick Start

### Using Docker Compose (Recommended)

```bash
# From project root - start everything and run load test
docker-compose -f docker-compose.sharded.yml up -d
cd server && SHARDING_ENABLED=true ./messenger-api &

# Run Gatling load test
cd loadtest/gatling
docker build -t messenger-loadtest .
docker run --rm --network host \
  -v $(pwd)/results:/results \
  -e BASE_URL=http://localhost:8080 \
  -e TARGET_USERS=1000 \
  messenger-loadtest
```

### Using Make

```bash
# From loadtest directory
make gatling-test USERS=5000 DURATION=60
```

## 📊 Load Test Results (Proven)

| Concurrent Users | Throughput | Success Rate | Mean Response |
|------------------|------------|--------------|---------------|
| 1,000 | 384 req/sec | 100% | 2ms |
| 5,000 | 7,783 req/sec | 99.7% | 514ms |
| 10,000 | 6,245 req/sec | 95.0% | 1,250ms |

**Total users created**: 1,002,372 across 4 shards

## 🏗️ Architecture

```
loadtest/
├── gatling/
│   ├── Dockerfile        # Gatling 3.10.3 image
│   ├── entrypoint.sh     # Test runner script
│   ├── conf/
│   │   ├── gatling.conf  # Gatling configuration
│   │   └── logback.xml   # Logging config
│   ├── results/          # HTML reports
│   └── simulations/      # Scala test scenarios
├── bin/
│   └── sharded-loadtest.go  # Go-based load test tool
└── results/              # Test results archive
```

## 🧪 Test Simulations

### CreateUserSimulation (Default)

Creates users with random first/last names:

```scala
// Ramps up to TARGET_USERS over RAMP_DURATION seconds
// Holds constant load for TEST_DURATION seconds
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:8080` | API endpoint |
| `TARGET_USERS` | `100` | Concurrent users |
| `TEST_DURATION` | `60` | Hold duration (seconds) |
| `RAMP_DURATION` | `30` | Ramp up time (seconds) |

## 📈 Running Different Load Levels

```bash
# Smoke test (100 users)
docker run --rm --network host \
  -v $(pwd)/results:/results \
  -e TARGET_USERS=100 \
  messenger-loadtest

# Medium load (1,000 users)
docker run --rm --network host \
  -v $(pwd)/results:/results \
  -e TARGET_USERS=1000 \
  -e TEST_DURATION=120 \
  messenger-loadtest

# Stress test (5,000 users)
docker run --rm --network host \
  -v $(pwd)/results:/results \
  -e TARGET_USERS=5000 \
  -e TEST_DURATION=60 \
  messenger-loadtest

# Maximum load (10,000 users)
docker run --rm --network host \
  -v $(pwd)/results:/results \
  -e TARGET_USERS=10000 \
  -e TEST_DURATION=60 \
  messenger-loadtest
```

## 📊 Viewing Results

HTML reports are saved to `gatling/results/`:

```bash
# Open latest report in browser
open gatling/results/messenger-loadtest-*/index.html
```

## 🔧 Go Load Test Tool

For simpler load testing without Gatling:

```bash
cd bin
go run sharded-loadtest.go -users 1000 -duration 60s
```

## 🐛 Troubleshooting

### "Connection refused"
- Ensure API is running: `curl http://localhost:8080/health`
- Check sharded setup: `docker ps` (8 PostgreSQL containers should be running)

### Low throughput
- Check shard distribution: `curl http://localhost:8080/api/v1/shards/stats`
- Verify replicas are synced
- Increase ulimits if needed: `ulimit -n 65535`

### High error rate at 10K users
- This is expected (95% success rate at 10K)
- Consider adding more shards or horizontal API scaling
