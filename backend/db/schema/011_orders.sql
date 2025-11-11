-- +goose Up 
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  escrow_id UUID REFERENCES escrow_accounts(id) ON DELETE CASCADE,
  total_amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','paid','in_progress','completed','cancelled','refunded')),
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose Down 
DROP TABLE orders;
