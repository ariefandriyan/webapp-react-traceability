# 🐳 Docker Deployment untuk Tobacco Traceability

Panduan lengkap deployment aplikasi Tobacco Traceability menggunakan Docker dengan script otomatis.

## 🚀 Quick Start

### 1. Persiapan Sistem
```bash
# Check sistem requirements
./docker-check.sh

# Jika Docker belum berjalan, start terlebih dahulu:
# macOS/Windows: Open Docker Desktop
# Linux: sudo systemctl start docker
```

### 2. Development Mode (Recommended untuk testing)
```bash
# Start development environment dengan hot reload
./deploy.sh dev

# Aplikasi akan tersedia di http://localhost:5173
# File akan ter-sync otomatis untuk development
```

### 3. Production Mode
```bash
# Build dan deploy untuk production
./deploy.sh build
./deploy.sh deploy

# Aplikasi akan tersedia di http://localhost:3000
```

## 📋 Complete Workflow

### Development Workflow
```bash
# 1. Start development
./deploy.sh dev

# 2. Develop your code (changes auto-reload)
# Edit files in src/, public/, etc.

# 3. View logs (optional)
./deploy.sh logs

# 4. Stop when done
./deploy.sh dev-down
```

### Production Workflow
```bash
# 1. Build optimized image
./deploy.sh build

# 2. Deploy to production
./deploy.sh deploy

# 3. Monitor application
./monitor.sh

# 4. Backup data (optional)
./backup.sh
```

### Release Workflow
```bash
# 1. Create production release
./release.sh

# 2. Choose option 3 for full release
# This will:
# - Build optimized image with version tags
# - Run security scan
# - Generate production configs
# - Create release notes

# 3. Deploy using generated configs
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Setup
```bash
# Copy and edit production environment
cp .env.production .env.local

# Edit settings sesuai kebutuhan:
# - DOCKER_REGISTRY: Your container registry
# - DOMAIN: Your production domain
# - SSL certificates paths
```

### Registry Configuration
Edit `release.sh` untuk mengatur registry:
```bash
# Line 15 di release.sh
REGISTRY="your-registry.com"  # Ubah ke registry Anda
```

Contoh konfigurasi registry:
- Docker Hub: `username`
- AWS ECR: `123456789.dkr.ecr.region.amazonaws.com`
- Google GCR: `gcr.io/project-id`
- Azure ACR: `registry.azurecr.io`

## 📊 Monitoring & Maintenance

### Real-time Monitoring
```bash
# Continuous monitoring dashboard
./monitor.sh
# Pilih option 7 untuk monitoring real-time

# Quick health check
./monitor.sh
# Pilih option 1 untuk quick check
```

### Log Analysis
```bash
# View real-time logs
./deploy.sh logs

# View logs melalui monitoring script
./monitor.sh
# Pilih option 3 untuk analisis error logs
```

### Backup & Restore
```bash
# Full backup
./backup.sh
# Pilih option 1 untuk backup lengkap

# Restore dari backup
./backup.sh
# Pilih option 5 untuk restore
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Docker Daemon Not Running
```bash
Error: Cannot connect to the Docker daemon

Solution:
# macOS/Windows: Start Docker Desktop
# Linux: sudo systemctl start docker
```

#### 2. Port Already in Use
```bash
Error: bind: address already in use

Solution:
# Check what's using the port
lsof -i :3000  # or :5173 for dev

# Stop the process or change port in docker-compose files
```

#### 3. Build Failures
```bash
# Clear Docker cache
./deploy.sh clean

# Rebuild without cache
docker build --no-cache -t tobacco-traceability-web .
```

#### 4. Permission Issues
```bash
# Make scripts executable
chmod +x *.sh

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker
```

### Health Checks

```bash
# Manual health checks
curl -f http://localhost:3000/  # Production
curl -f http://localhost:5173/  # Development

# Container status
docker ps | grep tobacco

# Resource usage
docker stats
```

## 📦 File Outputs

Script akan menghasilkan file-file berikut:

### Release Files
- `docker-compose.prod.yml` - Production compose file
- `RELEASE-{version}.md` - Release notes with deployment instructions

### Backup Files
- `/backup/{timestamp}/` - Backup directories
- `backup-manifest.json` - Backup metadata
- Database dumps dan volume backups

### Monitoring Reports
- `health-report-{timestamp}.txt` - System health reports

## 🔒 Security Considerations

### Image Security
```bash
# Security scan dengan Trivy (install terlebih dahulu)
brew install trivy  # macOS
# atau install sesuai OS Anda

# Scan akan otomatis dijalankan dalam release.sh
```

### Production Security
- Gunakan HTTPS dengan SSL certificates
- Set proper environment variables
- Konfigurasikan firewall untuk port yang tepat
- Regular security updates

## 🌐 Production Deployment Options

### Option 1: Direct Docker Run
```bash
./deploy.sh deploy
# Aplikasi di http://localhost:3000
```

### Option 2: Docker Compose Production
```bash
./release.sh  # Generate production configs
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: Container Registry
```bash
# Build dan push ke registry
./release.sh  # Choose option 2

# Pull dan run di server production
docker pull your-registry.com/tobacco-traceability-web:latest
docker run -d -p 80:80 your-registry.com/tobacco-traceability-web:latest
```

## 📞 Support

Jika mengalami masalah:

1. **Check system requirements**: `./docker-check.sh`
2. **View logs**: `./deploy.sh logs`
3. **Health check**: `./monitor.sh` → option 1
4. **Clean rebuild**: `./deploy.sh clean` then `./deploy.sh build`

Untuk development:
- Development server: http://localhost:5173
- Hot reload: Enabled otomatis
- Source maps: Available untuk debugging

Untuk production:
- Production server: http://localhost:3000
- Optimized build: Gzip compression, minified assets
- Health checks: Built-in monitoring
