-- name: CreateChatRoom :one
INSERT INTO chat_rooms(id, customer_id, company_id, created_at, updated_at)
VALUES($1, $2, $3, $4, $5)
RETURNING *;


