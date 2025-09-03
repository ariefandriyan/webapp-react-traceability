#!/bin/bash

# Docker Setup Check untuk Tobacco Traceability App
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 Docker Setup Check untuk Tobacco Traceability${NC}"
echo "=================================================="

# Check if Docker is installed
check_docker_installed() {
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}✅ Docker is installed${NC}"
        docker --version
    else
        echo -e "${RED}❌ Docker is not installed${NC}"
        echo -e "${YELLOW}Please install Docker from: https://docs.docker.com/get-docker/${NC}"
        exit 1
    fi
}

# Check if Docker daemon is running
check_docker_daemon() {
    if docker info &> /dev/null; then
        echo -e "${GREEN}✅ Docker daemon is running${NC}"
    else
        echo -e "${RED}❌ Docker daemon is not running${NC}"
        echo -e "${YELLOW}Please start Docker Desktop or run: sudo systemctl start docker${NC}"
        exit 1
    fi
}

# Check if Docker Compose is available
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}✅ Docker Compose is installed${NC}"
        docker-compose --version
    elif docker compose version &> /dev/null; then
        echo -e "${GREEN}✅ Docker Compose (plugin) is available${NC}"
        docker compose version
    else
        echo -e "${YELLOW}⚠️  Docker Compose not found${NC}"
        echo -e "${YELLOW}Install from: https://docs.docker.com/compose/install/${NC}"
    fi
}

# Check current directory structure
check_project_structure() {
    echo -e "\n${BLUE}📁 Checking project structure...${NC}"
    
    required_files=("package.json" "src" "public" "Dockerfile" "nginx.conf")
    
    for file in "${required_files[@]}"; do
        if [ -e "$file" ]; then
            echo -e "${GREEN}✅ $file exists${NC}"
        else
            echo -e "${RED}❌ $file missing${NC}"
        fi
    done
}

# Display build instructions
show_instructions() {
    echo -e "\n${BLUE}🚀 Ready to build! Here are the commands:${NC}"
    echo "=================================================="
    echo -e "${GREEN}1. Build Docker image:${NC}"
    echo -e "   ${YELLOW}./deploy.sh build${NC}"
    echo ""
    echo -e "${GREEN}2. Run container:${NC}"
    echo -e "   ${YELLOW}./deploy.sh run${NC}"
    echo ""
    echo -e "${GREEN}3. Full deployment (build + run):${NC}"
    echo -e "   ${YELLOW}./deploy.sh deploy${NC}"
    echo ""
    echo -e "${GREEN}4. Using Docker Compose:${NC}"
    echo -e "   ${YELLOW}docker-compose up -d --build${NC}"
    echo ""
    echo -e "${GREEN}5. Manual Docker commands:${NC}"
    echo -e "   ${YELLOW}docker build -t tobacco-traceability-web .${NC}"
    echo -e "   ${YELLOW}docker run -d -p 3000:80 --name tobacco-web tobacco-traceability-web${NC}"
    echo ""
    echo -e "${BLUE}📖 For detailed documentation, see: DOCKER.md${NC}"
}

# Main execution
echo -e "\n${BLUE}🔍 Running checks...${NC}"
check_docker_installed
check_docker_daemon
check_docker_compose
check_project_structure
show_instructions

echo -e "\n${GREEN}🎉 All checks passed! You're ready to containerize your app!${NC}"
