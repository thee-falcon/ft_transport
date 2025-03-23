#!/bin/bash

echo "Setting up Docker containers for the project..."

# Build and start the containers
docker-compose up -d --build

echo "Containers are up and running!"
echo "Web application is available at: http://localhost:8000"
echo "PostgreSQL database is available at localhost:5432"
echo ""
echo "To stop the containers run: docker-compose down" 