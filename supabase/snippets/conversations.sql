CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  client_anonymous_id TEXT,
  client_color TEXT,
  client_reputation_level INT DEFAULT 1,
  client_verified BOOLEAN DEFAULT false,
  last_message_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);