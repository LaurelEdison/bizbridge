-- +goose Up 
CREATE TABLE companies(
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  photourl TEXT,
  username TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose Down
DROP TABLE customers;
