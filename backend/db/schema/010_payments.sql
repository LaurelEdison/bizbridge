-- +goose Up 
-- Each user has a wallet
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  owner_role TEXT NOT NULL CHECK (owner_role IN ('customer','company')),
  owner_id UUID NOT NULL,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (owner_role, owner_id)
);
-- Escrow accounts (locked funds between buyer & seller)
CREATE TABLE escrow_accounts (
  id UUID PRIMARY KEY,
  investor_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','released','refunded')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  released_at TIMESTAMP
);

-- Ledger of money movement
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (
    transaction_type IN ('deposit','withdrawal','escrow_hold','escrow_release','escrow_refund')
  ),
  related_escrow_id UUID REFERENCES escrow_accounts(id) ON DELETE CASCADE,
  idempotency_key VARCHAR UNIQUE,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Audit log 
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_role TEXT CHECK (user_role IN ('company','customer','system')),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- +goose Down 
DROP TABLE audit_logs;
DROP TABLE transactions;
DROP TABLE escrow_accounts;
DROP TABLE wallets;
