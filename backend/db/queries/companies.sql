-- name: CreateCompany :one
INSERT INTO companies(id, name, email, password_hash, address, description, photourl, username, created_at, updated_at)
	VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
	RETURNING *;
-- name: GetCompanyByID :one
SELECT * FROM companies WHERE id = $1;
-- name: GetCompanyByEmail :one
SELECT * FROM companies WHERE email = $1;


-- name: UpdateCompanyName :exec
UPDATE companies
SET name = $2,
updated_at =$3
WHERE id = $1;
-- name: UpdateCompanyAddress :exec
UPDATE companies
SET address = $2,
updated_at =$3
WHERE id = $1;
-- name: UpdateCompanyDescription :exec
UPDATE companies
SET description = $2,
updated_at =$3
WHERE id = $1;
-- name: UpdateCompanyPhotoUrl :exec
UPDATE companies
SET photourl = $2,
updated_at =$3
WHERE id = $1;
-- name: UpdateCompanyUsername :exec
UPDATE companies
SET username = $2,
updated_at =$3
WHERE id = $1;


--TODO: Implement these at some point

-- name: UpdateCompanyEmail :exec
UPDATE companies
SET email = $2,
updated_at =$3
WHERE id = $1;

-- name: UpdateCompanyPasswordHash :exec
UPDATE companies
SET password_hash = $2,
updated_at =$3
WHERE id = $1;

