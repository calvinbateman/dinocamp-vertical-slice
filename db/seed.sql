-- Seed data: exactly 4 users
INSERT INTO users (first_name, last_name, email) VALUES
  ('Alice', 'Rex', 'alice.rex@example.com'),
  ('Bob', 'Saurus', 'bob.saurus@example.com'),
  ('Claire', 'Dactyl', 'claire.dactyl@example.com'),
  ('Dan', 'Don', 'dan.don@example.com')
ON CONFLICT (email) DO NOTHING;
