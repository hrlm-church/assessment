# Deployment Instructions

This document explains how to deploy the layout fixes and durable save/resume functionality.

## Changes Summary

### 1. Layout Updates
- ✅ Added CSS constant `--header-h: 64px` for sticky header height
- ✅ Implemented grid-based page layout with Progress Ladder sidebar
- ✅ Updated sidebar with exact spacing and styling specifications
- ✅ Centered content column with `max-w-3xl`
- ✅ Added `scroll-mt-20` for proper hash navigation

### 2. Database Changes
New migration file: `supabase/migrations/003_add_resume_token.sql`

**Changes:**
- Added `resume_token` UUID column to `sessions` table (auto-generated, unique)
- Extended session expiration to 30 days (from 7 days)
- Added `meta` JSONB column to `assessments` for progress tracking
- Updated RLS policies for resume token access

### 3. API Updates (Supabase Edge Functions)

**Updated Functions:**
- `start-assessment` - Now returns `resumeToken`, generates 30-day JWT
- `save-response` - Now accepts and saves `meta` field for progress
- `restart-assessment` - Returns `resumeToken` for new session

**New Function:**
- `session-resolve` - Validates resume token and returns session data

### 4. Client Updates
- New `src/lib/api.js` - Clean API wrapper for all endpoints
- Updated `EmailCapture.jsx` - Uses `startAssessment()` API
- Updated `Assessment.jsx` - Grid layout, Progress Ladder sidebar
- Updated `App.jsx` - Resume link handling via URL params

---

## Deployment Steps

### Step 1: Apply Database Migration

Option A - **Supabase CLI** (recommended):
```bash
# Push migration to remote database
supabase db push

# Or apply specific migration
supabase migration up
```

Option B - **Supabase Dashboard**:
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy contents of `supabase/migrations/003_add_resume_token.sql`
4. Execute the SQL

### Step 2: Deploy Edge Functions

Deploy the updated and new edge functions:

```bash
# Deploy all functions
supabase functions deploy start-assessment
supabase functions deploy save-response
supabase functions deploy restart-assessment
supabase functions deploy complete-assessment
supabase functions deploy session-resolve
```

**Required Environment Variables:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for server-side operations)
- `SUPABASE_ANON_KEY` - Anon key (for client operations)
- `JWT_SECRET` - Secret key for signing JWTs (use same as Supabase JWT secret)
- `APP_URL` - Your app URL (e.g., `https://app.com` or `http://localhost:5173`)

Set these in Supabase Dashboard → Settings → Edge Functions → Secrets

### Step 3: Update Client Environment

Update `.env` or `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Build and Deploy Frontend

```bash
# Install dependencies (if needed)
npm install

# Build for production
npm run build

# Preview build locally (optional)
npm run preview

# Deploy to your hosting platform
# (Vercel, Netlify, etc.)
```

---

## Testing Checklist

### Layout
- [ ] Sidebar shows "Sections" label above Progress Ladder
- [ ] Sidebar has 240px width on desktop, 200px on tablet
- [ ] Sidebar is sticky and scrollable
- [ ] Content column is centered with max-w-3xl
- [ ] Hash navigation scrolls without hiding headings
- [ ] Mobile drawer works correctly

### Save/Resume/Restart
- [ ] Starting assessment creates session with resume_token
- [ ] Console logs resume URL (check server logs)
- [ ] Responses auto-save every 300ms (check Network tab)
- [ ] Resume link (`/assessment/resume?token=...`) restores state
- [ ] Resume link works after closing browser
- [ ] Completed assessments cannot be resumed
- [ ] Expired sessions show appropriate error

### Progress States
- [ ] Active section: blue circle, blue label, shadow
- [ ] Completed section: blue circle, gray label
- [ ] Upcoming section: white circle, light gray label
- [ ] Connectors change color based on state

---

## Email Integration (Optional)

The `start-assessment` function includes a TODO for email integration:

```typescript
// TODO: Integrate with email service (SendGrid, Resend, etc.)
const resumeUrl = `${appUrl}/assessment/resume?token=${session.resume_token}`;

// Example with Resend:
// await fetch('https://api.resend.com/emails', {
//   method: 'POST',
//   headers: {
//     'Authorization': `Bearer ${RESEND_API_KEY}`,
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     from: 'noreply@yourdomain.com',
//     to: email,
//     subject: 'Your Am I Called? resume link',
//     html: `<p>Hi ${first_name},</p>
//            <p>Click here to resume your assessment:</p>
//            <a href="${resumeUrl}">Resume Assessment</a>`
//   })
// });
```

---

## Rollback Plan

If issues occur:

1. **Database**: Run reverse migration if needed
2. **Edge Functions**: Redeploy previous versions
3. **Frontend**: Rollback to previous commit and redeploy

---

## Support

For issues or questions, check:
- Supabase logs: Dashboard → Logs
- Edge Function logs: Dashboard → Edge Functions → [function name] → Logs
- Browser console for client-side errors
