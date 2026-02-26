CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID,
  from_type TEXT CHECK (from_type IN ('professional', 'client')),
  from_id TEXT,
  to_type TEXT CHECK (to_type IN ('professional', 'client')),
  to_id TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);