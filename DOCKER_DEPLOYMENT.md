# Docker Deployment Guide

This guide provides instructions for deploying the Algeria Travel Assistant using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB of free RAM
- 5GB of free disk space

## Quick Start

### 1. Set Environment Variables

Create a `.env` file in the root directory (optional, has defaults):

```bash
JWT_SECRET=your-production-jwt-secret-key-minimum-32-characters
```

### 2. Build and Start Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## Services Overview

### PostgreSQL Database
- **Image**: postgres:15-alpine
- **Port**: 5432
- **User**: tossal_user
- **Database**: tossal_travel
- **Data Persistence**: Volume `postgres_data`

### Backend (Node.js/Express)
- **Port**: 5000
- **Features**:
  - Automatic Prisma migrations on startup
  - JWT authentication
  - Trip management API
  - Route finding algorithms

### Frontend (Nginx)
- **Port**: 80
- **Features**:
  - Static file serving
  - API proxy to backend
  - Gzip compression
  - Asset caching

## Docker Commands

### Build Services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Start/Stop Services
```bash
# Start all services in detached mode
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
```

### Database Management
```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U tossal_user -d tossal_travel

# Run Prisma migrations manually
docker-compose exec backend npx prisma migrate deploy

# Open Prisma Studio (database GUI)
docker-compose exec backend npx prisma studio
```

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Production Deployment

### Security Checklist

1. **Change Default Credentials**
   ```yaml
   # In docker-compose.yml
   environment:
     POSTGRES_PASSWORD: <strong-password>
     JWT_SECRET: <random-64-character-string>
   ```

2. **Use HTTPS**
   - Add SSL certificates to Nginx
   - Update nginx.conf to listen on port 443
   - Redirect HTTP to HTTPS

3. **Restrict Ports**
   - Remove port mappings for PostgreSQL (5432)
   - Only expose port 80/443 for frontend

4. **Environment Variables**
   - Never commit `.env` files
   - Use Docker secrets or external secret management

5. **Resource Limits**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

### Performance Optimization

1. **Use Production Node Environment**
   ```yaml
   environment:
     NODE_ENV: production
   ```

2. **Enable Nginx Caching**
   - Already configured in `nginx.conf`
   - Static assets cached for 1 year

3. **Database Connection Pooling**
   - Prisma handles this automatically
   - Configure in `schema.prisma` if needed

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild container
docker-compose build --no-cache <service-name>
docker-compose up -d <service-name>
```

### Database Connection Issues
```bash
# Verify database is healthy
docker-compose exec postgres pg_isready -U tossal_user

# Check environment variables
docker-compose exec backend env | grep DATABASE_URL
```

### Frontend Can't Reach Backend
```bash
# Verify network connectivity
docker-compose exec frontend ping backend

# Check Nginx configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

### Clear All Data and Start Fresh
```bash
# WARNING: This deletes all data
docker-compose down -v
docker-compose up -d
```

## Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart services
docker-compose build
docker-compose up -d

# Run new migrations if any
docker-compose exec backend npx prisma migrate deploy
```

## Backup and Restore

### Backup Database
```bash
# Create backup
docker-compose exec -T postgres pg_dump -U tossal_user tossal_travel > backup.sql

# Or with compression
docker-compose exec -T postgres pg_dump -U tossal_user tossal_travel | gzip > backup.sql.gz
```

### Restore Database
```bash
# From SQL file
docker-compose exec -T postgres psql -U tossal_user tossal_travel < backup.sql

# From compressed file
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U tossal_user tossal_travel
```

## Monitoring

### Health Checks
```bash
# Check container health
docker-compose ps

# Backend health endpoint (if implemented)
curl http://localhost:5000/health

# Frontend
curl http://localhost/
```

### Resource Usage
```bash
# View resource usage
docker stats

# View disk usage
docker system df
```

## Development vs Production

### Development
```bash
# Start with development settings
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production
```bash
# Start with production settings
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Scaling

```bash
# Scale backend service (requires load balancer)
docker-compose up -d --scale backend=3
```

## Clean Up

```bash
# Remove stopped containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove everything including volumes
docker-compose down -v --rmi all
```

---

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review Docker documentation: https://docs.docker.com/
- Check Prisma docs: https://www.prisma.io/docs
