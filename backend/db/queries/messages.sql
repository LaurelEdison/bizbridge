-- name: CreateMessage :one
INSERT INTO messages(id, chat_room_id, sender_id, content, sent_at)
VALUES($1, $2, $3, $4, $5)
RETURNING *;
