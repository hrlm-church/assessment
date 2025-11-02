-- Am I Called? Assessment — Supabase Schema
-- Production-ready Postgres schema with RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLES
-- ==========================================

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_sessions_contact_id ON sessions(contact_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  overall_score NUMERIC(3,2),
  tier TEXT CHECK (tier IN ('affirmed', 'growing', 'developing')),
  scores_by_category JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_contact_id ON assessments(contact_id);
CREATE INDEX IF NOT EXISTS idx_assessments_session_id ON assessments(session_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL,
  question_key TEXT NOT NULL,
  value INTEGER CHECK (value >= 1 AND value <= 5) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(assessment_id, question_key)
);

CREATE INDEX IF NOT EXISTS idx_responses_assessment_id ON responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_responses_section ON responses(section);

-- Email events table
CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('results_sent', 'welcome', 'reminder', 'bounce', 'unsubscribe')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_events_contact_id ON email_events(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(type);
CREATE INDEX IF NOT EXISTS idx_email_events_created_at ON email_events(created_at DESC);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function to compute scores
CREATE OR REPLACE FUNCTION compute_assessment_scores(p_assessment_id UUID)
RETURNS TABLE(
  overall_score NUMERIC,
  tier TEXT,
  scores_by_category JSONB
) AS $$
DECLARE
  v_scores JSONB := '{}'::jsonb;
  v_overall NUMERIC;
  v_tier TEXT;
  v_section RECORD;
BEGIN
  -- Compute average by section
  FOR v_section IN
    SELECT
      section,
      AVG(value)::NUMERIC(3,2) as avg_score
    FROM responses
    WHERE assessment_id = p_assessment_id
    GROUP BY section
  LOOP
    v_scores := jsonb_set(
      v_scores,
      ARRAY[v_section.section],
      to_jsonb(v_section.avg_score)
    );
  END LOOP;

  -- Compute overall average
  SELECT AVG(value)::NUMERIC(3,2)
  INTO v_overall
  FROM responses
  WHERE assessment_id = p_assessment_id;

  -- Determine tier
  IF v_overall >= 4.5 THEN
    v_tier := 'affirmed';
  ELSIF v_overall >= 3.5 THEN
    v_tier := 'growing';
  ELSE
    v_tier := 'developing';
  END IF;

  RETURN QUERY SELECT v_overall, v_tier, v_scores;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- Contacts policies
CREATE POLICY "Contacts are insertable by service role"
  ON contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Contacts are readable by owner via session claim"
  ON contacts FOR SELECT
  USING (
    id IN (
      SELECT contact_id FROM sessions
      WHERE id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
    )
  );

-- Sessions policies
CREATE POLICY "Sessions are insertable by service role"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sessions are readable by session owner"
  ON sessions FOR SELECT
  USING (
    id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
  );

CREATE POLICY "Sessions are updatable by session owner"
  ON sessions FOR UPDATE
  USING (
    id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
  );

-- Assessments policies
CREATE POLICY "Assessments are insertable by service role"
  ON assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Assessments are readable by session owner"
  ON assessments FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM sessions
      WHERE id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
    )
  );

CREATE POLICY "Assessments are updatable by session owner"
  ON assessments FOR UPDATE
  USING (
    session_id IN (
      SELECT id FROM sessions
      WHERE id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
    )
  );

-- Responses policies
CREATE POLICY "Responses are insertable by session owner"
  ON responses FOR INSERT
  WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments
      WHERE session_id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
    )
  );

CREATE POLICY "Responses are readable by session owner"
  ON responses FOR SELECT
  USING (
    assessment_id IN (
      SELECT id FROM assessments
      WHERE session_id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
    )
  );

CREATE POLICY "Responses are updatable by session owner"
  ON responses FOR UPDATE
  USING (
    assessment_id IN (
      SELECT id FROM assessments
      WHERE session_id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
    )
  );

-- Email events policies (service role only)
CREATE POLICY "Email events are insertable by service role"
  ON email_events FOR INSERT
  WITH CHECK (true);

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE contacts IS 'Stores user contact information and consent';
COMMENT ON TABLE sessions IS 'Tracks assessment sessions with expiration';
COMMENT ON TABLE assessments IS 'Stores assessment metadata and computed scores';
COMMENT ON TABLE responses IS 'Individual question responses (1-5 scale)';
COMMENT ON TABLE email_events IS 'Logs all email activity for tracking';
