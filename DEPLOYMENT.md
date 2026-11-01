# 🚀 Deployment Guide: Smart Habit Reminder

This project is built using:
- **Frontend**: Vite + React + Tailwind CSS
- **Backend & Database**: **Supabase** (PostgreSQL + Auth + Row Level Security + APIs)
- **Hosting**: **Vercel**

Because Supabase handles the database, authentication, and API layer automatically via `@supabase/supabase-js`, **you do not need a separate Node.js / Express backend server**.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prereq
uisites)
2. [Step 1: Set Up Backend & Database (Supabase)](#2-step-1-set-up-backend--database-supabase)
3. [Step 2: Environment Variables](#3-step-2-environment-variables)
4. [Step 3: Deploy Frontend to Vercel](#4-step-3-deploy-frontend-to-vercel)
5. [Step 4: Update Supabase Auth Redirect URLs](#5-step-4-update-supabase-auth-redirect-urls)
6. [Troubleshooting & FAQs](#6-troubleshooting--faqs)

---

## 1. Prerequisites
- A [GitHub](https://github.com) account.
- A free [Supabase](https://supabase.com) account.
- A free [Vercel](https://vercel.com) account.

---

## 2. Step 1: Set Up Backend & Database (Supabase)

### A. Create a Project
1. Go to [supabase.com](https://supabase.com) and log in.
2. Click **New Project**.
3. Choose your organization, assign a project name (e.g., `smart-habit-reminder`), and set a strong database password.
4. Select the region closest to you or your users, and click **Create new project**. Wait 1–2 minutes for setup to complete.

### B. Run the Database Migrations
Your repository already contains the exact database schema, tables, triggers, and security rules in `supabase/migrations/`.

1. In your Supabase Dashboard, click on **SQL Editor** (icon `>_` on the left sidebar).
2. Click **New Query**.
3. Open `supabase/migrations/20261030034806_create_habit_tracker_schema.sql` in your editor, copy the entire file contents, paste into the Supabase SQL editor, and click **Run**.
   - *This creates the `profiles`, `habits`, `habit_completions`, `reminders`, and `reminder_history` tables, along with Row Level Security (RLS) policies and user creation triggers.*
4. Open a second new query in Supabase.
5. Open `supabase/migrations/20261030043602_least_privilege_table_grants.sql`, copy its entire content, paste into the SQL editor, and click **Run**.
   - *This configures least-privilege security permissions.*

### C. Retrieve Supabase API Credentials
1. Go to **Project Settings** (gear icon at the bottom-left) → **API**.
2. Find and copy the following two values:
   - **Project URL** (Format: `https://<your-project-id>.supabase.co`)
   - **Project API Keys** → `anon` `public` key (long string starting with `eyJ...`)

---

## 3. Step 2: Environment Variables

The frontend requires two environment variables at build and run time:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefghijklm.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anonymous API key | `eyJhbGciOiJIUzI1NiIsInR5c...` |

### For Local Development:
Create a `.env` file in the root directory (copied from `.env.example`):
```bash
cp .env.example .env
```
Populate `.env` with your real keys:
```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 4. Step 3: Deploy Frontend to Vercel

### A. SPA Routing (`vercel.json`)
A `vercel.json` file is already created in your project root with:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
*This ensures routes like `/login`, `/dashboard`, and `/habits` do not return 404 on page refresh.*

### B. Push to GitHub
If your changes are not yet pushed:
```bash
git add .
git commit -m "Configure Vercel and env files"
git push origin main
```

### C. Deploy on Vercel
1. Log into [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Select your repository (`smart-habit-reminder`) and click **Import**.
3. In the configuration screen:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or leave default if the repository root contains `package.json`)
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - Key: `VITE_SUPABASE_URL` & Value: `https://<your-project-id>.supabase.co`
   - Key: `VITE_SUPABASE_ANON_KEY` & Value: `<your-anon-key>`
5. Click **Deploy**.
6. Vercel will build and assign you a live production URL (e.g., `https://smart-habit-reminder.vercel.app`).

---

## 5. Step 4: Update Supabase Auth Redirect URLs

To ensure user authentication, email confirmation, and callbacks function on the live site:

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to your Vercel deployment URL:
   ```
   https://your-project.vercel.app
   ```
3. In **Redirect URLs**, click **Add URL** and add:
   ```
   https://your-project.vercel.app/**
   https://your-project.vercel.app/auth/callback
   http://localhost:5173/**
   ```
4. Click **Save**.

---

## 6. Troubleshooting & FAQs

### Q: Why do I not need a backend server like Express?
The application architecture is serverless/BaaS. React directly interacts with the Supabase client (`@supabase/supabase-js`), which provides instant, secure Postgres queries, user sessions, and JWT validation via PostgreSQL Row Level Security (RLS).

### Q: Why did page refreshes return 404 before?
Vite generates a Single Page Application (SPA). Without `vercel.json`, requests for `/dashboard` try to find a physical `dashboard.html` file on Vercel. The included `vercel.json` rewrites all requests to `index.html`, allowing React Router to handle the route client-side.

### Q: How do I change environment variables later?
Go to your project on Vercel → **Settings** → **Environment Variables**, update the value, and trigger a **Redeploy** under the Deployments tab.
