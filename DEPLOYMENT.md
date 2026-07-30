# Jakselnews Deployment Guide

## Architecture

Jakselnews uses a simple, serverless architecture:

- **Frontend**: Next.js 14 (App Router) → deployed on **Vercel**
- **Database**: **Supabase** (PostgreSQL) — stores categories, services, alerts, and incident reports
- **CMS**: **WordPress** (`jakselnews.com/wp-json/wp/v2`) — manages news articles
- **Reports**: Anonymous incident reports via Supabase — no authentication required

No Express server, no VPS, no Docker.

---

## Quick Start (Local Development)

```bash
git clone https://github.com/rectoversomedia/jakselnews-app.git
cd jakselnews-app
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Setup (Supabase)

### Step 1: Run Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project `eqoyvbeusopskzacoowz`
3. Go to SQL Editor
4. Copy & paste the entire contents of **`supabase/migrations/00_combined_migration.sql`**
5. Click **Run**

This creates all tables, indexes, RLS policies, triggers, seed data, and the storage bucket in one go.

### Step 2: Create Admin User (Optional)

After migration, run **`supabase/migrations/04_admin_setup.sql`** if you need admin access to Supabase Studio.

---

## WordPress Setup

WordPress is already configured at `jakselnews.com/wp-json/wp/v2`.

Ensure the REST API is enabled in WordPress (Settings → Permalinks → anything except Plain).

---

## Frontend Deployment (Vercel)

### Option 1: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: Via GitHub

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Connect your GitHub repo
4. Vercel auto-detects Next.js

### Add Environment Variables

In **Vercel Dashboard** → Project Settings → Environment Variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eqoyvbeusopskzacoowz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | _(your Supabase anon key)_ |
| `NEXT_PUBLIC_WP_API_URL` | `https://jakselnews.com/wp-json/wp/v2` |
| `NEXT_PUBLIC_SITE_URL` | `https://jakselnews.com` |

Get keys from: https://supabase.com/dashboard → Settings → API

### Custom Domain

In Vercel Dashboard → Domains: Add `jakselnews.com` and `www.jakselnews.com`

---

## DNS Setup

Add DNS records in your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | _(Vercel IP — shown in Vercel Domains)_ | 300 |
| CNAME | www | `cname.vercel-dns.com` | 300 |

Vercel handles SSL automatically.

---

## Troubleshooting

### Reports not loading

1. Verify Supabase tables exist and have data
2. Check RLS policies allow public reads in `supabase/migrations/00_combined_migration.sql`
3. Check browser console for CORS errors

### WordPress articles not loading

1. Verify `NEXT_PUBLIC_WP_API_URL` is set correctly
2. Test directly: `curl https://jakselnews.com/wp-json/wp/v2/posts?per_page=1`

### Database connection errors

1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
2. Check Supabase project is not paused
3. Check for IP restrictions in Supabase → Settings → Database

---

## Supabase Backup

Supabase provides automatic daily backups. For additional safety:

```bash
# Export data using Supabase CLI
npx supabase db dump -f backup.sql --project-id eqoyvbeusopskzacoowz
```
