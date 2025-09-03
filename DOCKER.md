# Docker Containerization Guide

Panduan lengkap untuk menjalankan Tobacco Traceability Web Application menggunakan Docker.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- 4GB+ RAM tersedia
- 10GB+ disk space

## 🚀 Quick Start

### 1. Clone dan Setup
```bash
git clone <repository-url>
cd tobacco-traceability/web-app
```

### 2. Build dan Run (Development)
```bash
# Menggunakan script deploy
./deploy.sh dev

# Atau manual
docker-compose -f docker-compose.dev.yml up --build
```

### 3. Build dan Run (Production)
```bash
# Build image
./deploy.sh build

# Deploy production
./deploy.sh deploy

# Atau manual
docker build -t tobacco-traceability-web .
docker run -d -p 3000:80 --name tobacco-traceability tobacco-traceability-web
```

## 📁 File Structure

```
.
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build  
├── docker-compose.yml      # Production orchestration
├── docker-compose.dev.yml  # Development orchestration
├── docker-compose.prod.yml # Production deployment (generated)
├── nginx.conf              # Nginx configuration
├── deploy.sh               # Deployment automation
├── release.sh              # Production release management
├── backup.sh               # Backup and restore system
├── monitor.sh              # Application monitoring
├── docker-check.sh         # System verification
├── .env.production         # Production environment variables
└── DOCKER.md              # This file
```

## �️ Available Scripts

### Deployment Script (`deploy.sh`)
```bash
./deploy.sh build      # Build production image
./deploy.sh run        # Run production container
./deploy.sh deploy     # Full deployment (build + run)
./deploy.sh dev        # Start development environment
./deploy.sh dev-down   # Stop development environment
./deploy.sh stop       # Stop all containers
./deploy.sh logs       # View container logs
./deploy.sh clean      # Clean unused Docker resources
```

### Release Management (`release.sh`)
```bash
./release.sh           # Interactive release menu
# Options:
# 1. Build production image
# 2. Build + Push to registry  
# 3. Full release (Build + Push + Generate configs)
# 4. Security scan only
# 5. Exit
```

### Backup System (`backup.sh`)
```bash
./backup.sh            # Interactive backup menu
# Options:
# 1. Full backup (data + config + database)
# 2. Data backup only
# 3. Configuration backup only
# 4. Database backup only
# 5. Restore from backup
# 6. Cleanup old backups
# 7. List available backups
```

### Monitoring (`monitor.sh`)
```bash
./monitor.sh           # Interactive monitoring menu
# Options:
# 1. Quick health check
# 2. Detailed system status
# 3. Check logs for errors
# 4. Performance test
# 5. Generate full report
# 6. Auto-restart unhealthy containers
# 7. Continuous monitoring (30s interval)
```

### System Check (`docker-check.sh`)
```bash
./docker-check.sh      # Verify Docker setup and requirements
```

## �🔧 Konfigurasi

### Environment Variables

Untuk production, Anda dapat mengatur environment variables:

```bash
# Dalam docker-compose.yml
environment:
  - NODE_ENV=production
  - REACT_APP_API_URL=https://api.yourdomain.com
  - REACT_APP_VERSION=1.0.0
```

### Port Configuration

Default port adalah 3000, untuk mengubah:

```bash
# Ubah di docker-compose.yml
ports:
  - "8080:80"  # Aplikasi akan accessible di port 8080
```

### Volume Mounting (Development)

Untuk development dengan hot reload:

```yaml
# Tambahkan ke docker-compose.yml
volumes:
  - ./src:/app/src
  - ./public:/app/public
```

## 🏥 Health Checks

Container memiliki built-in health check:
- **Interval**: 30 detik
- **Timeout**: 3 detik
- **Start Period**: 5 detik
- **Retries**: 3 kali

```bash
# Check health status
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## 📊 Monitoring & Logs

```bash
# Real-time logs
docker logs -f tobacco-traceability-web

# Logs dengan timestamp
docker logs -t tobacco-traceability-web

# Last 100 lines
docker logs --tail 100 tobacco-traceability-web
```

## 🚀 Production Deployment

### 1. Registry Push

```bash
# Tag untuk registry
docker tag tobacco-traceability-web your-registry.com/tobacco-traceability-web:latest

# Push ke registry
docker push your-registry.com/tobacco-traceability-web:latest
```

### 2. Production Environment

```bash
# Production docker-compose
version: '3.8'
services:
  web:
    image: your-registry.com/tobacco-traceability-web:latest
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### 3. Reverse Proxy (Nginx/Traefik)

Untuk production dengan SSL dan custom domain:

```nginx
# /etc/nginx/sites-available/tobacco-traceability
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Port sudah digunakan**
   ```bash
   # Check port usage
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

2. **Build gagal karena dependency**
   ```bash
   # Clear npm cache
   docker build --no-cache -t tobacco-traceability-web .
   ```

3. **Container tidak bisa start**
   ```bash
   # Check logs
   docker logs tobacco-traceability-web
   
   # Check container status
   docker ps -a
   ```

### Performance Optimization

1. **Multi-stage build** sudah digunakan untuk ukuran image minimal
2. **Nginx gzip compression** sudah dikonfigurasi
3. **Static asset caching** sudah diset untuk 1 tahun
4. **Security headers** sudah ditambahkan

## 📝 Development Notes

- Image menggunakan `node:18-alpine` untuk build stage
- Production menggunakan `nginx:alpine` untuk serving
- Build artifacts di-copy ke `/usr/share/nginx/html`
- Nginx dikonfigurasi untuk mendukung React Router (SPA)
- Health check menggunakan curl ke root path

## 🤝 Contributing

Untuk kontribusi pada Docker setup:
1. Test perubahan di local environment
2. Update dokumentasi jika diperlukan
3. Pastikan security best practices diterapkan
4. Test di production-like environment

---

**Happy Dockering! 🐳**
