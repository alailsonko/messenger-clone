include server/Makefile

.PHONY: container-down

container-down:
	docker compose -f docker.compose.yml down -v
	docker volume prune -f

.PHONY: container-up

container-up:
	docker compose -f docker.compose.yml up -d
