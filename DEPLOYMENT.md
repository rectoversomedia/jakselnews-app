# Jakselnews Deployment Guide

## Prerequisites

- VPS with Ubuntu 22.04 LTS (Recommended: Hostinger VPS)
- SSH access to VPS
- Domain name with DNS access (optional but recommended)
- Supabase account with project created

---

## Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/rectoversomedia/jakselnews-app.git
cd jakselnews-app

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development
npm run dev
```

---

## Production Deployment

### Option 1: VPS Deployment (Recommended for this project)

#### Step 1: Initial VPS Setup

SSH into your VPS and run the setup script:

```bash
ssh root@31.97.106.177
# Enter password: SabrinaBaby1992#

# Run initial setup (one time only)
bash <(curl -s https://raw.githubusercontent.com/rectoversomedia/jakselnews-app/main/scripts/setup-vps.sh)
```

#### Step 2: Copy Project Files

From your local machine:

```bash
# Using rsync (recommended)
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  ~/Documents/Jakselnews.com/jakselnews-app/ \
  root@31.97.106.177:/var/www/jakselnews/

# Or using scp
scp -r ~/Documents/Jakselnews.com/jakselnews-app/* root@31.97.106.177:/var/www/jakselnews/
```

#### Step 3: Configure Environment

SSH into VPS and configure the environment:

```bash
ssh root@31.97.106.177

cd /var/www/jakselnews

# Edit environment file
nano .env.production
```

Required variables:
```env
NODE_ENV=production
PORT=5000

SUPABASE_URL=https://eqoyvbeusopskzacoowz.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

JWT_SECRET=generate-a-very-long-random-string-here
JWT_SECRET=$(openssl rand -base64 64)

WORDPRESS_URL=https://jakselnews.com
WORDPRESS_API_URL=https://jakselnews.com/wp-json/wp/v2

CORS_ORIGIN=https://jakselnews.com,https://www.jakselnews.com
```

#### Step 4: Deploy with Docker

```bash
cd /var/www/jakselnews

# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
```

#### Step 5: Setup SSL (Recommended)

```bash
# Setup SSL certificate
certbot --nginx -d api.jakselnews.com

# Auto-renewal
certbot renew --dry-run
```

---

### Option 2: Manual Deployment (No Docker)

```bash
# SSH into VPS
ssh root@31.97.106.177

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Copy project files
cd /var/www/jakselnews
npm install
npm run build:server

# Configure environment
cp .env.example .env.production
nano .env.production

# Start with PM2
pm2 start dist/server/src/index.js --name jakselnews-api
pm2 startup
pm2 save
```

---

## Frontend Deployment (Vercel)

### Step 1: Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd ~/Documents/Jakselnews.com/jakselnews-app
vercel
```

### Step 2: Configure Environment Variables

In Vercel Dashboard (https://vercel.com/dashboard):

1. Go to Project Settings > Environment Variables
2. Add these variables:

```
NEXT_PUBLIC_WP_API_URL=https://jakselnews.com/wp-json/wp/v2
NEXT_PUBLIC_API_URL=https://api.jakselnews.com/api
NEXT_PUBLIC_SITE_URL=https://jakselnews.com
```

### Step 3: Custom Domain

1. Go to Project Settings > Domains
2. Add `jakselnews.com` and `www.jakselnews.com`
3. Configure DNS records as instructed

---

## DNS Configuration

Add these DNS records for your domain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | api | 31.97.106.177 | 300 |
| A | @ | YOUR_VERCEL_IP | 300 |
| CNAME | www | @ | 300 |

---

## Supabase Setup

### Step 1: Run Database Migration

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Run the migration from `supabase/migrations/001_initial_schema.sql`

### Step 2: Create Storage Bucket

```sql
-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports-media', 'reports-media', true);

-- Create storage policy
CREATE POLICY "Public Access" ON storage.objects
FOR ALL USING (bucket_id = 'reports-media');
```

### Step 3: Create Admin User

```sql
-- First, register a user via the API or Supabase Dashboard
-- Then set their role to admin:

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

---

## Troubleshooting

### API Not Starting

```bash
# Check logs
docker-compose logs api

# Check environment variables
docker exec -it jakselnews-api env

# Test database connection
docker exec -it jakselnews-api node -e "require('./config/supabase')"
```

### CORS Errors

1. Verify `CORS_ORIGIN` includes your frontend domain
2. Check if nginx is forwarding headers correctly

### Database Connection Issues

1. Verify Supabase URL and keys are correct
2. Check if IP is whitelisted in Supabase (if applicable)
3. Test connection from VPS:
```bash
curl -I https://eqoyvbeusopskzacoowz.supabase.co
```

---

## Useful Commands

### Docker Commands
```bash
# View logs
docker-compose logs -f api

# Restart API
docker-compose restart api

# Rebuild and restart
docker-compose up -d --build

# Stop
docker-compose down

# Shell into container
docker exec -it jakselnews-api sh
```

### PM2 Commands (if not using Docker)
```bash
# View logs
pm2 logs jakselnews-api

# Restart
pm2 restart jakselnews-api

# Monitor
pm2 monit
```

### System Commands
```bash
# Check nginx status
systemctl status nginx

# Check nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Check firewall
ufw status
```

---

## Security Checklist

- [ ] Change JWT_SECRET to a long random string
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall (only allow 22, 80, 443)
- [ ] Set up Fail2Ban
- [ ] Use SSH keys instead of password
- [ ] Regular system updates: `apt update && apt upgrade`
- [ ] Monitor logs regularly
- [ ] Set up backup for Supabase database

---

## Monitoring

### Health Check Endpoint
```
GET http://31.97.106.177:5000/api/health
```

### Detailed Health Check
```
GET http://31.97.106.177:5000/api/health/detailed
```

---

## Backup Strategy

### Supabase Backups
Supabase provides automatic daily backups. For additional safety:

```bash
# Export data using Supabase CLI
supabase db dump -f backup.sql
```

---

## Support

For issues, check:
1. Docker logs: `docker-compose logs -f api`
2. Nginx logs: `tail -f /var/log/nginx/error.log`
3. Supabase Dashboard for database issues
4. Vercel Dashboard for frontend issues
