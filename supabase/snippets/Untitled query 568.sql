INSERT INTO professionals (email, display_name, age, city, bio, tags)
VALUES (
  'sofia@example.com',
  'Sofia',
  28,
  'Milano',
  'Ciao, sono Sofia. Amo l''arte e le buone conversazioni.',
  ARRAY['madrelingua', 'arte', 'disponibile oggi']
)
RETURNING id;