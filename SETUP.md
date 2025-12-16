# 🚀 LLM Cyber Range Deployment Guide

This guide describes how to deploy the LLM Cyber Range platform from a fresh state.

## 📋 Prerequisites

- Node.js v16+
- PostgreSQL
- Git

## 🛠️ Quick Start

### 1. Database Setup

Ensure PostgreSQL is running and the database `llm_cyber_range` exists:

```bash
# Create database (if not exists)
createdb llm_cyber_range
```

### 2. Environment Configuration

The application comes with default configuration in `.env.example`. 

**Backend (`/server/.env`)**:
```env
PORT=5000
DB_HOST=localhost
DB_USER=ubuntu
DB_PASSWORD=ubuntu123  # Change to your DB password
DB_NAME=llm_cyber_range
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
```

**Frontend (`/client`)**:
No special environment variables required for local dev.

### 3. Installation & Running

**Install Dependencies**:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

**Start the Application**:
You can run both servers in separate terminals:

**Terminal 1 (Backend)**:
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
# It will automatically:
# 1. Connect to Database
# 2. Sync Models
# 3. Create default 'admin' user if missing
```

**Terminal 2 (Frontend)**:
```bash
cd client
npm run dev
# Vite will start on http://localhost:5173
```

## 🧹 Factory Reset (Clear Data)

To wipe all user data and reset the application to its initial state (keeping only the admin account), you can run the following SQL:

```sql
-- Delete all non-admin users (cascades to chats and progress)
DELETE FROM "Users" WHERE role != 'admin';

-- Optional: Truncate logs if needed explicitly
TRUNCATE "ChatLogs" RESTART IDENTITY CASCADE;
TRUNCATE "Progresses" RESTART IDENTITY CASCADE;
```

## 🔐 Default Credentials

- **Admin Login**:
  - Username: `admin`
  - Password: `Admin@123`

---
**Maintained by MR_INFECT**
