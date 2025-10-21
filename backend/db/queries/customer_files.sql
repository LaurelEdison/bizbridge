-- name: CreateCustomerFile :one
INSERT INTO customer_files(id, customer_id, category, file_name, url, uploaded_at) 
VALUES ( $1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: DeleleCustomerFile :exec
DELETE FROM customer_files WHERE id = $1;

-- name: GetCustomerFilesFromCustomerID :many
SELECT * FROM customer_Files WHERE customer_id = $1;
