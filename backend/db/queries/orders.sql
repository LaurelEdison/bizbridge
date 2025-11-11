-- name: CreateOrder :one
INSERT INTO orders(id, company_id, customer_id, escrow_id, total_amount, status, description, created_at, updated_at)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: PaidOrder :one
UPDATE orders
SET status = 'paid', updated_at = Now()
WHERE id = $1 AND status = 'pending'
RETURNING *;

-- name: RefundOrder :one
UPDATE orders
SET status = 'refunded', updated_at = Now()
WHERE id = $1 AND status = 'in_progress'
RETURNING *;

-- name: CompleteOrder :one
UPDATE orders
SET status = 'completed', updated_at = Now()
WHERE id = $1 AND status = 'in_progress'
RETURNING *;

-- name: CancelOrder :one
UPDATE orders
SET status = 'cancelled', updated_at = Now()
WHERE id = $1 AND status = 'in_progress'
RETURNING *;


-- name: GetOrderByID :one
SELECT * FROM orders WHERE id = $1;
-- name: GetOrdersByCompanyID :many
SELECT * FROM orders WHERE company_id = $1;
-- name: GetOrdersByCustomerID :many
SELECT * FROM orders WHERE customer_id = $1;
