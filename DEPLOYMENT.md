# LLM Cyber Range - Quick Deployment Guide

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Ports 80 and 5000 available

### Steps

1. **Clone or download the project**
```bash
cd The_citadel
```

2. **Start the application**
```bash
docker-compose up -d --build
```

3. **Wait for services to be ready** (30-60 seconds)
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

4. **Access the application**
- Open browser: http://localhost
- Login with default admin: `admin` / `Admin@123`

5. **Upload sample challenges**
- Login as admin
- Go to Admin Dashboard
- Click "Upload JSON File"
- Select `server/sample-vulnerabilities.json`

6. **Create a student account**
- Logout
- Click "Register"
- Create account and select difficulty level

## 🔧 Troubleshooting

### Database not ready
```bash
docker-compose restart backend
```

### Port conflicts
Edit `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8080:80"  # Change 80 to 8080
backend:
  ports:
    - "5001:5000"  # Change 5000 to 5001
```

### View logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d --build
```

## 🔒 Production Deployment

### 1. Update Security Settings

Edit `docker-compose.yml`:
```yaml
environment:
  JWT_SECRET: <generate-random-32-char-string>
  ADMIN_PASSWORD: <strong-password>
  DB_PASSWORD: <strong-db-password>
```

### 2. Enable HTTPS

Add SSL certificates and update nginx configuration:
```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ... rest of config
}
```

### 3. Firewall Configuration

```bash
# Allow only necessary ports
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 4. Backup Strategy

```bash
# Backup database
docker exec llm-cyber-range-db pg_dump -U postgres llm_cyber_range > backup.sql

# Restore database
docker exec -i llm-cyber-range-db psql -U postgres llm_cyber_range < backup.sql
```

## 📊 Monitoring

### Check service health
```bash
docker-compose ps
```

### View resource usage
```bash
docker stats
```

### Check logs
```bash
docker-compose logs --tail=100 -f
```

## 🛑 Stopping the Application

```bash
# Stop services (keep data)
docker-compose stop

# Stop and remove containers (keep data)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

## 📝 Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `Admin@123`

**Database:**
- User: `postgres`
- Password: `postgres_password_change_in_production`

⚠️ **CHANGE THESE IN PRODUCTION!**

## 🌐 Accessing from Other Devices

Students can access from other devices on the same network:

1. Find your server IP:
```bash
ip addr show
# or
hostname -I
```

2. Students access via: `http://YOUR_SERVER_IP`

## 💡 Tips

- Upload challenges before creating student accounts
- Monitor admin dashboard for student progress
- Backup database regularly
- Update passwords in production
- Use HTTPS for production deployments
