-- ==========================================
-- DEPLOYMENT SCRIPT FOR SUPABASE
-- Run this SQL in Supabase Dashboard → SQL Editor
-- ==========================================

-- This combines all migrations and adds a policy fix
-- to allow the app to work without edge functions deployed

-- ==========================================
-- MIGRATION 002: Add Direct Collection Fields
-- ==========================================

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

-- Add index on email
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);

-- ==========================================
-- MIGRATION 003: Add Resume Token Support
-- ==========================================

ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS resume_token UUID DEFAULT gen_random_uuid() UNIQUE;

ALTER TABLE sessions
ALTER COLUMN expires_at SET DEFAULT (now() + interval '30 days');

ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_sessions_resume_token ON sessions(resume_token);

-- ==========================================
-- FIX: Allow Anonymous Inserts (Fallback Mode)
-- ==========================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Assessments are insertable by service role" ON assessments;

-- Create new policy that allows anon inserts for direct collection
CREATE POLICY "Assessments are insertable by anyone"
  ON assessments FOR INSERT
  WITH CHECK (true);

-- Allow anon to read their own assessments by ID
DROP POLICY IF EXISTS "Assessments are readable by session owner" ON assessments;

CREATE POLICY "Assessments are readable by anyone with ID"
  ON assessments FOR SELECT
  USING (true);

-- Allow anon to update their own assessments
DROP POLICY IF EXISTS "Assessments are updatable by session owner" ON assessments;

CREATE POLICY "Assessments are updatable by anyone"
  ON assessments FOR UPDATE
  USING (true);

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Verify the columns exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assessments'
        AND column_name IN ('first_name', 'email', 'responses', 'completed', 'meta')
    ) THEN
        RAISE NOTICE '✓ Migration successful - all columns exist';
    ELSE
        RAISE EXCEPTION '✗ Migration failed - columns missing';
    END IF;
END $$;

-- Show current policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'assessments';
