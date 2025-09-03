# 🌿 Tobacco Traceability System

<div align="center">

![Tobacco Traceability](https://img.shields.io/badge/Tobacco-Traceability-green?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Sistem pelacakan komprehensif untuk industri tembakau dengan manajemen lahan, fase tanam, dan aksesibilitas infrastruktur**

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📖 Documentation](#-documentation)

</div>

---

## 📖 Overview

**Tobacco Traceability System** adalah aplikasi web modern yang dirancang khusus untuk industri tembakau di Indonesia. Sistem ini menyediakan solusi terintegrasi untuk melacak dan mengelola seluruh aspek produksi tembakau, mulai dari manajemen lahan hingga monitoring fase tanam.

### 🎯 Tujuan Sistem

- **Transparansi Produksi**: Memberikan visibilitas penuh terhadap proses produksi tembakau
- **Efisiensi Manajemen**: Mengoptimalkan pengelolaan lahan dan sumber daya pertanian
- **Kualitas Kontrol**: Memastikan standar kualitas melalui monitoring fase tanam
- **Aksesibilitas Data**: Menyediakan akses mudah ke informasi infrastruktur dan logistik

---

## ✨ Features

### 🗺️ **Manajemen Peta Lahan**
- **Interactive Mapping**: Peta interaktif menggunakan Leaflet untuk visualisasi plot lahan
- **Plot Management**: Manajemen detail setiap petak lahan petani
- **Koordinat GPS**: Integrasi sistem koordinat untuk akurasi lokasi
- **Multi-layer View**: Tampilan berlapis untuk berbagai jenis informasi geografis

### 🌱 **Fase Tanam Tembakau**
- **Konfigurasi Fase**: Setup dan konfigurasi tahapan pertumbuhan tembakau
- **Timeline Tracking**: Pelacakan waktu dan durasi setiap fase pertumbuhan
- **Progress Monitoring**: Monitoring kemajuan tanaman dalam setiap fase
- **Automated Alerts**: Notifikasi otomatis untuk transisi antar fase

### 🛣️ **Aksesibilitas Jalan**
- **Road Network**: Database komprehensif jaringan jalan akses ke lahan
- **Condition Monitoring**: Monitoring kondisi jalan dan infrastruktur
- **Facility Mapping**: Pemetaan fasilitas pendukung aksesibilitas
- **Maintenance Tracking**: Pelacakan kebutuhan pemeliharaan infrastruktur

### 🎨 **User Experience**
- **Dark/Light Mode**: Theme switching dengan persistensi preferensi
- **Responsive Design**: Desain responsif untuk semua ukuran perangkat
- **Intuitive Interface**: Antarmuka yang user-friendly dan mudah digunakan
- **Real-time Updates**: Update data secara real-time

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.0+**: Modern UI library dengan hooks dan concurrent features
- **TypeScript 5.0+**: Type-safe development dengan IntelliSense
- **Vite**: Lightning-fast build tool dan development server
- **Tailwind CSS v4**: Utility-first CSS framework dengan custom design system

### **UI Components**
- **HeroUI**: Modern React component library
- **Lucide React**: Beautiful SVG icon library
- **React Router**: Client-side routing untuk SPA

### **Mapping & Visualization**
- **Leaflet**: Open-source interactive maps
- **React Leaflet**: React components untuk Leaflet integration

### **Development & Build**
- **ESLint**: Code linting dan quality assurance
- **PostCSS**: CSS processing dan optimization
- **Autoprefixer**: Automatic vendor prefixing

### **Containerization**
- **Docker**: Container platform untuk deployment
- **Docker Compose**: Multi-container application orchestration
- **Nginx**: High-performance web server untuk production

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0+
- npm atau yarn
- Git
- Docker (optional, untuk containerized deployment)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/tobacco-traceability.git
cd tobacco-traceability/web-app
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
```

### 3. Start Development Server
```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan tersedia di `http://localhost:5173`

### 4. Build untuk Production
```bash
npm run build
# atau
yarn build
```

---

## 🐳 Docker Deployment

### Quick Docker Start
```bash
# Development mode dengan hot reload
./deploy.sh dev

# Production mode
./deploy.sh build
./deploy.sh deploy
```

### Docker Commands
```bash
# System check
./docker-check.sh

# Full deployment
./deploy.sh deploy

# Monitoring
./monitor.sh

# Backup system
./backup.sh

# Production release
./release.sh
```

Lihat [Docker Documentation](./README-DOCKER.md) untuk panduan lengkap.

---

## 📁 Project Structure

```
tobacco-traceability/web-app/
├── 📂 src/
│   ├── 📂 components/          # React components
│   │   ├── 📂 lahan/          # Komponen manajemen lahan
│   │   ├── 📂 fase-tanam/     # Komponen fase tanam
│   │   ├── 📂 aksesibilitas/  # Komponen aksesibilitas
│   │   └── 📂 ui/             # UI components & theme
│   ├── 📂 pages/              # Page components
│   ├── 📂 types/              # TypeScript type definitions
│   ├── 📂 data/               # Sample data & constants
│   ├── 📂 providers/          # React context providers
│   └── 📂 lib/                # Utility functions
├── 📂 public/                 # Static assets
├── 📂 docker/                 # Docker configuration
│   ├── 🐳 Dockerfile         # Production container
│   ├── 🐳 Dockerfile.dev     # Development container
│   ├── ⚙️ nginx.conf         # Nginx configuration
│   └── 🔧 docker-compose.*   # Container orchestration
├── 📂 scripts/                # Automation scripts
│   ├── 🚀 deploy.sh          # Deployment automation
│   ├── 📦 release.sh         # Release management
│   ├── 💾 backup.sh          # Backup system
│   └── 📊 monitor.sh         # Monitoring tools
└── 📚 docs/                   # Documentation
```

---

## 🎮 Usage Guide

### 📍 **Mengakses Peta Lahan**
1. Navigasi ke menu **"Lahan (Peta Lahan)"**
2. Gunakan kontrol peta untuk zoom dan pan
3. Klik pada plot untuk melihat detail lahan
4. Gunakan layer controls untuk toggle informasi berbeda

### 🌿 **Mengelola Fase Tanam**
1. Buka menu **"Fase Tanam"**
2. Klik **"Tambah Fase"** untuk membuat konfigurasi baru
3. Isi detail fase: nama, deskripsi, durasi, dan persyaratan
4. Simpan dan gunakan untuk tracking tanaman

### 🛤️ **Monitoring Aksesibilitas**
1. Akses menu **"Aksesibilitas Jalan"**
2. Lihat daftar jalan dan kondisinya
3. Klik **"Edit"** untuk update informasi jalan
4. Gunakan filter untuk mencari jalan spesifik

---

## 🔧 Configuration

### Environment Variables
```bash
# .env.local
VITE_APP_TITLE="Tobacco Traceability"
VITE_MAP_DEFAULT_LAT=-7.977
VITE_MAP_DEFAULT_LNG=112.633
VITE_MAP_DEFAULT_ZOOM=13
```

### Theme Configuration
```typescript
// src/providers/theme-provider.tsx
const themes = {
  light: "light",
  dark: "dark",
  system: "system"
}
```

### Map Configuration
```typescript
// src/components/lahan/PetaLahan.tsx
const mapConfig = {
  center: [-7.977, 112.633],
  zoom: 13,
  maxZoom: 18
}
```

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 📊 Performance

### Build Optimization
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization
- **Gzip Compression**: Server-side compression untuk production

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

---

## 🚀 Deployment

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Production Options

#### 1. Static Hosting
```bash
npm run build
# Upload dist/ folder ke hosting provider
```

#### 2. Docker Container
```bash
./deploy.sh build    # Build container
./deploy.sh deploy   # Deploy container
```

#### 3. Container Registry
```bash
./release.sh         # Full release process
```

---

## 🔒 Security

### Security Features
- **CSP Headers**: Content Security Policy untuk XSS protection
- **HTTPS Ready**: SSL/TLS configuration untuk production
- **Input Validation**: Client-side validation untuk semua forms
- **Secure Headers**: Security headers di nginx configuration

### Security Best Practices
- Regular dependency updates
- Environment variable protection
- Access control implementation
- Security scanning dengan Trivy

---

## 📈 Monitoring & Analytics

### Health Monitoring
```bash
./monitor.sh         # Application monitoring
./backup.sh          # Data backup system
```

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Bundle Size**: Automated bundle size tracking
- **Load Performance**: Application startup time monitoring

---

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Pull Request Guidelines
- Clear description of changes
- Unit tests for new features
- Documentation updates
- Performance impact assessment

---

## 🐛 Troubleshooting

### Common Issues

#### Theme Toggle Not Working
```bash
# Check localStorage persistence
localStorage.getItem('theme')

# Clear theme data
localStorage.removeItem('theme')
```

#### Map Not Loading
```bash
# Check Leaflet CSS import
# Verify coordinate format
# Check network connectivity
```

#### Docker Issues
```bash
# Check Docker daemon
./docker-check.sh

# Clean rebuild
./deploy.sh clean
./deploy.sh build
```

### Getting Help
- 📖 Check [Documentation](./DOCKER.md)
- 🐛 Report [Issues](https://github.com/your-username/tobacco-traceability/issues)
- 💬 Join [Discussions](https://github.com/your-username/tobacco-traceability/discussions)

---

## 📝 Changelog

### Version 1.0.0 (September 2025)
- ✨ Initial release
- 🗺️ Interactive land mapping dengan Leaflet
- 🌱 Comprehensive farming phase management
- 🛣️ Road accessibility master data
- 🎨 Dark/Light theme support
- 🐳 Complete Docker containerization
- 📊 Monitoring dan backup systems

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

### Core Contributors
- **Lead Developer**: [Your Name](https://github.com/your-username)
- **UI/UX Designer**: [Designer Name](https://github.com/designer-username)
- **DevOps Engineer**: [DevOps Name](https://github.com/devops-username)

### Acknowledgments
- Indonesian tobacco farmers untuk insights dan requirements
- Open source community untuk amazing tools dan libraries
- [Leaflet](https://leafletjs.com/) untuk mapping capabilities
- [HeroUI](https://heroui.com/) untuk beautiful components

---

## 🌟 Support

If you found this project helpful, please give it a ⭐️!

### Sponsor
Support the development of this project:
- ☕ [Buy me a coffee](https://buymeacoffee.com/your-username)
- 💝 [GitHub Sponsors](https://github.com/sponsors/your-username)

---

<div align="center">

**Made with ❤️ for Indonesian tobacco farmers**

[🏠 Home](https://your-domain.com) • [📧 Contact](mailto:your-email@domain.com) • [🐦 Twitter](https://twitter.com/your-username)

</div>
