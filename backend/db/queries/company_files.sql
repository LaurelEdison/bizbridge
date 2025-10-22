-- name: CreateCompanyFile :one
INSERT INTO company_files (id, company_id, category, file_name, url, uploaded_at) 
VALUES ( $1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: DeleteCompanyFile :exec
DELETE FROM company_files WHERE id = $1;

-- name: GetCompanyFilesFromCompanyID :many
SELECT * FROM company_files WHERE company_id = $1;

-- name: GetCompanyBannersFromCompanyID :many
SELECT * FROM company_banners where company_id = $1;

-- name: CreateCompanyBanner :one
INSERT INTO company_banners (id, company_id, file_name, url, uploaded_at) 
VALUES ( $1, $2, $3, $4, $5)
RETURNING *;
