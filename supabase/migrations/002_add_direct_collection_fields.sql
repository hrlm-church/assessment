-- Add contact info fields to assessments table for direct data collection
-- This allows storing user info without Edge Functions

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

-- Make contact_id and session_id nullable since we're storing data directly
ALTER TABLE assessments
ALTER COLUMN contact_id DROP NOT NULL,
ALTER COLUMN session_id DROP NOT NULL;

-- Add index on email for lookups
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);

COMMENT ON COLUMN assessments.first_name IS 'User first name (direct collection)';
COMMENT ON COLUMN assessments.last_name IS 'User last name (direct collection)';
COMMENT ON COLUMN assessments.email IS 'User email (direct collection)';
COMMENT ON COLUMN assessments.phone IS 'User phone number (optional)';
COMMENT ON COLUMN assessments.role IS 'Present role (plant, pastor, student, leader)';
COMMENT ON COLUMN assessments.marital_status IS 'Marital status (married, single)';
COMMENT ON COLUMN assessments.consent IS 'Email consent for Dave Harvey resources';
COMMENT ON COLUMN assessments.responses IS 'Assessment question responses (key-value pairs)';
COMMENT ON COLUMN assessments.completed IS 'Whether assessment is completed';
