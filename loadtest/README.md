# Load Testing with k6

This directory contains load testing scripts for the Messenger Clone API.

## Prerequisites

### Option 1: Install k6 locally (macOS)
```bash
brew install k6
```

### Option 2: Use Docker
```bash
docker pull grafana/k6
```

## Test Scripts

| Script | Description |
|--------|-------------|
| `user_api.js` | Full CRUD operations stress test with ramping users |
| `concurrent_connections.js` | Tests maximum concurrent connections |
| `breakpoint.js` | Finds the breaking point (max req/s before failures) |

## Running Tests

### Quick Start

Make sure the API server is running first:
```bash
cd ../server && make run
```

### Run Locally with k6

```bash
# Stress test all user endpoints
k6 run scripts/user_api.js

# Test concurrent connections (500 VUs)
k6 run scripts/concurrent_connections.js

# Find breaking point
k6 run scripts/breakpoint.js
```

### Run with Custom Base URL

```bash
# If API is running on different host/port
k6 run -e BASE_URL=http://localhost:8080 scripts/user_api.js
```

### Run with Docker

```bash
# From loadtest directory
docker run --rm -i \
  --network host \
  -v $(pwd)/scripts:/scripts \
  grafana/k6 run /scripts/user_api.js

# Or with custom URL (for Docker network)
docker run --rm -i \
  -v $(pwd)/scripts:/scripts \
  grafana/k6 run -e BASE_URL=http://host.docker.internal:8080 /scripts/user_api.js
```

### Using Make (from project root)

```bash
make loadtest-stress        # Run stress test
make loadtest-concurrent    # Test concurrent connections
make loadtest-breakpoint    # Find breaking point
```

## Customizing Tests

### Adjusting Scenarios

Edit the `options` object in any script to change:

- **VUs (Virtual Users)**: Number of concurrent users
- **Duration**: How long to run
- **Stages**: Ramping patterns (up/down)
- **Thresholds**: Pass/fail criteria

### Example: Quick Smoke Test

```javascript
export const options = {
  vus: 10,
  duration: '30s',
};
```

### Example: High Concurrency Test

```javascript
export const options = {
  scenarios: {
    high_load: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '5m',
    },
  },
};
```

## Understanding Results

### Key Metrics

| Metric | Description |
|--------|-------------|
| `http_req_duration` | Response time (avg, min, max, p90, p95, p99) |
| `http_reqs` | Total requests made |
| `http_req_failed` | Percentage of failed requests |
| `vus` | Current number of virtual users |
| `iterations` | Completed test iterations |

### Example Output

```
     ✓ status is 200
     ✓ response time < 1s

     checks.........................: 100.00% ✓ 50000      ✗ 0
     http_req_duration..............: avg=12.5ms  min=2ms  max=150ms  p(90)=25ms  p(95)=35ms
     http_reqs......................: 50000   833.33/s
     vus............................: 100     min=0        max=100
```

## Advanced: Export Results

### JSON Output
```bash
k6 run --out json=results.json scripts/user_api.js
```

### CSV Output
```bash
k6 run --out csv=results.csv scripts/user_api.js
```

### InfluxDB + Grafana (Real-time Dashboard)
```bash
k6 run --out influxdb=http://localhost:8086/k6 scripts/user_api.js
```

## Troubleshooting

### "Connection refused" errors
- Ensure the API server is running
- Check the BASE_URL is correct
- If using Docker, use `host.docker.internal` instead of `localhost`

### High error rate
- Server might be overloaded - reduce VUs
- Check server logs for errors
- Increase server resources (CPU, memory, DB connections)

### Low throughput
- Network latency might be the bottleneck
- Server might need tuning (worker processes, connection pools)
- Database might be the bottleneck
