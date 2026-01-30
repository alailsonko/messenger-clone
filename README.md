# 🚀 Messenger Clone API

A high-performance, horizontally scalable REST API built with Go and Fiber v3, featuring database sharding, connection pooling, and streaming replication.

[![Go Version](https://img.shields.io/badge/Go-1.25-blue.svg)](https://golang.org/)
[![Fiber](https://img.shields.io/badge/Fiber-v3-00ADD8.svg)](https://gofiber.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://docs.docker.com/compose/)

## 📊 Performance Highlights

Tested on MacBook Air M2 with 10,000 concurrent users:

| Metric | Value |
|--------|-------|
| **Success Rate** | 100% |
| **Throughput** | ~2,100 req/sec |
| **P50 Latency** | 1ms |
| **P95 Latency** | 3ms |
| **P99 Latency** | 11ms |
| **Max Response** | 105ms |

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                       API Server (Fiber v3 with Prefork)                       │
│                   7 Worker Processes • Sonic JSON • :8080                      │
└────────────────────────────────────────────────────────────────────────────────┘
         │              │              │              │              │
         ▼              ▼              ▼              ▼              ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │PgBouncer │   │PgBouncer │   │PgBouncer │   │PgBouncer │   │PgBouncer │
   │ Pool 0   │   │ Pool 1   │   │ Pool 2   │   │ Pool 3   │   │ Pool 4   │
   │  :6430   │   │  :6431   │   │  :6432   │   │  :6433   │   │  :6434   │
   └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
        │              │              │              │              │
        ▼              ▼              ▼              ▼              ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ Shard 0  │   │ Shard 1  │   │ Shard 2  │   │ Shard 3  │   │ Shard 4  │
   │ Primary  │   │ Primary  │   │ Primary  │   │ Primary  │   │ Primary  │
   │  :5440   │   │  :5441   │   │  :5442   │   │  :5443   │   │  :5444   │
   └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
        │              │              │              │              │
        ▼              ▼              ▼              ▼              ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ Shard 0  │   │ Shard 1  │   │ Shard 2  │   │ Shard 3  │   │ Shard 4  │
   │ Replica  │   │ Replica  │   │ Replica  │   │ Replica  │   │ Replica  │
   │  :5450   │   │  :5451   │   │  :5452   │   │  :5453   │   │  :5454   │
   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

### Key Components

- **Fiber v3**: High-performance HTTP framework with prefork mode for multi-core utilization
- **Sonic JSON**: 2-5x faster JSON encoding/decoding than standard library
- **PgBouncer**: Connection pooling in transaction mode (10K connections → 300 DB connections)
- **PostgreSQL 16**: Sharded across 5 instances with streaming replication
- **Consistent Hashing**: MD5-based shard routing for even data distribution
- **GORM**: ORM with optimized settings (skip default transaction, prepared statements disabled)

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Make
- Go 1.25+ (for local development)

### Start the Application

```bash
# Start everything (infrastructure + API server with prefork)
make dev
```

The API will be available at `http://localhost:8080`

### Verify Everything is Running

```bash
# Check health
make health

# View shard statistics
make shards

# Show running containers
make ps
```

## 📋 Available Commands

Run `make help` to see all available commands:

### Infrastructure Commands

| Command | Description |
|---------|-------------|
| `make up` | Start infrastructure (5 shards + replicas + pgbouncers) |
| `make down` | Stop all services |
| `make down-clean` | Stop all and remove volumes (clean slate) |
| `make ps` | Show running containers |
| `make stats` | Show resource usage (CPU, memory, network) |
| `make logs` | View API server logs |
| `make logs-all` | View all service logs |

### API Server Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start everything (infra + API with prefork) |
| `make restart` | Restart API server |
| `make rebuild` | Rebuild and restart API server |

### Database Commands

| Command | Description |
|---------|-------------|
| `make shards` | Show shard statistics (user counts per shard) |
| `make health` | Check API health endpoint |
| `make db-shell SHARD=0` | Connect to PostgreSQL shell on specific shard |

### Migration Commands

| Command | Description |
|---------|-------------|
| `make migrate-make NAME=<name>` | Create a new migration file |
| `make migrate-up` | Run all pending migrations |
| `make migrate-down` | Rollback the last migration |
| `make migrate-latest` | Run migrations to latest version |

### Load Testing Commands

Run `make loadtest-help` to see all load testing commands:

| Command | Description |
|---------|-------------|
| `make loadtest-smoke` | Quick validation (10 users, 30s) |
| `make loadtest` | Standard load test (100 users, 60s) |
| `make loadtest-custom USERS=N` | Custom user count load test |
| `make loadtest-10k` | 10,000 concurrent users test |
| `make loadtest-crud` | Full CRUD operations test |
| `make loadtest-stress` | High load test (500 users, 120s) |
| `make loadtest-spike` | Sudden traffic burst test |
| `make loadtest-soak` | Extended duration test (5 min) |
| `make loadtest-pagination` | Pagination endpoint test |
| `make loadtest-read` | Read-heavy workload (80% reads) |
| `make loadtest-write` | Write-heavy workload |
| `make loadtest-report` | Open latest HTML report |
| `make loadtest-clean` | Remove test results |

## 🔌 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/` | Create a new user |
| `GET` | `/api/v1/users/` | List users (paginated) |
| `GET` | `/api/v1/users/:id` | Get user by ID |
| `PUT` | `/api/v1/users/:id` | Update user |
| `DELETE` | `/api/v1/users/:id` | Delete user |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/shards/stats` | Shard statistics |

### Example Requests

```bash
# Create a user
curl -X POST http://localhost:8080/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# List users
curl http://localhost:8080/api/v1/users/?limit=20&offset=0

# Get user by ID
curl http://localhost:8080/api/v1/users/123e4567-e89b-12d3-a456-426614174000

# Update user
curl -X PUT http://localhost:8080/api/v1/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'

# Delete user
curl -X DELETE http://localhost:8080/api/v1/users/123e4567-e89b-12d3-a456-426614174000

# Check shard statistics
curl http://localhost:8080/api/v1/shards/stats | jq
```

## 📁 Project Structure

```
messenger-clone/
├── Makefile                    # Main build and run commands
├── docker-compose.yml          # Docker orchestration (5 shards + replicas)
├── README.md                   # This file
│
├── server/                     # Go API Server
│   ├── Dockerfile              # Multi-stage build (dev + production)
│   ├── Makefile                # Server-specific commands
│   ├── go.mod                  # Go modules
│   ├── migration.yml           # Migration configuration
│   │
│   ├── cmd/
│   │   └── api/
│   │       └── main.go         # Application entry point
│   │
│   ├── config/
│   │   └── config.go           # Configuration management
│   │
│   ├── internal/
│   │   ├── application/        # Business logic layer
│   │   │   └── services/       # Application services
│   │   │
│   │   ├── bootstrap/          # Service initialization
│   │   │   ├── application_service.go
│   │   │   └── shard_service.go
│   │   │
│   │   ├── domain/             # Domain models
│   │   │   ├── entities/       # Entity definitions
│   │   │   └── repositories/   # Repository interfaces
│   │   │
│   │   ├── infra/              # Infrastructure layer
│   │   │   └── database/
│   │   │       └── shard/      # Sharding implementation
│   │   │
│   │   ├── persistence/        # Data access layer
│   │   │   └── repositories/   # Repository implementations
│   │   │
│   │   └── presentation/       # HTTP layer
│   │       ├── handlers/       # Request handlers
│   │       └── routes/         # Route definitions
│   │
│   ├── migrations/             # Database migrations
│   │
│   └── tools/
│       └── migration/          # Migration tool
│
├── database/                   # Database configuration
│   ├── pgbouncer/              # PgBouncer config
│   └── postgres/
│       ├── init/               # Initialization scripts
│       ├── replica/            # Replica setup scripts
│       └── pg_hba.conf         # Authentication config
│
├── loadtest/                   # Load testing
│   ├── Makefile                # Load test commands
│   ├── README.md               # Load test documentation
│   └── gatling/
│       ├── Dockerfile          # Gatling container
│       ├── entrypoint.sh       # Test runner
│       ├── conf/               # Gatling configuration
│       ├── results/            # Test results (HTML reports)
│       └── simulations/        # Test scenarios
│           ├── CreateUserSimulation.scala
│           └── UserSimulation.scala
│
├── docs/                       # Documentation
│   ├── DATABASE_SCALING.md     # Database scaling guide
│   ├── PARTITIONING_GUIDE.md   # Table partitioning guide
│   ├── PERFORMANCE_TUNING.md   # Performance optimization
│   └── SHARDING_GUIDE.md       # Sharding implementation
│
└── scripts/                    # Utility scripts
    ├── loadtest-create-user.sh
    ├── loadtest-env.sh
    ├── loadtest-sharded.sh
    ├── migrate-shards.sh
    ├── partition-shards.sh
    └── tune-postgres.sh
```

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | API server port |
| `SHARDING_ENABLED` | `true` | Enable database sharding |
| `SHARDING_COUNT` | `5` | Number of database shards |
| `GOMAXPROCS` | `7` | Number of prefork worker processes |
| `GOGC` | `50` | Garbage collection target percentage |
| `GOMEMLIMIT` | `4GiB` | Go memory limit |
| `DB_WRITE_MAX_OPEN_CONNS` | `500` | Max open DB connections per shard |
| `DB_WRITE_MAX_IDLE_CONNS` | `250` | Max idle DB connections per shard |

### PgBouncer Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| `pool_mode` | `transaction` | Connection pooling mode |
| `max_client_conn` | `10000` | Max client connections |
| `default_pool_size` | `200` | Default pool size per database |
| `max_db_connections` | `300` | Max database connections |
| `reserve_pool_size` | `50` | Reserve pool for burst traffic |

## 🧪 Running Load Tests

### Quick Smoke Test

```bash
make loadtest-smoke
```

### Standard Load Test

```bash
make loadtest
```

### 10K Concurrent Users

```bash
make loadtest-10k
```

### View Results

```bash
# Open HTML report in browser
make loadtest-report
```

### Custom Load Test

```bash
# Run with custom user count and duration
make loadtest-custom USERS=5000 DURATION=120
```

## 🔧 Development

### Hot Reload

The development mode includes hot reload via [Air](https://github.com/air-verse/air):

```bash
make dev
```

Edit any Go file in `server/` and the server will automatically rebuild and restart.

### Adding New Migrations

```bash
# Create a new migration
make migrate-make NAME=add_messages_table

# Run migrations
make migrate-up
```

### Running Tests

```bash
cd server
make test

# With coverage
make test-coverage
```

## 📈 Monitoring

### Resource Usage

```bash
make stats
```

### Shard Distribution

```bash
make shards
```

Example output:
```json
{
  "total_users": 9398603,
  "shard_count": 5,
  "shards": [
    { "shard_name": "shard-0", "user_count": 2132135 },
    { "shard_name": "shard-1", "user_count": 2368920 },
    { "shard_name": "shard-2", "user_count": 2424517 },
    { "shard_name": "shard-3", "user_count": 2382946 },
    { "shard_name": "shard-4", "user_count": 90085 }
  ]
}
```

### Container Logs

```bash
# API server logs
make logs

# All service logs
make logs-all
```

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `messenger_server` | 8080 | API Server |
| `pgbouncer-0` to `pgbouncer-4` | 6430-6434 | Connection poolers |
| `shard-0` to `shard-4` | 5440-5444 | Primary databases |
| `shard-0-replica` to `shard-4-replica` | 5450-5454 | Read replicas |
| `redis` | 6379 | Cache (optional) |

## 📚 Additional Documentation

- [Database Scaling Guide](docs/DATABASE_SCALING.md)
- [Sharding Implementation](docs/SHARDING_GUIDE.md)
- [Table Partitioning](docs/PARTITIONING_GUIDE.md)
- [Performance Tuning](docs/PERFORMANCE_TUNING.md)
- [Load Test Instructions](loadtest/LOADTEST_INSTRUCTIONS.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Go, Fiber, PostgreSQL, and Docker
