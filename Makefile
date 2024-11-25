DOCKER_COMPOSE_FILE := docker-compose.yml

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
	docker-compose -f $(DOCKER_COMPOSE_FILE) run app npm run test
