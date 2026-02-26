CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  age INT,
  city TEXT,
  bio TEXT,
  tags TEXT[],
  verification_status TEXT DEFAULT 'pending',
  subscription_tier TEXT DEFAULT 'free',
  max_photos INT DEFAULT 5,
  max_videos INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);