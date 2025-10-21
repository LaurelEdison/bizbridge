-- +goose Up 
CREATE TABLE customer_files(
id UUID PRIMARY KEY,
customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
category TEXT NOT NULL,
file_name TEXT NOT NULL,
url TEXT NOT NULL,
uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose Down
DROP TABLE customer_files;
