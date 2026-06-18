# Production Deployment Guide - MCC AI SaaS Platform

This document describes how to deploy the Multi-Tenant SaaS platform to a production server environment using Docker and Nginx.

---

## 1. Environment Configurations

Create a `.env` file at the root of the project to supply secrets. Do not commit this file to source control.

```ini
# Database configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure-password-here
POSTGRES_SERVER=db
POSTGRES_PORT=5432
POSTGRES_DB=mcc_saas

# Redis configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Cryptography & Security Secrets
# SECRET_KEY used to sign JWT tokens
SECRET_KEY=generate-a-secure-random-64-character-jwt-key
# ENCRYPTION_KEY must be a 32-byte URL-safe base64 key used for credentials encryption
# Generate in python: import cryptography.fernet; print(cryptography.fernet.Fernet.generate_key().decode())
ENCRYPTION_KEY=t-Wd93Ym3uX2pLw_Kz7U8G1e5zP_y7q8W2-v8F5tZ84=
```

---

## 2. Local Database & Seed Accounts

When you boot the container environment:
1. SQLAlchemy automatically creates all required tables (Tenants, Users, SubscriptionPlans, Usages, History logs, Audit logs) if they do not exist.
2. The database is seeded with default catalog plans (`Free`, `Starter`, `Professional`, `Enterprise`).
3. A default Super Admin account is provisioned:
   * **Username**: `mrfadmin@gmail.com`
   * **Password**: `mrfadmin123`

*Make sure to change the password immediately after logging in for the first time.*

---

## 3. Build & Run Using Docker Compose

Ensure Docker and Docker Compose are installed on your host system, then execute the following steps:

1. **Build the Frontend static bundles locally**:
   ```bash
   npm install
   npm run build
   ```
   *This populates the `dist/` directory, which is mounted by Nginx.*

2. **Boot the stack**:
   ```bash
   docker-compose up --build -d
   ```

3. **Verify running containers**:
   ```bash
   docker-compose ps
   ```

---

## 4. Reverse Proxy, Domain & SSL Setup

In a production environment, bind port `80` (and `443`) on Nginx to your public domain name. You can use Let's Encrypt / Certbot to enable HTTPS:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-platform-domain.com
```

Nginx will reverse proxy all frontend static routes and proxy requests starting with `/api` safely to the internal FastAPI backend running on port `8000`.
