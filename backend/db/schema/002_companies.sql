-- +goose Up 
CREATE TABLE companies(
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  photourl TEXT,
  username TEXT
);
-- +goose Down
DROP TABLE customers;
