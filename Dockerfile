# Use Node.js alpine image for a small footprint
FROM node:18-alpine

# Add OpenSSL 1.1 compatibility for Prisma
RUN apk add --no-cache openssl1.1-compat

# Set the working directory
WORKDIR /app

# Copy the backend package files first for better caching
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Generate Prisma Client
COPY backend/prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the backend and the entire frontend
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend

# Re-run prisma generate in case schema changed (or was just copied)
WORKDIR /app/backend
RUN npx prisma generate

# Expose the backend port
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:./prisma/dev.db"

# Start the application
CMD ["node", "server.js"]
