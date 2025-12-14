<!--
  ═══════════════════════════════════════════════════════════════════════════
  LLM CYBER RANGE - OWASP Top 10 LLM Vulnerability Practice Platform
  ═══════════════════════════════════════════════════════════════════════════
  Created by: MR_INFECT
  Copyright (c) 2025 MR_INFECT. All rights reserved.
  
  Professional-grade web application for practicing OWASP Top 10 LLM
  vulnerabilities in a safe, controlled environment.
  ═══════════════════════════════════════════════════════════════════════════
-->

# 🛡️ LLM Cyber Range Practice Cell

**Created by: MR_INFECT**

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

**A Professional-Grade Web Application for Practicing OWASP Top 10 LLM Vulnerabilities**

*Developed by MR_INFECT*

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Security](#security)
- [License](#license)
- [Author](#author)

## 🎯 Overview

The **LLM Cyber Range Practice Cell** is an interactive, web-based training platform designed to help security professionals and students practice identifying and exploiting OWASP Top 10 LLM vulnerabilities in a safe, controlled environment.

**Created by MR_INFECT** - A comprehensive solution for LLM security training.

### Key Features

- ✅ **30 Comprehensive Challenges** across 3 difficulty levels
- ✅ **All OWASP Top 10 LLM Vulnerabilities** covered
- ✅ **Interactive Chat Interface** for hands-on practice
- ✅ **Admin Dashboard** with real-time monitoring
- ✅ **Progress Tracking** and scoring system
- ✅ **Premium Cybersecurity UI** with glassmorphism effects
- ✅ **Docker Deployment** ready

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 15
- Docker & Docker Compose (optional)

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd The_citadel

# Setup backend
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials

# Setup database
createdb llm_cyber_range

# Start backend
npm run dev

# In a new terminal, setup frontend
cd ../client
npm install
npm run dev
```

Access the application at **http://localhost:5173**

Default admin credentials: `admin` / `Admin@123`

### Docker Deployment

```bash
docker-compose up -d --build
```

Access at **http://localhost**

## 📚 Documentation

- **[README.md](README.md)** - Complete setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment instructions
- **[Challenges Catalog](server/challenges-*.json)** - All 30 challenges

## 🎯 Challenge Structure

### 30 Total Challenges

- **Practitioner Level**: 10 challenges (100 pts each)
- **Expert Level**: 10 challenges (200 pts each)
- **Enterprise Level**: 10 challenges (300 pts each)

### OWASP Top 10 LLM Coverage

1. **LLM01** - Prompt Injection
2. **LLM02** - Insecure Output Handling
3. **LLM03** - Training Data Poisoning
4. **LLM04** - Model Denial of Service
5. **LLM05** - Supply Chain Vulnerabilities
6. **LLM06** - Sensitive Information Disclosure
7. **LLM07** - Insecure Plugin Design
8. **LLM08** - Excessive Agency
9. **LLM09** - Overreliance
10. **LLM10** - Model Theft

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
Backend API (Express + Node.js)
    ↓
PostgreSQL Database
```

### Tech Stack

**Frontend:**
- React 18 with Vite
- React Router
- Recharts for visualizations
- Custom CSS with premium design

**Backend:**
- Node.js with Express
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- Security middleware (Helmet, CORS, Rate Limiting)

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Input Validation & Sanitization
- ✅ XSS Prevention
- ✅ Rate Limiting
- ✅ Security Headers
- ✅ Role-Based Access Control

## 📊 Features

### Admin Panel
- Real-time statistics dashboard
- User monitoring and progress tracking
- Challenge management
- JSON vulnerability upload
- Interactive charts

### User Panel
- Difficulty level selection (switchable)
- Progress tracking
- Interactive chat interface
- Flag submission system
- Hints and guidance

## 🎨 UI/UX

- Premium dark cybersecurity theme
- Glassmorphism effects
- Smooth animations
- Responsive design
- Modern typography (Inter font)

## 📝 License

Copyright (c) 2025 MR_INFECT. All rights reserved.

This project is licensed under the MIT License.

## 👤 Author

**MR_INFECT**

- Created: 2025
- Project: LLM Cyber Range Practice Cell
- Purpose: Professional LLM security training platform

---

<div align="center">

**Built with ❤️ by MR_INFECT**

*For the Cybersecurity Community*

</div>

---

## 🙏 Acknowledgments

- OWASP for LLM security guidelines
- The cybersecurity community
- All contributors and testers

---

**© 2025 MR_INFECT. All Rights Reserved.**
