package ws

import "github.com/google/uuid"

type Message struct {
	UserID     uuid.UUID `json:"user_id"`
	ChatRoomID uuid.UUID `json:"chat_room_id"`
	Type       string    `json:"type"`
	Payload    any       `json:"payload"`
}
