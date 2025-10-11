-- +goose Up 
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO sectors (id, name)
VALUES
  (gen_random_uuid(), 'Technology'),
  (gen_random_uuid(), 'Finance'),
  (gen_random_uuid(), 'Healthcare'),
  (gen_random_uuid(), 'Education'),
  (gen_random_uuid(), 'Manufacturing'),
  (gen_random_uuid(), 'Retail'),
  (gen_random_uuid(), 'Transportation'),
  (gen_random_uuid(), 'Energy')
ON CONFLICT DO NOTHING;
-- +goose Down
DELETE FROM sectors *;
