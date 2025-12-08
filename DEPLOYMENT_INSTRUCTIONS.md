# Deployment Instructions - Quick Fix

Your app is deployed but the database isn't configured yet. Follow these steps to get it working:

## ⚡ Quick Fix (5 minutes)

### Step 1: Run the Migration SQL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/axrjfkyoaydcuezcaoce
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `deploy-migrations.sql` (in this repo)
5. Paste it into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see:
```
✓ Migration successful - all columns exist
```

### Step 2: Test the App

Visit: https://hrlm-church.github.io/assessment/

The form should now work! The app will use "fallback mode" (direct database inserts) instead of edge functions.

---

## 🚀 Full Deployment (Optional - For Production)

For the full production setup with edge functions, session management, and email delivery:

### Prerequisites

- Supabase CLI installed locally
- Access to the Supabase project

### Steps

1. **Install Supabase CLI** (on your local machine):
   ```bash
   # macOS
   brew install supabase/tap/supabase

   # Windows
   scoop install supabase

   # Linux
   # Download from https://github.com/supabase/cli/releases
   ```

2. **Login and Link**:
   ```bash
   supabase login
   supabase link --project-ref axrjfkyoaydcuezcaoce
   ```

3. **Deploy Database Migrations**:
   ```bash
   cd /path/to/assessment
   supabase db push
   ```

4. **Deploy Edge Functions**:
   ```bash
   supabase functions deploy start-assessment
   supabase functions deploy save-response
   supabase functions deploy complete-assessment
   supabase functions deploy restart-assessment
   supabase functions deploy session-resolve
   supabase functions deploy send-results
   ```

5. **Set Environment Secrets**:

   Go to Supabase Dashboard → Settings → Edge Functions → Secrets and add:

   - `SUPABASE_URL` = `https://axrjfkyoaydcuezcaoce.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (from Dashboard → Settings → API)
   - `SUPABASE_ANON_KEY` = (from Dashboard → Settings → API)
   - `JWT_SECRET` = (from Dashboard → Settings → API → JWT Secret)
   - `APP_URL` = `https://hrlm-church.github.io`
   - `RESEND_API_KEY` = (optional, for email delivery)

---

## 📊 What Changed

The deployment script:

1. ✅ Adds missing columns to `assessments` table (email, phone, role, etc.)
2. ✅ Makes `contact_id` and `session_id` nullable (allows direct inserts)
3. ✅ Adds resume token support for session recovery
4. ✅ **Fixes RLS policies** to allow anonymous users to insert/update assessments
5. ✅ Enables the fallback mode in the app to work without edge functions

## 🔍 Verification

After running the SQL script, verify in Supabase Dashboard:

1. **SQL Editor** → Run: `SELECT * FROM assessments LIMIT 1;`
   - Should show columns: `first_name`, `email`, `responses`, `completed`, etc.

2. **Table Editor** → Click `assessments` table
   - Check that columns exist

3. **Test the app**: Fill out the form at https://hrlm-church.github.io/assessment/
   - Should no longer show "Failed to fetch" error

---

## 🆘 Troubleshooting

**Still getting "Failed to fetch"?**
- Clear browser cache and reload
- Check browser console for specific error
- Verify SQL ran successfully in Supabase

**Need to check if migrations applied?**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'assessments'
ORDER BY ordinal_position;
```

**Want to see RLS policies?**
```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'assessments';
```

---

## 📝 Notes

- **Fallback mode** works but doesn't have session management or resume tokens
- For full features (resume links, email delivery), deploy edge functions
- The app will automatically try edge functions first, then fallback to direct DB
- All data is still secure with Supabase RLS policies

---

Need help? Check the error in browser console (F12 → Console tab) and look for Supabase errors.
