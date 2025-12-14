.PHONY: migrate-create

migrate-create:
	@if [ -z "$(NAME)" ]; then \
		echo "Usage: make migrate-create NAME=<migration_name> [CONFIG=./migration.yml]"; \
		exit 1; \
	fi
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	go run ./tools/migration -cmd generate -config "$$CONFIG_PATH" -name "$(NAME)"

.PHONY: migrate-up

migrate-up:
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	go run ./tools/migration -cmd up -config "$$CONFIG_PATH"


.PHONY: migrate-down

migrate-down:
	@CONFIG_PATH="$(CONFIG)"; \
	if [ -z "$$CONFIG_PATH" ]; then CONFIG_PATH="./migration.yml"; fi; \
	go run ./tools/migration -cmd down -config "$$CONFIG_PATH"

.PHONY: container-down

container-down:
	docker compose -f ../docker.compose.yml down -v
	docker volume prune -f

.PHONY: container-up

container-up:
	docker compose -f ../docker.compose.yml up -d
