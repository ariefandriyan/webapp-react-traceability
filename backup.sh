#!/bin/bash

# Backup Script for Tobacco Traceability Application
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_NAME="tobacco-traceability"
BACKUP_DIR="/backup"
S3_BUCKET="${BACKUP_S3_BUCKET:-tobacco-traceability-backup}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}🗄️  Tobacco Traceability Backup System${NC}"
echo "====================================="

# Function untuk backup container volumes
backup_volumes() {
    echo -e "${YELLOW}📦 Backing up application data...${NC}"
    
    # Create backup directory
    mkdir -p $BACKUP_DIR/$TIMESTAMP
    
    # Backup application data (jika ada persistent data)
    if docker volume ls | grep -q "${APP_NAME}_data"; then
        echo -e "${BLUE}💾 Backing up application data volume...${NC}"
        docker run --rm \
            -v ${APP_NAME}_data:/source:ro \
            -v $BACKUP_DIR/$TIMESTAMP:/backup \
            alpine:latest \
            tar czf /backup/app-data.tar.gz -C /source .
    fi
    
    # Backup nginx config (jika customized)
    if docker volume ls | grep -q "${APP_NAME}_nginx"; then
        echo -e "${BLUE}⚙️  Backing up nginx configuration...${NC}"
        docker run --rm \
            -v ${APP_NAME}_nginx:/source:ro \
            -v $BACKUP_DIR/$TIMESTAMP:/backup \
            alpine:latest \
            tar czf /backup/nginx-config.tar.gz -C /source .
    fi
    
    echo -e "${GREEN}✅ Volume backup completed${NC}"
}

# Function untuk backup database (jika ada)
backup_database() {
    if docker ps | grep -q "${APP_NAME}-db"; then
        echo -e "${YELLOW}🗃️  Backing up database...${NC}"
        
        # PostgreSQL backup
        docker exec ${APP_NAME}-db pg_dump -U postgres tobacco_traceability > $BACKUP_DIR/$TIMESTAMP/database.sql
        
        # Compress database backup
        gzip $BACKUP_DIR/$TIMESTAMP/database.sql
        
        echo -e "${GREEN}✅ Database backup completed${NC}"
    else
        echo -e "${BLUE}ℹ️  No database container found, skipping database backup${NC}"
    fi
}

# Function untuk backup configurations
backup_configs() {
    echo -e "${YELLOW}📋 Backing up configurations...${NC}"
    
    # Backup docker-compose files
    cp docker-compose*.yml $BACKUP_DIR/$TIMESTAMP/ 2>/dev/null || true
    
    # Backup environment files
    cp .env* $BACKUP_DIR/$TIMESTAMP/ 2>/dev/null || true
    
    # Backup nginx config
    cp nginx.conf $BACKUP_DIR/$TIMESTAMP/ 2>/dev/null || true
    
    # Create backup manifest
    cat > $BACKUP_DIR/$TIMESTAMP/backup-manifest.json << EOF
{
    "timestamp": "$TIMESTAMP",
    "date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "application": "$APP_NAME",
    "version": "$(docker images --format 'table {{.Tag}}' ${APP_NAME}-web | tail -n +2 | head -1)",
    "backup_type": "full",
    "files": [
        $(ls -1 $BACKUP_DIR/$TIMESTAMP/ | sed 's/.*/"&"/' | paste -sd, -)
    ]
}
EOF
    
    echo -e "${GREEN}✅ Configuration backup completed${NC}"
}

# Function untuk upload ke S3 (jika configured)
upload_to_s3() {
    if command -v aws &> /dev/null && [ -n "$S3_BUCKET" ]; then
        echo -e "${YELLOW}☁️  Uploading to S3...${NC}"
        
        # Create archive
        tar czf $BACKUP_DIR/${APP_NAME}_backup_$TIMESTAMP.tar.gz -C $BACKUP_DIR $TIMESTAMP
        
        # Upload to S3
        aws s3 cp $BACKUP_DIR/${APP_NAME}_backup_$TIMESTAMP.tar.gz s3://$S3_BUCKET/backups/
        
        # Remove local archive after upload
        rm $BACKUP_DIR/${APP_NAME}_backup_$TIMESTAMP.tar.gz
        
        echo -e "${GREEN}✅ Backup uploaded to S3${NC}"
    else
        echo -e "${BLUE}ℹ️  S3 not configured or AWS CLI not available${NC}"
    fi
}

# Function untuk cleanup old backups
cleanup_old_backups() {
    echo -e "${YELLOW}🧹 Cleaning up old backups...${NC}"
    
    # Local cleanup
    find $BACKUP_DIR -type d -name "*_*" -mtime +$RETENTION_DAYS -exec rm -rf {} \; 2>/dev/null || true
    
    # S3 cleanup (jika configured)
    if command -v aws &> /dev/null && [ -n "$S3_BUCKET" ]; then
        echo -e "${BLUE}☁️  Cleaning up old S3 backups...${NC}"
        cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)
        aws s3api list-objects-v2 --bucket $S3_BUCKET --prefix backups/ --query "Contents[?LastModified<'$cutoff_date'].Key" --output text | \
        while read key; do
            if [ -n "$key" ]; then
                aws s3 rm s3://$S3_BUCKET/$key
            fi
        done
    fi
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Function untuk restore backup
restore_backup() {
    echo -e "${YELLOW}🔄 Restore functionality${NC}"
    echo -e "${BLUE}Available backups:${NC}"
    
    ls -la $BACKUP_DIR/ | grep "^d" | grep -E "[0-9]{8}_[0-9]{6}" | awk '{print $9}' | sort -r | head -10
    
    echo ""
    read -p "Enter backup timestamp to restore (or 'cancel'): " backup_timestamp
    
    if [ "$backup_timestamp" = "cancel" ]; then
        echo -e "${YELLOW}Restore cancelled${NC}"
        return
    fi
    
    if [ ! -d "$BACKUP_DIR/$backup_timestamp" ]; then
        echo -e "${RED}❌ Backup not found${NC}"
        return
    fi
    
    echo -e "${YELLOW}⚠️  WARNING: This will replace current application data!${NC}"
    read -p "Are you sure you want to continue? (type 'YES' to confirm): " confirm
    
    if [ "$confirm" != "YES" ]; then
        echo -e "${YELLOW}Restore cancelled${NC}"
        return
    fi
    
    echo -e "${BLUE}🔄 Restoring from backup $backup_timestamp...${NC}"
    
    # Stop application
    docker-compose down
    
    # Restore volumes
    if [ -f "$BACKUP_DIR/$backup_timestamp/app-data.tar.gz" ]; then
        docker run --rm \
            -v ${APP_NAME}_data:/target \
            -v $BACKUP_DIR/$backup_timestamp:/backup \
            alpine:latest \
            sh -c "cd /target && tar xzf /backup/app-data.tar.gz"
    fi
    
    # Restore database
    if [ -f "$BACKUP_DIR/$backup_timestamp/database.sql.gz" ]; then
        # Start database only
        docker-compose up -d db
        sleep 10
        
        # Restore database
        zcat $BACKUP_DIR/$backup_timestamp/database.sql.gz | docker exec -i ${APP_NAME}-db psql -U postgres tobacco_traceability
    fi
    
    # Start application
    docker-compose up -d
    
    echo -e "${GREEN}✅ Restore completed${NC}"
}

# Main menu
main_menu() {
    echo -e "\n${BLUE}Backup Operations:${NC}"
    echo "1. Full backup (data + config + database)"
    echo "2. Data backup only"
    echo "3. Configuration backup only"
    echo "4. Database backup only"
    echo "5. Restore from backup"
    echo "6. Cleanup old backups"
    echo "7. List available backups"
    echo "8. Exit"
    
    read -p "Choose option (1-8): " choice
    
    case $choice in
        1)
            backup_volumes
            backup_database
            backup_configs
            upload_to_s3
            cleanup_old_backups
            echo -e "\n${GREEN}🎉 Full backup completed!${NC}"
            ;;
        2)
            backup_volumes
            echo -e "\n${GREEN}✅ Data backup completed!${NC}"
            ;;
        3)
            backup_configs
            echo -e "\n${GREEN}✅ Configuration backup completed!${NC}"
            ;;
        4)
            backup_database
            echo -e "\n${GREEN}✅ Database backup completed!${NC}"
            ;;
        5)
            restore_backup
            ;;
        6)
            cleanup_old_backups
            ;;
        7)
            echo -e "\n${BLUE}Available backups:${NC}"
            ls -la $BACKUP_DIR/ | grep "^d" | grep -E "[0-9]{8}_[0-9]{6}" | awk '{print $9}' | sort -r
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

# Create backup directory
mkdir -p $BACKUP_DIR

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker not available${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"

# Run main menu
main_menu
