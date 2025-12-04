# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all files including index.html
COPY . .

# Install dependencies (use npm install to update lock file with new deps)
RUN npm install

# Build the application
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server.js ./

# Install only production dependencies
RUN npm install --production

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Default environment variables for development
ENV VITE_API_BASE_URL=http://liferay:8080
ENV VITE_LIFERAY_SITE_ID=20124

# Start the server
CMD ["node", "server.js"]
