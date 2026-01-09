# Quick Deployment Guide

## Deploy Code Changes to GitHub Pages

### Step 1: Make your code changes
Edit any files you need to change in the project.

### Step 2: Commit your changes
```bash
# Check what files changed
git status

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Description of your changes"
```

### Step 3: Push to GitHub
```bash
# Push to main branch (triggers automatic deployment)
git push origin main
```

### Step 4: Wait for deployment
- GitHub Actions will automatically build and deploy
- Check progress at: https://github.com/hrlm-church/assessment/actions
- Deployment takes ~2-3 minutes
- Live site: https://hrlm-church.github.io/assessment/

---

## Deploy Supabase Database Changes

### One-Time Setup (Run the migration SQL)

1. Go to: https://supabase.com/dashboard/project/axrjfkyoaydcuezcaoce
2. Click **SQL Editor** → **New Query**
3. Copy contents from `deploy-migrations.sql`
4. Paste and click **Run**

---

## WordPress Integration

See `DEPLOY_TO_WORDPRESS.md` for iframe/plugin instructions.
