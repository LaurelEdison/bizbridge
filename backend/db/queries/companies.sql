-- name: CreateCompany :one
INSERT INTO companies(id, name, email, password_hash, address, description, photourl, username, created_at, updated_at)
	VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
	RETURNING *;
-- name: GetCompanyByID :one
SELECT * FROM companies WHERE id = $1;
-- name: GetCompanyByEmail :one
SELECT * FROM companies WHERE email = $1;


-- name: UpdateCompanyName :exec
-- name: UpdateCompanyAddress :exec
-- name: UpdateCompanyDescription :exec
-- name: UpdateCompanyPhotoUrl :exec
-- name: UpdateCompanyUsername :exec



--TODO: Implement these at some point

-- name: UpdateCompanyEmail :exec

-- name: UpdateCompanyPasswordHash :exec

