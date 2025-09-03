#!/bin/bash

# Monitoring Script for Tobacco Traceability Application
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_NAME="tobacco-traceability"
WEB_URL="http://localhost"
HEALTH_ENDPOINT="$WEB_URL/"

echo -e "${BLUE}📊 Tobacco Traceability Monitoring${NC}"
echo "==================================="

# Function untuk check container status
check_containers() {
    echo -e "${YELLOW}🐳 Checking container status...${NC}"
    
    containers=$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep $APP_NAME || true)
    
    if [ -z "$containers" ]; then
        echo -e "${RED}❌ No containers running${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Running containers:${NC}"
        echo "$containers"
        return 0
    fi
}

# Function untuk check application health
check_health() {
    echo -e "\n${YELLOW}🏥 Checking application health...${NC}"
    
    # HTTP health check
    if curl -f -s "$HEALTH_ENDPOINT" > /dev/null; then
        echo -e "${GREEN}✅ Application is responding${NC}"
        
        # Get response time
        response_time=$(curl -o /dev/null -s -w "%{time_total}" "$HEALTH_ENDPOINT")
        echo -e "${BLUE}⏱️  Response time: ${response_time}s${NC}"
        
    else
        echo -e "${RED}❌ Application not responding${NC}"
        return 1
    fi
}

# Function untuk check resource usage
check_resources() {
    echo -e "\n${YELLOW}💻 Checking resource usage...${NC}"
    
    # Docker stats for app containers
    echo -e "${BLUE}Container resource usage:${NC}"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep $APP_NAME || true
    
    # System resources
    echo -e "\n${BLUE}System resources:${NC}"
    echo "CPU Usage: $(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d% -f1)%"
    echo "Memory Usage: $(vm_stat | grep "Pages active" | awk '{print $3}' | sed 's/\.//')% active"
    echo "Disk Usage: $(df -h / | tail -1 | awk '{print $5}')"
}

# Function untuk check logs for errors
check_logs() {
    echo -e "\n${YELLOW}📋 Checking recent logs for errors...${NC}"
    
    # Get container name
    container_name=$(docker ps --format "{{.Names}}" | grep "${APP_NAME}-web" | head -1)
    
    if [ -n "$container_name" ]; then
        echo -e "${BLUE}Recent errors in $container_name:${NC}"
        docker logs --tail=50 "$container_name" 2>&1 | grep -i "error\|exception\|failed\|fatal" | tail -10 || echo "No recent errors found"
        
        echo -e "\n${BLUE}Recent logs (last 10 lines):${NC}"
        docker logs --tail=10 "$container_name"
    else
        echo -e "${RED}❌ No web container found${NC}"
    fi
}

# Function untuk check network connectivity
check_network() {
    echo -e "\n${YELLOW}🌐 Checking network connectivity...${NC}"
    
    # Check if port is accessible
    if nc -z localhost 80 2>/dev/null; then
        echo -e "${GREEN}✅ Port 80 is accessible${NC}"
    else
        echo -e "${RED}❌ Port 80 is not accessible${NC}"
    fi
    
    # Check if port 443 is configured
    if nc -z localhost 443 2>/dev/null; then
        echo -e "${GREEN}✅ Port 443 (HTTPS) is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Port 443 (HTTPS) not configured${NC}"
    fi
}

# Function untuk check storage space
check_storage() {
    echo -e "\n${YELLOW}💾 Checking storage usage...${NC}"
    
    # Docker system usage
    echo -e "${BLUE}Docker system usage:${NC}"
    docker system df
    
    # Volume usage
    echo -e "\n${BLUE}Volume usage:${NC}"
    docker volume ls | grep $APP_NAME | while read driver name; do
        echo "Volume: $name"
    done
}

# Function untuk performance test
performance_test() {
    echo -e "\n${YELLOW}🚀 Running performance test...${NC}"
    
    if command -v ab &> /dev/null; then
        echo -e "${BLUE}Running Apache Bench test (10 requests)...${NC}"
        ab -n 10 -c 2 "$HEALTH_ENDPOINT" | grep -E "Requests per second|Time per request|Transfer rate"
    else
        echo -e "${YELLOW}⚠️  Apache Bench not available. Install with: brew install apache2${NC}"
        
        # Simple curl timing test
        echo -e "${BLUE}Running simple timing test...${NC}"
        for i in {1..5}; do
            time_taken=$(curl -o /dev/null -s -w "%{time_total}" "$HEALTH_ENDPOINT")
            echo "Request $i: ${time_taken}s"
        done
    fi
}

# Function untuk generate health report
generate_report() {
    echo -e "\n${YELLOW}📊 Generating health report...${NC}"
    
    report_file="health-report-$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "=== Tobacco Traceability Health Report ==="
        echo "Generated: $(date)"
        echo "=========================================="
        echo
        
        echo "CONTAINER STATUS:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep $APP_NAME || echo "No containers running"
        echo
        
        echo "RESOURCE USAGE:"
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep $APP_NAME || echo "No containers for stats"
        echo
        
        echo "RECENT LOGS:"
        container_name=$(docker ps --format "{{.Names}}" | grep "${APP_NAME}-web" | head -1)
        if [ -n "$container_name" ]; then
            docker logs --tail=20 "$container_name" 2>&1
        else
            echo "No web container found"
        fi
        
    } > "$report_file"
    
    echo -e "${GREEN}✅ Report saved to: $report_file${NC}"
}

# Function untuk auto-restart unhealthy containers
auto_restart() {
    echo -e "\n${YELLOW}🔄 Checking for unhealthy containers...${NC}"
    
    # Check if health check fails
    if ! check_health > /dev/null 2>&1; then
        echo -e "${RED}❌ Health check failed. Attempting restart...${NC}"
        
        container_name=$(docker ps --format "{{.Names}}" | grep "${APP_NAME}-web" | head -1)
        if [ -n "$container_name" ]; then
            echo -e "${BLUE}🔄 Restarting $container_name...${NC}"
            docker restart "$container_name"
            
            # Wait and check again
            sleep 30
            if check_health > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Restart successful${NC}"
            else
                echo -e "${RED}❌ Restart failed. Manual intervention required${NC}"
            fi
        fi
    else
        echo -e "${GREEN}✅ All containers healthy${NC}"
    fi
}

# Main menu
main_menu() {
    echo -e "\n${BLUE}Monitoring Options:${NC}"
    echo "1. Quick health check"
    echo "2. Detailed system status"
    echo "3. Check logs for errors"
    echo "4. Performance test"
    echo "5. Generate full report"
    echo "6. Auto-restart unhealthy containers"
    echo "7. Continuous monitoring (30s interval)"
    echo "8. Exit"
    
    read -p "Choose option (1-8): " choice
    
    case $choice in
        1)
            check_containers
            check_health
            check_network
            ;;
        2)
            check_containers
            check_health
            check_resources
            check_network
            check_storage
            ;;
        3)
            check_logs
            ;;
        4)
            performance_test
            ;;
        5)
            check_containers
            check_health
            check_resources
            check_logs
            check_network
            check_storage
            generate_report
            ;;
        6)
            auto_restart
            ;;
        7)
            echo -e "${BLUE}📊 Starting continuous monitoring (Press Ctrl+C to stop)...${NC}"
            while true; do
                clear
                echo -e "${BLUE}📊 Tobacco Traceability Monitoring - $(date)${NC}"
                echo "==============================================="
                check_containers
                check_health
                check_resources
                echo -e "\n${YELLOW}Next check in 30 seconds...${NC}"
                sleep 30
            done
            ;;
        8)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            main_menu
            ;;
    esac
}

# Pre-flight checks
echo -e "${BLUE}🔍 Pre-flight checks...${NC}"

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker not available${NC}"
    exit 1
fi

# Check curl
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl not available${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"

# Run main menu
main_menu
