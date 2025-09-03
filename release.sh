#!/bin/bash

# Production Release Script untuk Tobacco Traceability App
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variabel
APP_NAME="tobacco-traceability"
IMAGE_NAME="$APP_NAME-web"
REGISTRY="your-registry.com"  # Ubah sesuai registry Anda
VERSION=$(date +%Y%m%d-%H%M%S)

echo -e "${BLUE}🚀 Production Release for Tobacco Traceability${NC}"
echo "=================================================="

# Function untuk meminta konfirmasi
confirm() {
    read -p "$(echo -e "${YELLOW}$1 (y/N): ${NC}")" response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Function untuk build production image
build_production() {
    echo -e "${YELLOW}🔨 Building production image...${NC}"
    
    # Get current git tag or commit
    if git describe --tags --exact-match 2>/dev/null; then
        VERSION=$(git describe --tags --exact-match)
    else
        VERSION="v$(date +%Y%m%d)-$(git rev-parse --short HEAD)"
    fi
    
    echo -e "${BLUE}📦 Building version: $VERSION${NC}"
    
    docker build \
        --tag $IMAGE_NAME:latest \
        --tag $IMAGE_NAME:$VERSION \
        --build-arg NODE_ENV=production \
        --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
        --build-arg VERSION=$VERSION \
        --build-arg VCS_REF=$(git rev-parse --short HEAD) \
        --label "org.opencontainers.image.title=$APP_NAME" \
        --label "org.opencontainers.image.description=Tobacco Traceability Web Application" \
        --label "org.opencontainers.image.version=$VERSION" \
        --label "org.opencontainers.image.created=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --label "org.opencontainers.image.revision=$(git rev-parse HEAD)" \
        --label "org.opencontainers.image.source=$(git config --get remote.origin.url)" \
        . || {
        echo -e "${RED}❌ Production build failed${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Production image built: $IMAGE_NAME:$VERSION${NC}"
}

# Function untuk tag dan push ke registry
push_to_registry() {
    if [ -z "$REGISTRY" ] || [ "$REGISTRY" = "your-registry.com" ]; then
        echo -e "${YELLOW}⚠️  Registry not configured. Skipping push.${NC}"
        echo -e "${BLUE}💡 To enable push, edit REGISTRY variable in this script${NC}"
        return 0
    fi
    
    echo -e "${YELLOW}📤 Pushing to registry...${NC}"
    
    # Tag untuk registry
    docker tag $IMAGE_NAME:latest $REGISTRY/$IMAGE_NAME:latest
    docker tag $IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:$VERSION
    
    # Push ke registry
    docker push $REGISTRY/$IMAGE_NAME:latest
    docker push $REGISTRY/$IMAGE_NAME:$VERSION
    
    echo -e "${GREEN}✅ Images pushed to registry${NC}"
    echo -e "${BLUE}📦 Available images:${NC}"
    echo -e "   $REGISTRY/$IMAGE_NAME:latest"
    echo -e "   $REGISTRY/$IMAGE_NAME:$VERSION"
}

# Function untuk generate production docker-compose
generate_production_compose() {
    echo -e "${YELLOW}📝 Generating production docker-compose.yml...${NC}"
    
    cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  web:
    image: $REGISTRY/$IMAGE_NAME:$VERSION
    container_name: $APP_NAME-web
    ports:
      - "80:80"
      - "443:443"  # Jika menggunakan SSL
    restart: unless-stopped
    networks:
      - $APP_NAME-network
    environment:
      - NODE_ENV=production
      - VERSION=$VERSION
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.$APP_NAME.rule=Host(\`yourdomain.com\`)"
      - "traefik.http.routers.$APP_NAME.tls=true"
      - "traefik.http.routers.$APP_NAME.tls.certresolver=letsencrypt"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Uncomment untuk monitoring
  # watchtower:
  #   image: containrrr/watchtower
  #   container_name: $APP_NAME-watchtower
  #   volumes:
  #     - /var/run/docker.sock:/var/run/docker.sock
  #   environment:
  #     - WATCHTOWER_POLL_INTERVAL=300
  #     - WATCHTOWER_CLEANUP=true
  #   restart: unless-stopped

networks:
  $APP_NAME-network:
    driver: bridge
EOF

    echo -e "${GREEN}✅ Production compose file created: docker-compose.prod.yml${NC}"
}

# Function untuk create release notes
create_release_notes() {
    echo -e "${YELLOW}📋 Creating release notes...${NC}"
    
    cat > RELEASE-$VERSION.md << EOF
# Release $VERSION

**Date**: $(date)
**Image**: $REGISTRY/$IMAGE_NAME:$VERSION

## Changes
- Built from commit: $(git rev-parse HEAD)
- Branch: $(git branch --show-current)

## Deployment Instructions

\`\`\`bash
# Pull image
docker pull $REGISTRY/$IMAGE_NAME:$VERSION

# Deploy using docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Or direct run
docker run -d \\
  --name $APP_NAME-web \\
  -p 80:80 \\
  --restart unless-stopped \\
  $REGISTRY/$IMAGE_NAME:$VERSION
\`\`\`

## Health Check
- URL: http://localhost/
- Health endpoint: http://localhost/

## Rollback Instructions
\`\`\`bash
# Stop current
docker-compose -f docker-compose.prod.yml down

# Deploy previous version
docker run -d \\
  --name $APP_NAME-web \\
  -p 80:80 \\
  --restart unless-stopped \\
  $REGISTRY/$IMAGE_NAME:previous-version
\`\`\`
EOF

    echo -e "${GREEN}✅ Release notes created: RELEASE-$VERSION.md${NC}"
}

# Function untuk security scan (jika tersedia)
security_scan() {
    if command -v trivy &> /dev/null; then
        echo -e "${YELLOW}🔒 Running security scan...${NC}"
        trivy image $IMAGE_NAME:$VERSION
    else
        echo -e "${YELLOW}⚠️  Trivy not found. Skipping security scan.${NC}"
        echo -e "${BLUE}💡 Install Trivy for security scanning: https://github.com/aquasecurity/trivy${NC}"
    fi
}

# Main menu
main_menu() {
    echo -e "\n${BLUE}Select release action:${NC}"
    echo "1. Build production image"
    echo "2. Build + Push to registry"
    echo "3. Full release (Build + Push + Generate configs)"
    echo "4. Security scan only"
    echo "5. Exit"
    
    read -p "Choose option (1-5): " choice
    
    case $choice in
        1)
            build_production
            ;;
        2)
            build_production
            if confirm "Push to registry?"; then
                push_to_registry
            fi
            ;;
        3)
            build_production
            security_scan
            if confirm "Push to registry?"; then
                push_to_registry
            fi
            generate_production_compose
            create_release_notes
            echo -e "\n${GREEN}🎉 Full release completed!${NC}"
            echo -e "${BLUE}📦 Image: $IMAGE_NAME:$VERSION${NC}"
            echo -e "${BLUE}📝 Release notes: RELEASE-$VERSION.md${NC}"
            echo -e "${BLUE}🚀 Deploy with: docker-compose -f docker-compose.prod.yml up -d${NC}"
            ;;
        4)
            security_scan
            ;;
        5)
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
echo -e "${BLUE}🔍 Running pre-flight checks...${NC}"

# Check if in git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    if ! confirm "Continue with uncommitted changes?"; then
        exit 1
    fi
fi

# Check if Docker is available
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not available${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"

# Run main menu
main_menu
