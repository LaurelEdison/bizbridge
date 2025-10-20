-- +goose Up 
CREATE TABLE company_files(
id UUID PRIMARY KEY,
company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
category TEXT NOT NULL,
file_name TEXT NOT NULL,
url TEXT NOT NULL,
uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose Down
DROP TABLE company_files;
