package ws

import (
	"encoding/json"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type Hub struct {
	rooms      map[uuid.UUID]map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan Message
}

func NewHub() *Hub {
	return &Hub{
		rooms:      make(map[uuid.UUID]map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan Message),
	}
}

func Run(h *Hub, logger *zap.Logger) {
	for {
		select {
		case client := <-h.register:
			logger.Info("Registering client", zap.String("Chat room id", client.chatRoomID.String()), zap.String("user id", client.userID.String()))
			if h.rooms[client.chatRoomID] == nil {
				h.rooms[client.chatRoomID] = make(map[*Client]bool)
			}
			h.rooms[client.chatRoomID][client] = true

		case client := <-h.unregister:
			logger.Info("Unregistering client", zap.String("Chat room id", client.chatRoomID.String()), zap.String("user id", client.userID.String()))
			delete(h.rooms[client.chatRoomID], client)
			if len(h.rooms[client.chatRoomID]) == 0 {
				delete(h.rooms, client.chatRoomID)
			}
		case msg := <-h.broadcast:
			b, err := json.Marshal(msg)
			if err != nil {
				continue
			}
			logger.Info("Attempting message", zap.ByteString("json", b))
			for c := range h.rooms[msg.ChatRoomID] {
				select {
				case c.send <- b:
				default:
					close(c.send)
					delete(h.rooms[msg.ChatRoomID], c)
				}
			}

		}
	}
}

func (h *Hub) BroadcastMsg(msg Message) {
	h.broadcast <- msg
}
