-- name: CreateChatRoom :one
INSERT INTO chat_rooms(id, customer_id, company_id, created_at, updated_at, company_name, customer_name)
VALUES($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (company_id, customer_id) DO UPDATE SET updated_at = EXCLUDED.updated_at
RETURNING *;

-- name: GetUserChatRooms :many
SELECT * FROM chat_rooms WHERE customer_id = $1 or company_id = $1;
