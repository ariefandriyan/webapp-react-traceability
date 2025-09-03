# 🎨 Branding & Visual Identity

This document outlines the branding and visual identity updates for the Tobacco Traceability System.

## 🎯 Brand Identity

### Application Name
- **Full Name**: Tobacco Traceability System
- **Short Name**: Tobacco Trace (for mobile/PWA)
- **Tagline**: "Sistem pelacakan komprehensif untuk industri tembakau"

### Color Palette
- **Primary Green**: `#16a34a` (green-600)
- **Secondary Green**: `#22c55e` (green-500)  
- **Dark Green**: `#15803d` (green-700)
- **Accent Green**: `#14532d` (green-900)
- **Background Light**: `#f0fdf4` (green-50)
- **Background**: `#dcfce7` (green-100)

## 🖼️ Visual Assets

### Favicon System
The application uses a comprehensive favicon system with multiple sizes and formats:

#### SVG Favicons (Scalable)
- **`favicon.svg`** - Main 32x32 favicon with detailed tobacco leaf
- **`favicon-16.svg`** - Simplified 16x16 version for small displays
- **`favicon-192.svg`** - Large 192x192 version with shadows and details
- **`apple-touch-icon.svg`** - 180x180 Apple touch icon with background

#### Design Elements
- **Main Shape**: Stylized tobacco leaf with natural curves
- **Veins**: Central vein with secondary branching veins
- **Gradient**: Green gradient from light to dark for depth
- **Shadow**: Subtle drop shadow for dimension (larger sizes)
- **Highlights**: Light spots for realistic appearance

### Tobacco Leaf Icon Design
```
Main Structure:
- Organic leaf shape following natural tobacco leaf form
- Central vein running from tip to base
- Secondary veins branching from central vein
- Gradient fill using brand green colors
- Stroke outline in dark green for definition
```

## 📱 Progressive Web App (PWA) Support

### Web App Manifest (`manifest.json`)
- **Theme Color**: `#16a34a` (matches primary brand color)
- **Background Color**: `#f0fdf4` (light green background)
- **Display Mode**: `standalone` (app-like experience)
- **Orientation**: `portrait-primary` (optimized for mobile)
- **Categories**: agriculture, productivity, business

### Mobile Optimization
- Apple touch icon for iOS home screen
- Theme color for browser chrome
- Mobile-web-app-capable for standalone mode
- Optimized viewport settings

## 🌐 SEO & Meta Tags

### Document Titles
- **Homepage**: "Tobacco Traceability System - Sistem Pelacakan Tembakau"
- **Login**: "Login - Tobacco Traceability System"
- **Dashboard**: "Dashboard - Tobacco Traceability System"
- **Dynamic Pages**: "[Page Title] - Tobacco Traceability System"

### Meta Description
"Sistem pelacakan komprehensif untuk industri tembakau dengan manajemen lahan, fase tanam, dan aksesibilitas infrastruktur. Solusi modern untuk transparansi produksi tembakau di Indonesia."

### Keywords
- tembakau, traceability, pelacakan, pertanian, lahan
- fase tanam, tobacco, farming, agriculture, Indonesia

### Open Graph Tags
- Optimized for social media sharing
- Uses large favicon as sharing image
- Includes proper locale (id_ID)
- Structured for Facebook and Twitter

## 🔧 Technical Implementation

### Document Title Management
- Custom hook `useDocumentTitle()` for dynamic title updates
- Automatic title formatting with app suffix
- Proper cleanup on component unmount

### Favicon Loading
- Progressive enhancement with multiple formats
- SVG-first approach for modern browsers
- Fallback support for older browsers
- Proper MIME types and size declarations

### Package.json Updates
- Updated package name to `tobacco-traceability-system`
- Version bumped to `1.0.0`
- Added proper description and keywords
- Updated author and license information

## 🎨 Brand Guidelines

### Logo Usage
- The tobacco leaf icon represents growth and agriculture
- Always maintain the green color scheme
- Ensure sufficient contrast for accessibility
- Use SVG format when possible for scalability

### Typography
- Application title uses system fonts
- Maintain readability across all devices
- Consistent font hierarchy throughout the app

### Color Application
- Primary green for main UI elements
- Secondary green for highlights and accents
- Dark green for text and borders
- Light green for backgrounds and surfaces

## 📊 Performance Considerations

### Favicon Optimization
- SVG format for smallest file size
- Multiple sizes to prevent scaling artifacts
- Optimized gradients and paths
- Minimal DOM complexity

### Loading Strategy
- Preload critical favicon sizes
- Lazy load larger icons
- Efficient caching headers
- Progressive enhancement approach

## 🔄 Future Enhancements

### Planned Additions
- Animated favicon for loading states
- Brand mascot or illustration
- Extended color palette for themes
- Print-specific styling
- High contrast mode support

### Brand Evolution
- User feedback integration
- A/B testing for icon variations
- Seasonal theme adaptations
- Regional customizations

---

*This branding system ensures consistent visual identity across all platforms while maintaining performance and accessibility standards.*
