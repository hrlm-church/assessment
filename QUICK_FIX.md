# Quick Fix: Form Submission Error

## Problem
Form shows "Failed to save your information" because the database table is missing columns.

## Solution (2 minutes)

### Step 1: Run Migration in Supabase

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste this entire SQL:

```sql
-- Add contact info fields to assessments table for direct data collection
ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS responses JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;

-- Make contact_id and session_id nullable
ALTER TABLE assessments
ALTER COLUMN contact_id DROP NOT NULL,
ALTER COLUMN session_id DROP NOT NULL;

-- Add index on email for lookups
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);
```

5. Click **Run** (or press Ctrl+Enter)
6. Wait for "Success. No rows returned"

### Step 2: Test the Form

1. Refresh your app
2. Fill out the form
3. Click "Next →"
4. ✅ Should work now!

---

## What This Does

Adds these columns to your `assessments` table:
- `first_name` - User's first name
- `last_name` - User's last name
- `email` - User's email address
- `phone` - Phone number (optional)
- `role` - Present role (plant/pastor/student/leader)
- `marital_status` - Married or single
- `consent` - Email opt-in checkbox
- `responses` - Assessment answers (JSON)
- `completed` - Whether they finished

Now your form can save directly to the database! 🎉

---

## Export Contacts Later

To get your contact list for Dave Harvey:

```sql
SELECT
  first_name,
  last_name,
  email,
  phone,
  role,
  marital_status,
  consent,
  created_at
FROM assessments
WHERE consent = true
ORDER BY created_at DESC;
```

Export as CSV from Supabase dashboard.
