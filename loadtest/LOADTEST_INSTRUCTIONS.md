# Load Testing Instructions

## Overview

This project uses **Gatling** as the official load testing tool. All load tests should be written and executed using Gatling simulations.

## Why Gatling?

- **Scala-based DSL**: Powerful and expressive test scenarios
- **Detailed Reports**: HTML reports with percentiles, response times, and throughput graphs
- **High Performance**: Efficiently handles thousands of concurrent users
- **CI/CD Integration**: Easy to integrate with automated pipelines

## Directory Structure

```
loadtest/
├── gatling/
│   ├── Dockerfile           # Gatling container image
│   ├── entrypoint.sh        # Container startup script
│   ├── conf/
│   │   ├── gatling.conf     # Gatling configuration
│   │   └── logback.xml      # Logging configuration
│   ├── simulations/         # Test scenarios (Scala files)
│   └── results/             # Generated HTML reports
├── results/                  # Load test results archive
├── Dockerfile
├── Makefile
└── README.md
```

## Running Load Tests

### Using Docker (Recommended)

```bash
# Navigate to loadtest directory
cd loadtest

# Build and run Gatling tests
make gatling

# Or run specific simulation
docker-compose run --rm gatling -s MessengerSimulation
```

### Using Makefile

```bash
# Run all Gatling simulations
make loadtest

# Run with specific parameters
make loadtest USERS=10000 DURATION=60
```

## Writing Simulations

Create Scala simulation files in `loadtest/gatling/simulations/`:

```scala
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class MessengerSimulation extends Simulation {

  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")

  val createUser = scenario("Create Users")
    .exec(
      http("Create User")
        .post("/api/v1/users/")
        .body(StringBody("""{"first_name":"Test","last_name":"User"}"""))
        .check(status.is(201))
    )

  setUp(
    createUser.inject(
      rampUsers(10000).during(30.seconds)
    )
  ).protocols(httpProtocol)
}
```

## Test Scenarios

| Scenario | Description | Target |
|----------|-------------|--------|
| Smoke Test | Basic functionality check | 100 users |
| Load Test | Normal expected load | 5,000 users |
| Stress Test | Beyond normal capacity | 20,000 users |
| Spike Test | Sudden traffic burst | 10,000 users in 10s |

## Viewing Results

After running tests, HTML reports are generated in:
- `loadtest/gatling/results/` (latest run)
- `loadtest/results/messenger-loadtest-{timestamp}/` (archived)

Open `index.html` in a browser to view:
- Response time distribution
- Requests per second
- Active users over time
- Error rate analysis

## Important Notes

⚠️ **Do NOT use the Go-based load test (`bin/sharded-loadtest.go`)** for production testing. It's only for quick development checks.

✅ **Always use Gatling** for:
- Performance benchmarking
- Capacity planning
- Regression testing
- CI/CD load tests

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TARGET_URL` | API base URL | `http://localhost:8080` |
| `USERS` | Number of virtual users | `5000` |
| `DURATION` | Test duration (seconds) | `30` |
| `RAMP_UP` | Ramp-up time (seconds) | `10` |

## Best Practices

1. **Warm up the system** before running tests
2. **Run multiple iterations** for consistent results
3. **Monitor system resources** during tests (CPU, memory, DB connections)
4. **Test through PgBouncer** (port 6430+) for realistic connection pooling
5. **Archive results** with meaningful timestamps
6. **Compare baselines** after infrastructure changes
