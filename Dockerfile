# Multi-stage build untuk optimasi ukuran image
# Stage 1: Build environment
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files untuk caching dependencies
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build aplikasi untuk production
RUN npm run build

# Stage 2: Production environment dengan Nginx
FROM nginx:alpine

# Copy hasil build dari stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy konfigurasi nginx untuk SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
