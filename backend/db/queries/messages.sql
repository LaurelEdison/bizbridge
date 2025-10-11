-- name: CreateMessage :one
INSERT INTO messages(id, chat_room_id, sender_id, content, sent_at, role)
VALUES($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetMessages :many
SELECT * FROM messages WHERE chat_room_id = $1;
