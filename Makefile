DOCKER_COMPOSE_FILE := docker-compose.yml
APP_IMAGE_NAME := fetch_app

.PHONY: build
build:
	@echo "Building the application..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

.PHONY: run
run:
	@echo "Running the application..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up

.PHONY: start
start: build run
	@echo "Application started successfully"

.PHONY: test
test:
	@echo "Running tests..."
	@if [ -z "$$(docker images -q $(APP_IMAGE_NAME))" ]; then \
		echo "Containers are not built. Building containers..."; \
		docker-compose -f $(DOCKER_COMPOSE_FILE) build; \
	else \
		echo "Containers are already built."; \
	fi
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app sh -c "NODE_ENV=test npm run test"
