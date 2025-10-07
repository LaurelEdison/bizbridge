-- +goose Up 
CREATE TABLE chat_rooms(
id UUID PRIMARY KEY,
customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
company_id UUID  NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT unique_buyer_seller UNIQUE (customer_id, company_id)
);
-- +goose Down
DROP TABLE chat_rooms;
