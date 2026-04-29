-- BasaRangu Additional Tables (Run after kv_store_5ed51d91 exists)

-- Analytics events for reporting
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

-- Long-term chat message storage
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
