# Am I Called? — Integration Guide

## Overview

This guide explains how to integrate the new Supabase backend with your existing "Am I Called?" assessment application. The implementation maintains all existing UI styling while adding production-ready backend functionality.

---

## 1. Environment Setup

### Required Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Frontend (.env):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Supabase Edge Functions Secrets:**
```bash
# Set secrets for Edge Functions
supabase secrets set JWT_SECRET=your-random-secret-key
supabase secrets set RESEND_API_KEY=your-resend-api-key
supabase secrets set MAILCHIMP_API_KEY=your-mailchimp-key (optional)
```

---

## 2. Database Setup

### Run Migration

Execute the schema migration in your Supabase SQL editor:

```bash
# If using Supabase CLI
supabase db push

# Or manually: Copy content from supabase/migrations/001_initial_schema.sql
# and run it in Supabase Dashboard > SQL Editor
```

This creates:
- `contacts` table (user emails and consent)
- `sessions` table (assessment sessions with 7-day expiry)
- `assessments` table (assessment records with scores)
- `responses` table (individual question answers)
- `email_events` table (email activity log)
- RLS policies for security
- `compute_assessment_scores()` function

---

## 3. Deploy Edge Functions

Deploy all five Edge Functions to Supabase:

```bash
cd supabase/functions

# Deploy each function
supabase functions deploy start-assessment
supabase functions deploy save-response
supabase functions deploy complete-assessment
supabase functions deploy restart-assessment
supabase functions deploy send-results
```

**Edge Functions:**
1. **start-assessment** - Creates contact, session, and assessment
2. **save-response** - Autosaves each answer (upsert)
3. **complete-assessment** - Computes scores and tier
4. **restart-assessment** - Abandons old session, creates new one
5. **send-results** - Emails results via Resend/SendGrid

---

## 4. Frontend Integration

### EmailCapture Component

✅ **Already Integrated**

The `EmailCapture.jsx` component now:
- Calls `/functions/v1/start-assessment`
- Stores `sessionId`, `assessmentId`, `contactId`, `sessionToken` in `localStorage`
- Validates consent checkbox
- Uses new copy: "Enter your name and email to receive your results..."

### Assessment Component

**TODO: Update to autosave responses**

Add this function to `Assessment.jsx`:

```javascript
const saveResponse = async (questionKey, value, section) => {
  const assessmentId = localStorage.getItem('aic_assessment_id');
  const sessionToken = localStorage.getItem('aic_session_token');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  await fetch(`${supabaseUrl}/functions/v1/save-response`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      assessmentId,
      section,
      questionKey,
      value,
    }),
  });
};
```

Call it whenever a radio button is selected:

```jsx
<input
  type="radio"
  value={scoreLabel.value}
  checked={responses[questionKey] === scoreLabel.value}
  onChange={() => {
    setResponses({ ...responses, [questionKey]: scoreLabel.value });
    saveResponse(questionKey, scoreLabel.value, currentCategory.id);
  }}
/>
```

### Results Component

**TODO: Update to call complete-assessment and send-results**

Add completion logic before showing results:

```javascript
useEffect(() => {
  const completeAssessment = async () => {
    const assessmentId = localStorage.getItem('aic_assessment_id');
    const contactId = localStorage.getItem('aic_contact_id');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    // Complete assessment and get scores
    const completeRes = await fetch(`${supabaseUrl}/functions/v1/complete-assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId }),
    });

    const scores = await completeRes.json();
    setResults(scores);

    // Send results email
    await fetch(`${supabaseUrl}/functions/v1/send-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, assessmentId }),
    });
  };

  completeAssessment();
}, []);
```

---

## 5. Important Implementation Notes

### No Default Selection Pattern

**CRITICAL:** Radio buttons must NOT have a default selection.

```jsx
// ❌ WRONG - always has a value
<input type="radio" name="q1" value="3" defaultChecked />

// ✅ CORRECT - starts unselected
const [answers, setAnswers] = useState({});

<input
  type="radio"
  checked={answers['godliness_disciplines'] === 1}
  onChange={() => {
    setAnswers({ ...answers, godliness_disciplines: 1 });
    saveResponse('godliness_disciplines', 1, 'godliness');
  }}
/>
```

### Session Management

Sessions expire after 7 days. Users can restart an assessment:

```javascript
const restartAssessment = async () => {
  const sessionId = localStorage.getItem('aic_session_id');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/restart-assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });

  const { sessionId: newSessionId, assessmentId, sessionToken } = await response.json();

  localStorage.setItem('aic_session_id', newSessionId);
  localStorage.setItem('aic_assessment_id', assessmentId);
  localStorage.setItem('aic_session_token', sessionToken);

  // Clear UI state
  setAnswers({});
};
```

---

## 6. Testing Checklist

### Backend Tests

- [ ] **Database**: Run migration successfully
- [ ] **Edge Functions**: All 5 functions deploy without errors
- [ ] **RLS Policies**: Cross-session reads/writes are blocked
- [ ] **Session Expiry**: Sessions expire after 7 days

### Frontend Tests

- [ ] **Email Capture**: Form validates, calls start-assessment, stores tokens
- [ ] **Autosave**: Each answer immediately saves to database
- [ ] **No Default**: No radio button is pre-selected
- [ ] **Progress**: Can resume assessment in same session
- [ ] **Complete**: Scores compute correctly
- [ ] **Email**: Results email arrives with correct copy
- [ ] **Restart**: Old session abandoned, new one created
- [ ] **Multiple Users**: Different users don't see each other's data

### Security Tests

- [ ] **RLS**: User A cannot read User B's responses
- [ ] **JWT**: Invalid session tokens are rejected
- [ ] **CORS**: Edge Functions accept requests from your domain
- [ ] **Consent**: Checkbox must be checked to proceed

---

## 7. Optional: Mailchimp/ConvertKit Sync

Sync contacts to your email list on capture:

```javascript
// In start-assessment Edge Function, add:
const syncToMailchimp = async (email) => {
  const response = await fetch(
    `https://us1.api.mailchimp.com/3.0/lists/${Deno.env.get('MAILCHIMP_LIST_ID')}/members`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('MAILCHIMP_API_KEY')}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['aic_assessment'],
      }),
    }
  );
};

// Call after contact creation
await syncToMailchimp(contact.email);
```

---

## 8. Copy Updates Summary

All copy has been updated per the specification while maintaining exact UI styling:

### Hero Page
- Title: "Am I Called?"
- Subtitle: "A 7-part discernment assessment rooted in Scripture and pastoral wisdom."
- Stats: "7 categories • 5–10 minutes • Private results"
- Features: "Data-informed", "Community-confirmed", "Next-step guidance"

### Email Capture
- Description: "Enter your name and email to receive your results and a free chapter from Am I Called?"
- Consent: "I agree to receive emails as described. We'll send occasional resources from Dave Harvey. Unsubscribe anytime."

### Assessment Questions
- All 58 questions updated per COPY_REWRITE.md
- Section descriptions updated (e.g., "Life with God that shapes life with people.")

### Results Page
- Title: "Your Assessment Results"
- Helper: "Use these insights to keep discerning with prayer, wise counsel, and faithful service."
- Tier messages updated to "affirmed", "growing", "developing"
- Next steps updated with new copy

---

## 9. Deployment

### Production Checklist

1. **Environment Variables**: Set all required env vars in production
2. **Supabase Project**: Create production project (separate from dev)
3. **Edge Functions**: Deploy to production Supabase project
4. **Domain**: Update CORS settings in Edge Functions for your domain
5. **Email Service**: Verify Resend/SendGrid API key works
6. **DNS**: Update from address in send-results function

### Build and Deploy

```bash
# Build frontend
npm run build

# Deploy to your hosting (Vercel, Netlify, etc.)
# Example for Vercel:
vercel --prod
```

---

## 10. Troubleshooting

### "Failed to start assessment"
- Check `VITE_SUPABASE_URL` is set correctly
- Verify Edge Function is deployed
- Check browser console for CORS errors

### "Email not sending"
- Verify `RESEND_API_KEY` is set in Supabase secrets
- Check Resend dashboard for delivery errors
- Update "from" address in send-results function

### "RLS policy blocks write"
- Verify session token is being sent in Authorization header
- Check JWT_SECRET matches between start-assessment and RLS policies

### "Responses not saving"
- Check sessionToken is stored in localStorage
- Verify save-response function is deployed
- Check browser network tab for 401/403 errors

---

## 11. Support

- **Supabase Docs**: https://supabase.com/docs
- **Edge Functions**: https://supabase.com/docs/guides/functions
- **Resend Docs**: https://resend.com/docs

---

## Summary

Your assessment app now has:
- ✅ Production-ready Supabase backend
- ✅ Session management with JWT
- ✅ Autosave functionality
- ✅ Email delivery with results
- ✅ Row-level security
- ✅ Updated pastoral copy
- ✅ Consent management
- ✅ All existing UI styling preserved

**Next Steps:**
1. Set up environment variables
2. Run database migration
3. Deploy Edge Functions
4. Test email capture flow
5. Update Assessment component with autosave
6. Update Results component with completion logic
7. Test end-to-end
8. Deploy to production
