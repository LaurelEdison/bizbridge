-- name: CreateCustomer :one
INSERT INTO customers (id, name, email, password_hash, country, description, photourl, created_at, updated_at)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING *;

-- name: GetCustomerByID :one
SELECT * FROM customers WHERE id = $1;
-- name: GetCustomerByEmail :one
SELECT * FROM customers WHERE email = $1;
