# =============================================================================
# Server Makefile - Migration and Development Commands
# =============================================================================

SELF_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

# =============================================================================
# Migration Commands
# =============================================================================

.PHONY: migrate-make migrate-up migrate-down migrate-latest

# Create a new migration file (usage: make migrate-make NAME=add_users_table)
migrate-make:
	@if [ -z "$(NAME)" ]; then \
		echo "Usage: make migrate-make NAME=<migration_name>"; \
		echo "Example: make migrate-make NAME=add_users_table"; \
		exit 1; \
	fi
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	cd "$(SELF_DIR)" && go run ./tools/migration make --config "$$CONFIG_PATH" --name "$(NAME)"

# Run all pending migrations
migrate-up:
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	cd "$(SELF_DIR)" && go run ./tools/migration up --config "$$CONFIG_PATH"

# Rollback the last migration
migrate-down:
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	cd "$(SELF_DIR)" && go run ./tools/migration down --config "$$CONFIG_PATH"

# Run migrations to the latest version
migrate-latest:
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	cd "$(SELF_DIR)" && go run ./tools/migration latest --config "$$CONFIG_PATH"

# =============================================================================
# Go Commands
# =============================================================================

.PHONY: tidy build run test test-coverage

# Tidy go modules
tidy:
	cd "$(SELF_DIR)" && go mod tidy

# Build the server binary
build:
	cd "$(SELF_DIR)" && CGO_ENABLED=0 go build -ldflags="-s -w" -o messenger-api ./cmd/api

# Run the server locally (outside Docker)
run:
	cd "$(SELF_DIR)" && go run ./cmd/api

# Run tests
test:
	cd "$(SELF_DIR)" && go test -v ./...

# Run tests with coverage
test-coverage:
	cd "$(SELF_DIR)" && go test -v -coverprofile=coverage.out ./... && go tool cover -html=coverage.out
