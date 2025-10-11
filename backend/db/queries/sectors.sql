-- name: GetSectors :many
SELECT * FROM sectors;
-- name: GetSectorsByCompany :many
SELECT s.id, s.name
FROM profile_sectors cs
JOIN sectors s ON s.id = cs.sector_id
WHERE cs.company_id = $1
ORDER BY s.name;

-- name: AddCompanySector :one
INSERT INTO profile_sectors(company_id, sector_id)
VALUES($1, $2)
RETURNING *;
-- name: RemoveCompanySector :exec
DELETE FROM profile_sectors
WHERE company_id = $1 AND sector_id = $2;

