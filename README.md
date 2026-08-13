# 🌐 MCC AI Language Platform

An enterprise-grade, multi-tenant AI SaaS platform offering Voice-to-Text (Speech-to-Text), Multi-Language Translation, Neural Text-to-Speech (TTS), Document OCR, and Super Admin Platform Builder.

---

## ⚡ Key Features

- **Dynamic Tiered Billing & Subscription Plans**: Live dynamic plan rendering connected to backend database (`Free Tier`, `Starter Tier`, `Professional Tier`, `Enterprise Tier`).
- **Voice-to-Text (STT)**: Real-time transcription, custom vocabulary support, timestamp export (SRT/VTT), and audio processing.
- **Neural Text-to-Speech (TTS)**: High-fidelity voice synthesis, voice controls, audio file generation, and download capabilities.
- **Multi-Language Translation**: Fast text and document translation with multi-language support.
- **Document OCR & Processing**: Upload and translate documents with chunking and page management.
- **Super Admin & Platform Builder**: Admin dashboard to dynamically create, edit, activate/deactivate pricing tiers, limits, and included features live in the database.
- **Multi-Tenant SaaS Architecture**: Built-in tenant isolation, usage tracking, quota enforcement, and audit logs.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI, SQLAlchemy, PyMySQL, Pydantic
- **Database Engine**: Remote Live Production **MySQL** (with SQLite local fallback)
- **Authentication**: NextAuth.js / JWT Auth & Google OAuth

---

## 🗄️ Database Setup & Live Production MySQL

The platform supports both local development (SQLite) and **Live Remote Production MySQL**.

### 1. Environment Configuration (`.env`)

To connect to your **Live Remote Production MySQL Database**, add these environment variables into your `.env` file or hosting platform settings:

```env
# Remote Production MySQL Database Configuration
DB_TYPE="mysql"
DB_HOST="your-live-mysql-host.com"   # Remote MySQL Server Host / IP (e.g., AWS RDS, Hostinger, PlanetScale, DigitalOcean)
DB_PORT="3306"                      # MySQL Port (Default: 3306)
DB_USER="your_production_user"      # MySQL Database Username
DB_PASSWORD="your_production_password" # MySQL Database Password
DB_NAME="mcc_saas"                  # Production Database Name

# Or Full Production Connection String:
# DATABASE_URL="mysql+pymysql://your_user:your_password@your-remote-host:3306/mcc_saas"
```

---

## 🚀 Live Production Deployment Guide

When deploying the platform to live hosting (e.g., **Vercel**, **Render**, **Railway**, **AWS**, or **VPS Server**):

### Step 1: Set Up Live Environment Variables
In your hosting provider's dashboard under **Project Settings ➔ Environment Variables**, paste the following keys:

| Environment Variable | Description | Example Value |
|---|---|---|
| `DB_TYPE` | Database dialect | `mysql` |
| `DB_HOST` | Remote MySQL server domain or IP | `db.yourcompany.com` |
| `DB_PORT` | MySQL connection port | `3306` |
| `DB_USER` | MySQL user name | `mcc_admin` |
| `DB_PASSWORD` | MySQL user password | `YourLivePassword123!` |
| `DB_NAME` | Database name | `mcc_saas` |
| `DATABASE_URL` | Complete MySQL connection string | `mysql+pymysql://user:pass@host:3306/mcc_saas` |

### Step 2: Initialize Database Tables
To initialize all database tables (`subscription_plans`, `tenants`, `users`, `usage_tracking`, `audit_logs`) on your live MySQL instance, run:

```bash
cd backend
python -c "from app.core.database import engine, Base; from app.models import models; Base.metadata.create_all(bind=engine)"
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+) & `npm`
- Python (v3.10+)

### 1. Install Dependencies

```bash
# Install Frontend Dependencies
npm install

# Install Backend Dependencies
pip install -r backend/requirements.txt
```

### 2. Start Application

Run both Next.js frontend and FastAPI backend concurrently:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **FastAPI Backend API**: `http://localhost:8000`
- **Interactive Swagger API Docs**: `http://localhost:8000/docs`

---

## 🔒 Security Best Practices

> **Important**: Never commit real database credentials or private API keys to GitHub or public source control repositories. Always use the live environment variables section of your hosting platform for production deployments.
