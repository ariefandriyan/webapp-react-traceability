#!/bin/bash

# Build dan Deploy Script untuk Tobacco Traceability App
set -e

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variabel
APP_NAME="tobacco-traceability"
IMAGE_NAME="$APP_NAME-web"
CONTAINER_NAME="$APP_NAME-web"
PORT="3000"

echo -e "${GREEN}🚀 Building Tobacco Traceability Application${NC}"

# Function untuk membersihkan container dan image lama
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up old containers and images...${NC}"
    
    # Stop dan remove container jika ada
    if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
        docker stop $CONTAINER_NAME 2>/dev/null || true
        docker rm $CONTAINER_NAME 2>/dev/null || true
        echo -e "${GREEN}✅ Old container removed${NC}"
    fi
    
    # Remove dangling images
    docker image prune -f 2>/dev/null || true
}

# Function untuk build image
build_image() {
    echo -e "${YELLOW}🔨 Building Docker image...${NC}"
    
    # Build image dengan build args untuk optimization
    docker build \
        --tag $IMAGE_NAME:latest \
        --tag $IMAGE_NAME:$(date +%Y%m%d-%H%M%S) \
        --build-arg NODE_ENV=production \
        . || {
        echo -e "${RED}❌ Docker build failed${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
}

# Function untuk run container
run_container() {
    echo -e "${YELLOW}🏃 Starting container...${NC}"
    
    docker run -d \
        --name $CONTAINER_NAME \
        --port $PORT:80 \
        --restart unless-stopped \
        --health-cmd="curl -f http://localhost/ || exit 1" \
        --health-interval=30s \
        --health-timeout=3s \
        --health-start-period=5s \
        --health-retries=3 \
        $IMAGE_NAME:latest || {
        echo -e "${RED}❌ Failed to start container${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Container started successfully${NC}"
    echo -e "${GREEN}🌐 Application is running at: http://localhost:$PORT${NC}"
}

# Function untuk show logs
show_logs() {
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs --tail 20 $CONTAINER_NAME
}

# Function untuk health check
health_check() {
    echo -e "${YELLOW}🏥 Checking application health...${NC}"
    
    # Wait for container to be ready
    sleep 5
    
    # Check if container is running
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo -e "${GREEN}✅ Container is running${NC}"
        
        # Check application health
        if curl -f http://localhost:$PORT >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Application is healthy${NC}"
        else
            echo -e "${YELLOW}⚠️  Application is starting up...${NC}"
        fi
    else
        echo -e "${RED}❌ Container is not running${NC}"
        show_logs
        exit 1
    fi
}

# Main execution
case "$1" in
    "build")
        cleanup
        build_image
        ;;
    "run")
        cleanup
        run_container
        health_check
        ;;
    "deploy")
        cleanup
        build_image
        run_container
        health_check
        show_logs
        ;;
    "dev")
        echo -e "${YELLOW}🔧 Starting development environment...${NC}"
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    "dev-down")
        echo -e "${YELLOW}🛑 Stopping development environment...${NC}"
        docker-compose -f docker-compose.dev.yml down
        ;;
    "stop")
        echo -e "${YELLOW}🛑 Stopping application...${NC}"
        docker stop $CONTAINER_NAME 2>/dev/null || true
        echo -e "${GREEN}✅ Application stopped${NC}"
        ;;
    "logs")
        show_logs
        ;;
    "clean")
        cleanup
        echo -e "${GREEN}✅ Cleanup completed${NC}"
        ;;
    *)
        echo "Usage: $0 {build|run|deploy|dev|dev-down|stop|logs|clean}"
        echo ""
        echo "Commands:"
        echo "  build     - Build Docker image only"
        echo "  run       - Run container from existing image"
        echo "  deploy    - Full deployment (build + run)"
        echo "  dev       - Start development environment with hot reload"
        echo "  dev-down  - Stop development environment"
        echo "  stop      - Stop running container"
        echo "  logs      - Show container logs"
        echo "  clean     - Clean up containers and images"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Operation completed successfully!${NC}"
