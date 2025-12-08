# Pull Request: Add Database Deployment Script to Fix 'Failed to fetch' Error

## Problem
The deployed app at https://hrlm-church.github.io/assessment/ shows a "Failed to fetch" error when users try to start the assessment. This is because the Supabase database hasn't been configured yet.

## Solution
This PR adds deployment scripts and instructions to fix the issue:

### Files Added
1. **`deploy-migrations.sql`** - Combined SQL migration script that:
   - Adds missing columns to `assessments` table (email, phone, role, etc.)
   - Makes `contact_id` and `session_id` nullable for direct inserts
   - Adds resume token support to `sessions` table
   - **Fixes RLS policies** to allow anonymous users to create assessments
   - Enables fallback mode (direct DB operations without edge functions)

2. **`DEPLOYMENT_INSTRUCTIONS.md`** - Comprehensive deployment guide with:
   - Quick 5-minute fix using Supabase SQL Editor
   - Full production deployment steps (edge functions)
   - Troubleshooting guide
   - Verification queries

## How to Deploy

### Quick Fix (5 minutes):
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/axrjfkyoaydcuezcaoce/sql/new)
2. Copy contents of `deploy-migrations.sql`
3. Paste and run in SQL Editor
4. Verify success message: `✓ Migration successful`

### Result
- ✅ App will work immediately in fallback mode
- ✅ Users can complete assessments
- ✅ Data saves to Supabase database
- ✅ No more "Failed to fetch" errors

## Technical Details

### Database Changes
- Applied migrations 002 and 003
- Updated RLS policies from service-role-only to allow anonymous inserts
- This enables the existing fallback code in `src/lib/api.js:64-98` to work

### Fallback Mode
The app already has fallback logic that attempts direct database inserts when edge functions aren't available. This PR makes that fallback functional by fixing the database schema and permissions.

### Future Work (Optional)
For full production features:
- Deploy Supabase edge functions (requires Supabase CLI)
- Set up email service (Resend API)
- Enable session management and resume tokens

## Testing
After running the SQL:
1. Visit https://hrlm-church.github.io/assessment/
2. Fill out the email capture form
3. Should successfully proceed to assessment (no errors)
4. Responses should save to database

## Changes in this PR
- `deploy-migrations.sql` - SQL deployment script
- `DEPLOYMENT_INSTRUCTIONS.md` - Deployment guide
- `PR_DESCRIPTION.md` - This file (for reference)

---

**Branch:** `claude/analyze-project-011an8kXhmxwyWicPTTsxoZa`

**Ready to merge** after SQL deployment is complete.
