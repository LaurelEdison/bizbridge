package ws

import (
	"context"
	"encoding/json"
	"log"

	"github.com/coder/websocket"
	"github.com/google/uuid"
)

type Client struct {
	hub        *Hub
	conn       *websocket.Conn
	send       chan []byte
	chatRoomID uuid.UUID
	userID     uuid.UUID
	Cancel     context.CancelFunc
}

func NewClient(h *Hub, c *websocket.Conn, crID uuid.UUID, uID uuid.UUID) *Client {
	return &Client{
		hub:        h,
		conn:       c,
		chatRoomID: crID,
		userID:     uID,
	}
}

