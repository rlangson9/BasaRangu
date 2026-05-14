-- BasaRangu PostgreSQL Schema

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  email TEXT,
  address TEXT,
  city TEXT,
  roles TEXT[] DEFAULT ARRAY['user']::TEXT[],
  active_role TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT false,
  wallet DECIMAL(12,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  id_verified BOOLEAN DEFAULT false,
  id_document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT DEFAULT 'errand',
  location TEXT NOT NULL,
  budget DECIMAL(10,2),
  urgency TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'open',
  accepted_applicant_id UUID,
  payment_id UUID,
  dispute_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  quote DECIMAL(10,2),
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2),
  provider_amount DECIMAL(10,2),
  method TEXT NOT NULL,
  reference TEXT,
  status TEXT DEFAULT 'pending',
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  from_user_id UUID REFERENCES users(id),
  target_user_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes table
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_payments_job_id ON payments(job_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_reviews_target_user_id ON reviews(target_user_id);
CREATE INDEX idx_messages_job_id ON messages(job_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_users_phone ON users(phone);

-- KV Store for caching/sessions (keep for simple use cases)
CREATE TABLE IF NOT EXISTS kv_store (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kv_store_key ON kv_store(key);
CREATE INDEX idx_kv_store_expires ON kv_store(expires_at);

-- ============================================
-- SMART FEED TABLES
-- ============================================

-- User Preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferred_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  preferred_locations TEXT[] DEFAULT ARRAY[]::TEXT[],
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  urgency_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
  rating_min DECIMAL(3,2),
  experience_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Interactions table (for learning behavior)
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'click', 'view', 'chat', 'apply', 'bookmark'
  target_type TEXT NOT NULL, -- 'job', 'provider', 'runner', 'recruiter'
  target_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}', -- additional context (category, location, etc.)
  weight DECIMAL(5,2) DEFAULT 1.0, -- for recommendation algorithm
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Category Affinities (for faster recommendations)
CREATE TABLE IF NOT EXISTS user_category_affinities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  affinity_score DECIMAL(5,2) DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- Indexes for smart feed performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_user_interactions_target ON user_interactions(target_type, target_id);
CREATE INDEX idx_user_interactions_created ON user_interactions(created_at);
CREATE INDEX idx_user_affinities_user_id ON user_category_affinities(user_id);
CREATE INDEX idx_user_affinities_category ON user_category_affinities(category);
CREATE INDEX idx_user_affinities_score ON user_category_affinities(affinity_score DESC);
