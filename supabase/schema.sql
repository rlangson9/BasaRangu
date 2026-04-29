-- BasaRangu Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- KV Store Table (main data storage)
CREATE TABLE IF NOT EXISTS kv_store_5ed51d91 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for prefix queries (used by getByPrefix)
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_5ed51d91 (key varchar_pattern_ops);

-- Enable Row Level Security
ALTER TABLE kv_store_5ed51d91 ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON kv_store_5ed51d91
  FOR ALL USING (auth.role() = 'service_role');

-- Policy: Authenticated users can read their own data
CREATE POLICY "Users can read their own data" ON kv_store_5ed51d91
  FOR SELECT USING (
    key LIKE 'user:' || (SELECT id FROM auth.uid() LIMIT 1) || '%'
    OR key LIKE 'token:%'
  );

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-update
CREATE TRIGGER update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_5ed51d91
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Analytics tables for reporting (optional enhanced tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events (user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events (created_at);

-- Chat message history for longer retention (beyond KV store)
CREATE TABLE IF NOT EXISTS message_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT,
  user_avatar TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_history_job ON message_history (job_id);
CREATE INDEX IF NOT EXISTS idx_message_history_created ON message_history (created_at);

-- Job applications history
CREATE TABLE IF NOT EXISTS application_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id TEXT NOT NULL,
  applicant_id TEXT NOT NULL,
  quote DECIMAL(10,2),
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_application_history_job ON application_history (job_id);
CREATE INDEX IF NOT EXISTS idx_application_history_applicant ON application_history (applicant_id);

-- Payments ledger for compliance
CREATE TABLE IF NOT EXISTS payment_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id TEXT UNIQUE NOT NULL,
  job_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2),
  provider_amount DECIMAL(10,2),
  method TEXT,
  status TEXT DEFAULT 'pending',
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_ledger_job ON payment_ledger (job_id);
CREATE INDEX IF NOT EXISTS idx_payment_ledger_user ON payment_ledger (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_ledger_status ON payment_ledger (status);

-- Comments for documentation
COMMENT ON TABLE kv_store_5ed51d91 IS 'Main key-value store for BasaRangu app data';
COMMENT ON TABLE analytics_events IS 'Event tracking for analytics';
COMMENT ON TABLE message_history IS 'Long-term chat message storage';
COMMENT ON TABLE application_history IS 'Job application tracking';
COMMENT ON TABLE payment_ledger IS 'Payment transactions ledger for compliance';
