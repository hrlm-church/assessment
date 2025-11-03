-- Add resume token support for durable sessions
-- Allows users to resume via magic link email

-- Add resume_token to sessions table
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS resume_token UUID DEFAULT gen_random_uuid() UNIQUE;

-- Update expiration to 30 days (from 7 days)
ALTER TABLE sessions
ALTER COLUMN expires_at SET DEFAULT (now() + interval '30 days');

-- Add meta column to assessments for tracking progress state
ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

-- Create index on resume_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_sessions_resume_token ON sessions(resume_token);

-- Update RLS policy for resume token resolution
CREATE POLICY "Sessions are readable by resume token"
  ON sessions FOR SELECT
  USING (
    resume_token::text = current_setting('request.resume_token', true)
    OR id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
  );

-- Drop old policy if it conflicts
DROP POLICY IF EXISTS "Sessions are readable by session owner" ON sessions;

-- Recreate sessions select policy
CREATE POLICY "Sessions are readable by session owner"
  ON sessions FOR SELECT
  USING (
    id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
  );

COMMENT ON COLUMN sessions.resume_token IS 'Unique token for resume link (magic link email)';
COMMENT ON COLUMN assessments.meta IS 'Progress metadata (current section, index, etc.)';
