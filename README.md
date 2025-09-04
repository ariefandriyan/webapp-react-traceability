# 🌿 Tobacco Traceability System - Universitas Brawijaya

<div align="center">

![Tobacco Traceability](https://img.shields.io/badge/Tobacco-Traceability-green?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Sistem manajemen traceability tembakau komprehensif dengan dukungan Dark/Light Mode, manajemen pertanian terintegrasi, dan interface modern**

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🏗️ Architecture](#️-architecture) • [🛠️ Tech Stack](#️-tech-stack) • [📖 Documentation](#-documentation)

</div>

---

## 📖 Overview

**Tobacco Traceability System** adalah aplikasi web enterprise-grade yang dirancang khusus untuk mendukung transparansi dan manajemen kualitas produksi tembakau di Indonesia. Dikembangkan untuk Universitas Brawijaya, sistem ini menyediakan solusi terintegrasi untuk melacak seluruh rantai pasok tembakau mulai dari penanaman hingga distribusi.

### 🎯 Tujuan Sistem

- **🔍 Transparansi Lengkap**: Visibilitas penuh terhadap seluruh proses produksi tembakau
- **⚡ Efisiensi Operasional**: Optimasi pengelolaan lahan, petani, dan sumber daya pertanian
- **✅ Quality Assurance**: Kontrol kualitas melalui monitoring fase tanam dan penggunaan pestisida
- **📊 Data-Driven Decisions**: Analytics dan reporting untuk pengambilan keputusan strategis
- **🤝 Stakeholder Management**: Platform terintegrasi untuk semua pemangku kepentingan

---

## ✨ Features

### 🌱 **Manajemen Pertanian Terintegrasi**
- **📅 Kalendar Tanam**: Perencanaan dan tracking jadwal tanam per musim
- **🌾 Fase Tanam Tembakau**: Monitoring detail setiap tahap pertumbuhan tanaman
- **🧪 Manajemen Pestisida**: Tracking penggunaan pestisida dan compliance
- **👥 Kelompok Tani**: Manajemen data petani dan kelompok tani
- **🌿 Varietas Tembakau**: Database komprehensif varietas tembakau

### 🗺️ **Sistem Pemetaan & Lokasi**
- **🗺️ Peta Lahan Interaktif**: Visualisasi plot lahan menggunakan Leaflet
- **📍 GPS Tracking**: Integrasi koordinat GPS untuk akurasi lokasi
- **🛣️ Aksesibilitas Jalan**: Monitoring infrastruktur akses ke lahan
- **🏢 Fasilitas Pendukung**: Pemetaan gudang, infrastruktur, dan fasilitas

### 📊 **Reporting & Analytics**
- **📈 Dashboard Analytics**: Real-time dashboard dengan visualisasi data
- **📋 Laporan Komprehensif**: Generate laporan sesuai kebutuhan
- **📊 Export Data**: Export ke berbagai format (PDF, Excel, CSV)
- **📅 Historical Data**: Tracking data historis untuk analisis trend

### ⚙️ **Manajemen Sistem**
- **👤 User Management**: Kontrol pengguna dengan role-based access
- **🔐 Hak Akses**: Sistem permission dengan tree-view interface
- **🎛️ Pengaturan Aplikasi**: Konfigurasi sistem yang fleksibel
- **🌙 Theme Management**: Dark/Light mode dengan localStorage persistence

### 🎨 **User Experience Modern**
- **🌓 Dark/Light Mode**: Theme switching dengan deteksi sistem otomatis
- **📱 Responsive Design**: Optimized untuk desktop, tablet, dan mobile
- **🚀 Performance**: Fast loading dengan lazy loading dan optimisasi
- **♿ Accessibility**: WCAG compliant untuk semua pengguna

---

## �️ Architecture

### 📁 **Struktur Proyek**

```
src/
├── 📱 components/           # Komponen UI yang dapat digunakan kembali
│   ├── activities/         # Komponen untuk aktivitas pertanian
│   ├── aksesibilitas/      # Komponen manajemen aksesibilitas
│   ├── approval/           # Komponen workflow approval
│   ├── dashboard/          # Komponen dashboard dan analytics
│   ├── fase-tanam/         # Komponen manajemen fase tanam
│   ├── kelompok-tani/      # Komponen kelompok tani
│   ├── layout/             # Komponen layout dan navigasi
│   ├── map/                # Komponen peta dan visualisasi geografis
│   ├── pestisida/          # Komponen manajemen pestisida
│   ├── petani/             # Komponen data petani
│   ├── reports/            # Komponen sistem reporting
│   ├── settings/           # Komponen pengaturan sistem
│   ├── traceability/       # Komponen tracking dan traceability
│   ├── ui/                 # Komponen UI primitif (buttons, forms, dll)
│   └── varietas/           # Komponen varietas tembakau
│
├── 📄 pages/               # Halaman utama aplikasi
│   ├── master-data/        # Halaman master data
│   ├── dashboard.tsx       # Dashboard utama
│   ├── login.tsx           # Halaman autentikasi
│   ├── LahanPetaPage.tsx   # Halaman peta lahan
│   ├── FaseTanamPage.tsx   # Halaman fase tanam
│   ├── PestisidaPage.tsx   # Halaman pestisida
│   └── AksesibilitasPage.tsx # Halaman aksesibilitas
│
├── 🎮 controllers/         # Logic controllers dan navigation
├── 🔗 contexts/           # React Context untuk state management
├── 🪝 hooks/              # Custom React hooks
├── 🏗️ layouts/            # Layout components
├── 🔧 lib/                # Utility libraries dan helpers
├── 🌐 services/           # API services dan data fetching
├── 🎨 styles/             # Global styles dan Tailwind config
├── 📝 types/              # TypeScript type definitions
└── ⚙️ config/             # Configuration files
```

### 🔄 **Data Flow Architecture**

```mermaid
graph TD
    A[User Interface] --> B[Controllers]
    B --> C[Services]
    C --> D[API/Backend]
    C --> E[Local Storage]
    F[Context Providers] --> A
    G[Custom Hooks] --> A
    H[Types] --> B
    H --> C
```

### 🎨 **Component Architecture**

- **📱 Presentational Components**: UI components fokus pada tampilan
- **🧠 Container Components**: Components dengan business logic
- **🔗 Context Providers**: Global state management
- **🪝 Custom Hooks**: Reusable logic dan side effects
- **🎮 Controllers**: Navigation dan flow control

---

## 🛠️ Tech Stack

### **Frontend Core**
- **⚛️ React 18.0+**: Modern UI library dengan concurrent features
- **📘 TypeScript 5.0+**: Type-safe development dengan IntelliSense yang kuat
- **⚡ Vite**: Lightning-fast build tool dan development server
- **🎨 Tailwind CSS**: Utility-first CSS framework dengan design system

### **UI & Styling**
- **🎭 Theme Management**: Custom dark/light mode system dengan localStorage
- **📱 Responsive Design**: Mobile-first approach dengan breakpoint optimization
- **🎨 Glass Morphism**: Modern UI effects dengan backdrop blur
- **🎯 Component Library**: Custom component library dengan TypeScript

### **Navigation & Routing**
- **🗺️ React Router**: Client-side routing untuk SPA
- **🎮 Custom Controllers**: Navigation controller dengan redirect handling
- **🔗 Deep Linking**: URL-based navigation dengan state preservation

### **Maps & Visualization**
- **🗺️ Leaflet**: Open-source interactive maps
- **⚛️ React Leaflet**: React integration untuk Leaflet
- **📊 Chart Libraries**: Data visualization components

### **State Management**
- **🔗 React Context**: Global state management
- **🪝 Custom Hooks**: Encapsulated state logic
- **💾 localStorage**: Persistent data storage

### **Development Tools**
- **🔍 ESLint**: Code linting dan quality assurance
- **🎨 PostCSS**: CSS processing dengan Autoprefixer
- **🔧 TypeScript Strict Mode**: Enhanced type checking
- **📦 Module Resolution**: Path mapping dan imports optimization

### **Build & Deployment**
- **🐳 Docker**: Containerization untuk consistent deployment
- **🔄 Docker Compose**: Multi-container orchestration
- **🌐 Nginx**: High-performance web server
- **☁️ Vercel Ready**: Optimized untuk cloud deployment

---

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18.0+** atau 20.0+ (Recommended)
- **npm 9.0+** atau **yarn 1.22+**
- **Git** untuk version control
- **Docker 24.0+** (Optional, untuk containerized deployment)

### 1. Clone Repository
```bash
git clone https://github.com/ub-tobacco-traceability/web-app.git
cd web-app
```

### 2. Install Dependencies
```bash
# Menggunakan npm (recommended)
npm install

# Atau menggunakan yarn
yarn install
```

### 3. Development Setup
```bash
# Start development server dengan hot reload
npm run dev

# Atau dengan yarn
yarn dev
```

Aplikasi akan tersedia di `http://localhost:5173`

### 4. Build untuk Production
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🐳 Docker Deployment

### 🚀 Quick Docker Start
```bash
# Development mode dengan hot reload
./deploy.sh dev

# Production build dan deployment
./deploy.sh build
./deploy.sh deploy
```

### 🔧 Docker Commands Lengkap
```bash
# System health check
./docker-check.sh

# Full production deployment
./deploy.sh deploy

# Monitoring dan logging
./monitor.sh

# Backup system data
./backup.sh

# Production release dengan versioning
./release.sh
```

### 🐳 Manual Docker Commands
```bash
# Development mode
docker-compose -f docker-compose.dev.yml up --build

# Production mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

Lihat [**Docker Documentation**](./README-DOCKER.md) untuk panduan deployment lengkap.

---

## 🎮 User Guide

### � **Autentikasi & Theme**
1. **Login**: Akses halaman login dengan theme toggle di pojok kanan atas
2. **Theme Mode**: Switch antara Light/Dark mode dengan auto-detection sistem
3. **Persistent Preferences**: Tema tersimpan otomatis di localStorage

### � **Dashboard Utama**
1. **Analytics Overview**: Lihat ringkasan data terbaru
2. **Quick Actions**: Akses cepat ke fitur-fitur utama
3. **Real-time Updates**: Data ter-update secara real-time

### �️ **Manajemen Peta Lahan**
1. Navigasi ke **"Lahan (Peta Lahan)"**
2. Gunakan kontrol peta untuk zoom dan navigasi
3. Klik pada plot lahan untuk detail informasi
4. Toggle layer untuk informasi berbeda

### � **Fase Tanam Tembakau**
1. Buka menu **"Fase Tanam"**
2. **Tambah Fase Baru**: Klik tombol "Tambah Tanam Baru"
3. **Update Fase**: Edit fase tanam yang sedang berjalan
4. **Monitoring**: Track progress setiap fase pertumbuhan

### 🧪 **Manajemen Pestisida**
1. Akses **"Pestisida"** dari menu utama
2. **Update Penggunaan**: Record penggunaan pestisida per plot
3. **Compliance Tracking**: Monitor kepatuhan regulasi
4. **Historical Data**: Lihat riwayat penggunaan

### 📅 **Kalender Tanam**
1. Gunakan **Kalender Tanam** untuk perencanaan
2. **Jadwal Musim**: Set jadwal tanam per musim
3. **Notifikasi**: Dapat reminder untuk aktivitas penting
4. **Koordinasi**: Sinkronisasi antar kelompok tani

### � **Sistem Reporting**
1. **Generate Laporan**: Buat laporan sesuai kebutuhan
2. **Export Data**: Download dalam format PDF, Excel, CSV
3. **Filter & Search**: Cari data dengan filter advanced
4. **Scheduled Reports**: Set laporan otomatis

### ⚙️ **Pengaturan Sistem**
1. **Manajemen Pengguna**: Control user dan role-based access
2. **Hak Akses**: Atur permission dengan tree-view interface
3. **Aplikasi Settings**: Konfigurasi pengaturan sistem
4. **Theme Preferences**: Customize tampilan aplikasi

---

## 🔧 Configuration & Environment

### 📝 Environment Variables
```bash
# .env.local
VITE_APP_TITLE="Tobacco Traceability System"
VITE_APP_VERSION="2.1.0"
VITE_MAP_DEFAULT_LAT=-7.977
VITE_MAP_DEFAULT_LNG=112.633
VITE_MAP_DEFAULT_ZOOM=13
VITE_API_BASE_URL="http://localhost:3000/api"
```

### 🎨 Theme Configuration
```typescript
// Theme system dengan localStorage persistence
const themeConfig = {
  defaultTheme: 'system',
  themes: ['light', 'dark', 'system'],
  storageKey: 'tobacco-traceability-theme'
}
```

### 🗺️ Map Configuration
```typescript
// Leaflet map configuration
const mapConfig = {
  center: [-7.977, 112.633], // Malang, Jawa Timur
  zoom: 13,
  maxZoom: 18,
  minZoom: 8
}
```

---

## 🧪 Testing & Quality Assurance

### 🔍 Testing Commands
```bash
# Run unit tests
npm run test

# Run tests dengan coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### 📊 Code Quality
```bash
# Type checking
npm run type-check

# Bundle analysis
npm run analyze

# Performance audit
npm run audit
```

---

## � Performance & Optimization

### ⚡ Performance Features
- **🔄 Code Splitting**: Route-based automatic code splitting
- **🌳 Tree Shaking**: Eliminasi dead code otomatis
- **🖼️ Asset Optimization**: Optimisasi gambar dan font
- **📦 Bundle Compression**: Gzip compression untuk production
- **💾 Caching Strategy**: Aggressive caching untuk assets

### 📊 Performance Monitoring
```bash
# Bundle size analysis
npm run build
npm run analyze

# Performance audit
npm run audit:performance
```

### 🎯 Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

---

## 🚀 Deployment Options

### 1. 🌐 Static Hosting (Vercel, Netlify)
```bash
npm run build
# Upload dist/ folder atau connect Git repository
```

### 2. 🐳 Docker Container
```bash
# Production container
./deploy.sh build
./deploy.sh deploy

# Development container
./deploy.sh dev
```

### 3. ☁️ Cloud Platforms
```bash
# Vercel deployment
vercel deploy

# Railway deployment
railway deploy

# Custom cloud deployment
./release.sh
```

---

## 🔒 Security & Best Practices

### 🛡️ Security Features
- **🚫 CSP Headers**: Content Security Policy protection
- **🔐 HTTPS Ready**: SSL/TLS configuration
- **✅ Input Validation**: Form validation dan sanitization
- **🔒 Secure Headers**: Security headers dalam nginx config
- **🛡️ XSS Protection**: Cross-site scripting prevention

### 🔐 Security Best Practices
- **📝 Regular Updates**: Dependency updates otomatis
- **🔐 Environment Protection**: Secure environment variables
- **👥 Access Control**: Role-based access implementation
- **🔍 Security Scanning**: Automated vulnerability scanning

---

## � Monitoring & Analytics

### 📈 Monitoring Tools
```bash
# Application health monitoring
./monitor.sh

# System resource monitoring
docker stats

# Log monitoring
docker-compose logs -f --tail=100

# Backup system
./backup.sh
```

### 📊 Analytics Dashboard
- **📈 User Analytics**: User behavior tracking
- **⚡ Performance Metrics**: Application performance monitoring
- **🔧 System Health**: Infrastructure monitoring
- **📊 Business Metrics**: Agricultural data analytics

---

## 🤝 Contributing

### 👥 Development Team
- **Frontend Development**: React TypeScript specialist
- **UI/UX Design**: Modern interface design dengan accessibility focus
- **DevOps & Infrastructure**: Docker containerization dan deployment
- **Agricultural Domain Expert**: Tobacco farming dan traceability specialist

### 🔄 Development Workflow
1. **Fork** repository ke akun personal
2. **Clone** forked repository ke local machine
3. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
4. **Make changes** dengan mengikuti code standards
5. **Commit changes** (`git commit -m 'Add some AmazingFeature'`)
6. **Push to branch** (`git push origin feature/AmazingFeature`)
7. **Open Pull Request** dengan deskripsi yang jelas

### 📝 Code Standards
- **TypeScript Strict Mode**: Type safety untuk semua code
- **ESLint Configuration**: Automated code quality checking
- **Prettier Formatting**: Consistent code formatting
- **Conventional Commits**: Structured commit messages
- **Component Documentation**: JSDoc untuk semua components

### 🔍 Pull Request Guidelines
- **Clear Description**: Deskripsi lengkap tentang perubahan
- **Unit Tests**: Test coverage untuk fitur baru
- **Documentation**: Update dokumentasi jika diperlukan
- **Performance Impact**: Assessment impact terhadap performance
- **Screenshots**: Screenshot untuk perubahan UI

### 🐛 Bug Reports
Gunakan GitHub Issues dengan template:
- **Bug Description**: Deskripsi detail bug
- **Steps to Reproduce**: Langkah-langkah reproduksi
- **Expected Behavior**: Behavior yang diharapkan
- **Screenshots**: Screenshot atau video jika relevan
- **Environment**: Browser, OS, device information

---

## 📚 Documentation

### 📖 **Available Documentation**
- **[README.md](./README.md)**: Overview dan quick start guide
- **[README-DOCKER.md](./README-DOCKER.md)**: Docker deployment guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contribution guidelines
- **[CHANGELOG.md](./CHANGELOG.md)**: Version history dan changes
- **[BRANDING.md](./BRANDING.md)**: Brand guidelines dan assets
- **[DOCKER.md](./DOCKER.md)**: Detailed Docker setup

### 🔗 **API Documentation**
- **REST API**: Backend API documentation
- **Component API**: React component props dan usage
- **Type Definitions**: TypeScript interfaces dan types
- **Hook Usage**: Custom hooks documentation

### 📊 **Architecture Documentation**
- **System Architecture**: High-level system design
- **Component Architecture**: Frontend component structure
- **Data Flow**: Data management dan state flow
- **Security Architecture**: Security implementation details

---

## 📝 Changelog

### 🆕 **Version 2.1.0** (September 2025)
#### ✨ **New Features**
- **🌙 Advanced Theme System**: Dark/Light mode dengan localStorage persistence
- **🎨 Modern Login Page**: Glass morphism design dengan theme optimization
- **⚙️ Settings Management**: Comprehensive settings dengan tree-view permissions
- **📊 Enhanced Dashboard**: Real-time analytics dan improved visualizations
- **🗺️ Map Improvements**: Better performance dan user experience
- **📱 Mobile Optimization**: Enhanced responsive design

#### 🔧 **Improvements**
- **Performance**: 40% faster initial load time
- **Accessibility**: WCAG 2.1 AA compliance
- **TypeScript**: Strict mode implementation
- **Bundle Size**: 25% reduction dalam bundle size
- **Security**: Enhanced security headers dan CSP

#### 🐛 **Bug Fixes**
- Fixed theme switching persistence
- Resolved mobile navigation issues
- Fixed map rendering pada Safari
- Improved form validation feedback

### 📋 **Version 2.0.0** (August 2025)
- **🏗️ Architecture Redesign**: Complete frontend architecture overhaul
- **🎨 UI/UX Modernization**: Modern design system implementation
- **🧩 Component Library**: Custom component library development
- **🔐 Authentication**: Secure authentication system
- **📊 Reporting System**: Advanced reporting dan analytics

---

## 📄 License

```
MIT License

Copyright (c) 2025 Universitas Brawijaya - Tobacco Traceability System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### 🏛️ **Institutional Support**
- **Universitas Brawijaya**: Research institution dan academic support
- **Faculty of Agriculture**: Domain expertise dan research collaboration
- **IT Department**: Infrastructure support dan technical guidance

### 🛠️ **Technology Stack**
- **React Team**: Untuk fantastic UI library
- **TypeScript Team**: Untuk robust type system
- **Tailwind CSS**: Untuk modern styling framework
- **Leaflet**: Untuk powerful mapping capabilities
- **Vite Team**: Untuk lightning-fast build tool

### 🌿 **Agricultural Experts**
- **Tobacco Farming Community**: Domain knowledge dan real-world insights
- **Agricultural Extension Officers**: Practical experience dan validation
- **Research Collaborators**: Academic research dan methodology

### 💡 **Open Source Community**
- **Contributors**: All developers yang berkontribusi pada project
- **Issue Reporters**: Users yang membantu improve application
- **Documentation Writers**: Contributors untuk documentation improvements

---

## 📞 Support & Contact

### 🆘 **Getting Help**
- **📖 Documentation**: Check comprehensive documentation first
- **❓ GitHub Issues**: Create issue untuk bugs atau feature requests
- **💬 Discussions**: Use GitHub Discussions untuk questions
- **📧 Email Support**: Contact development team directly

### 🌐 **Links & Resources**
- **🔗 Repository**: [GitHub Repository](https://github.com/ub-tobacco-traceability/web-app)
- **📊 Demo**: [Live Demo](https://tobacco-traceability.vercel.app)
- **📚 Documentation**: [Full Documentation](https://docs.tobacco-traceability.com)
- **🏛️ Institution**: [Universitas Brawijaya](https://ub.ac.id)

### 👨‍💻 **Development Team**
- **Project Lead**: Agricultural Technology Research Team
- **Frontend Developer**: React TypeScript Specialist
- **UI/UX Designer**: Modern Interface Design Expert
- **DevOps Engineer**: Deployment dan Infrastructure Specialist

---

<div align="center">

**🌿 Tobacco Traceability System - Universitas Brawijaya**

**Supporting transparency and quality in Indonesia's tobacco industry**

[![⭐ Star Repository](https://img.shields.io/github/stars/ub-tobacco-traceability/web-app?style=social)](https://github.com/ub-tobacco-traceability/web-app)
[![🍴 Fork Repository](https://img.shields.io/github/forks/ub-tobacco-traceability/web-app?style=social)](https://github.com/ub-tobacco-traceability/web-app/fork)
[![👁️ Watch Repository](https://img.shields.io/github/watchers/ub-tobacco-traceability/web-app?style=social)](https://github.com/ub-tobacco-traceability/web-app)

Made with ❤️ by [Universitas Brawijaya](https://ub.ac.id) • [🌟 Give us a star!](https://github.com/ub-tobacco-traceability/web-app)

</div>

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
- **Lead Developer**: [Arief Andriyan SM](https://github.com/ariefandriyan)
- **UI/UX Designer**: [Arief Andriyan SM](https://github.com/ariefandriyan)
- **DevOps Engineer**: [Arief Andriyan SM](https://github.com/ariefandriyan)

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
