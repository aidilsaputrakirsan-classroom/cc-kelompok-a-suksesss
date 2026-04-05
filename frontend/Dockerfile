# Multi-stage build: React (Vite) → Nginx

# ===== Stage 1: Build =====
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency dulu (cache optimization)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set API URL (build-time)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Build React app
RUN npm run build


# ===== Stage 2: Production =====
FROM nginx:alpine

# Copy hasil build ke Nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copy konfigurasi Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]