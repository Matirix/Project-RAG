# Stage 1: Builder
FROM denoland/deno:2.6.3 AS builder

WORKDIR /app

# Copy lock files first to leverage caching
COPY package.json deno.json deno.lock ./

# Cache dependencies only if lock/package files change
RUN deno cache package.json

# Copy rest of the code
COPY . .

# Required for the next line
RUN deno install
# Build the frontend
RUN deno task build-non-strict

# Stage 2: Serve with Nginx
FROM nginx:alpine-slim

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Create /rag folder
RUN mkdir -p /usr/share/nginx/html/rag

# Copy built frontend from builder stage into /rag
COPY --from=builder /app/dist /usr/share/nginx/html/rag

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
