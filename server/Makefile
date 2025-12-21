SELF_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

.PHONY: migrate-make

migrate-make:
	@if [ -z "$(NAME)" ]; then \
		echo "Usage: make migrate-make NAME=<migration_name> [CONFIG=./migration.yml]"; \
		exit 1; \
	fi
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	cd "$(SELF_DIR)" && go run ./tools/migration make --config "$$CONFIG_PATH" --name "$(NAME)"

.PHONY: migrate-up

migrate-up:
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	cd "$(SELF_DIR)" && go run ./tools/migration up --config "$$CONFIG_PATH"


.PHONY: migrate-down

migrate-down:
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	cd "$(SELF_DIR)" && go run ./tools/migration down --config "$$CONFIG_PATH"

.PHONY: migrate-latest

migrate-latest:
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	cd "$(SELF_DIR)" && go run ./tools/migration latest --config "$$CONFIG_PATH"

.PHONY: tidy

tidy:
	cd "$(SELF_DIR)" && go mod tidy
