CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  "order" INT DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);