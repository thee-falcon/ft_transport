# Variables
COMPOSE_FILE := docker-compose.yml
SERVICE_WEB := web
SERVICE_DB := db

# Default target
all: up

# Start the services
up:
	@echo "Starting services..."
	docker-compose -f $(COMPOSE_FILE) up --build

# Stop the services
down:
	@echo "Stopping services..."
	docker-compose -f $(COMPOSE_FILE) down -v

# Rebuild and start the services
rebuild:
	@echo "Rebuilding and starting services..."
	docker-compose -f $(COMPOSE_FILE) up -d --build

# Stop and remove containers, networks, and volumes
clean:
	@echo "Cleaning up..."
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans
