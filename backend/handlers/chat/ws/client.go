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

func (c *Client) readPump(ctx context.Context) {
	defer func() {
		c.hub.unregister <- c
		c.Cancel()
		_ = c.conn.Close(websocket.StatusAbnormalClosure, "closing")
	}()
	for {
		_, data, err := c.conn.Read(ctx)
		if err != nil {
			log.Printf("Error reading: %v", err)
			break
		}
		var msg Message
		if err := json.Unmarshal(data, &msg); err != nil {
			log.Printf("bad message: %v", err)
			continue
		}
		msg.ChatRoomID = c.chatRoomID
		msg.UserID = c.userID
		c.hub.broadcast <- msg
	}
}

func (c *Client) writePump(ctx context.Context) {
	defer func() {
		log.Printf("closing writepump")
		_ = c.conn.Close(websocket.StatusNormalClosure, "closing writepump")
	}()
	for {
		select {
		case msg, ok := <-c.send:
			if !ok {
				_ = c.conn.Close(websocket.StatusNormalClosure, "send channel failed")
				log.Printf("writePump channel closed")
				return
			}
			if err := c.conn.Write(ctx, websocket.MessageText, msg); err != nil {
				log.Printf("writePump error: %v", err)
				return
			}
		case <-ctx.Done():
			log.Printf("context cancelled")
			return
		}
	}
}
