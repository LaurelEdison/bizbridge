-- name: CreateWallet :one
INSERT INTO wallets(id, owner_role, owner_id, balance, currency, created_at, updated_at)
VALUES($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: DepositFunds :one
UPDATE wallets 
SET balance = balance + $3, updated_at = Now()
WHERE owner_role = $1 AND owner_id = $2
RETURNING *;

-- name: DeductFunds :one
UPDATE wallets 
SET balance = balance - $3, updated_at = Now()
WHERE owner_role = $1 AND owner_id = $2 AND balance >= $3
RETURNING *;

-- name: GetWallet :one
SELECT * FROM wallets WHERE owner_role = $1 AND owner_id = $2;

-- name: CheckBalance :one
SELECT balance FROM wallets WHERE owner_role = $1 AND owner_id = $2;

-- name: CreateTransaction :one
INSERT INTO transactions(id, wallet_id, amount, transaction_type, related_escrow_id, idempotency_key, created_at, updated_at)
VALUES($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING *;

-- name: CreateEscrowAccount :one
INSERT INTO escrow_accounts(id, investor_id, business_id, amount, status, created_at, updated_at, released_at)
VALUES($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: ReleaseEscrowAccount :one
UPDATE escrow_accounts
SET status = 'released', released_at = Now(), updated_at = Now()
WHERE id = $1 AND status = 'pending'
RETURNING *;

-- name: EscrowRefund :one
UPDATE escrow_accounts
SET status = 'refunded', updated_at = Now()
WHERE id = $1 AND status = 'pending'
RETURNING *;

-- name: GetEscrowByID :one
SELECT * FROM escrow_accounts WHERE id = $1;
-- name: GetEscrowByCompanyID :many
SELECT * FROM escrow_accounts WHERE business_id = $1;
-- name: GetEscrowByCustomerID :many
SELECT * FROM escrow_accounts WHERE investor_id = $1;

-- name: CreateAuditLog :one
INSERT INTO audit_logs(id, user_role, user_id, action, created_at, updated_at)
VALUES($1, $2, $3, $4, $5, $6)
RETURNING *;

