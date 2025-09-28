-- name: CreateCustomer :one
INSERT INTO customers (id, name, email, password_hash, country, description, photourl, created_at, updated_at)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING *;

-- name: GetCustomerByID :one
SELECT * FROM customers WHERE id = $1;
-- name: GetCustomerByEmail :one
SELECT * FROM customers WHERE email = $1;

-- name: UpdateCustomerName :exec
UPDATE customers
SET name = $2,
updated_at = $3
WHERE id = $1;

--TODO: Not implemented
-- name: UpdateCustomerEmail :exec
UPDATE customers
SET email = $2,
updated_at = $3
WHERE id = $1;

--TODO: Not implemented
-- name: UpdateCustomerPassword :exec
UPDATE customers
SET password_hash = $2,
updated_at = $3
WHERE id = $1;

-- name: UpdateCustomerCountry :exec
UPDATE customers
SET country = $2,
updated_at = $3
WHERE id = $1;

-- name: UpdateCustomerDescription :exec
UPDATE customers
SET description = $2,
updated_at = $3
WHERE id = $1;

-- name: UpdateCustomerPhotoUrl :exec
UPDATE customers
SET photourl = $2,
updated_at = $3
WHERE id = $1;
