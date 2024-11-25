DOCKER_COMPOSE_FILE := docker-compose.yml
APP_IMAGE_NAME := fetch_app

.PHONY: build
build:
	@if [ -z "$$(docker images -q $(APP_IMAGE_NAME))" ] || [ "$(FORCE_REBUILD)" = "true" ]; then \
		echo "Containers are not built or force rebuild is enabled. Building containers..."; \
		docker-compose -f $(DOCKER_COMPOSE_FILE) build; \
	else \
		echo "Containers are already built."; \
	fi

.PHONY: rebuild
rebuild: 
	@echo "Forcing rebuild of containers..."
	@$(MAKE) FORCE_REBUILD=true build

.PHONY: run
run:
	@echo "Running the application..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up

.PHONY: start
start: build run
	@echo "Application started successfully"

.PHONY: test
test: build
	@echo "Running tests..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app sh -c "NODE_ENV=test npm run test"
