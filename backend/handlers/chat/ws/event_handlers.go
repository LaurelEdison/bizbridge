package ws

import (
	"context"
	"net/http"

	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/coder/websocket"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func HandleMessage(c *Client, msg Message) {
	switch msg.Type {
	case "chat":
		c.hub.broadcast <- msg
	}
}

func ServeWS(hub *Hub, logger *zap.Logger, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true, //TODO: Only for dev testing
	})
	if err != nil {
		apiutils.RespondWithError(logger, w, http.StatusBadRequest, "Websocket upgrade failed")
		return
	}

	chatRoomIDStr := chi.URLParam(r, "chat_room_id")
	chatRoomID, err := uuid.Parse(chatRoomIDStr)
	if err != nil {
		apiutils.RespondWithError(logger, w, http.StatusBadRequest, "Failed to parse chatroom id")
		return
	}
	claims, ok := auth.GetClaims(r.Context())
	if !ok {
		apiutils.RespondWithError(logger, w, http.StatusUnauthorized, "Could not get claims")
		return
	}
	idstr := claims["id"].(string)
	id, err := uuid.Parse(idstr)
	if err != nil {
		apiutils.RespondWithError(logger, w, http.StatusBadRequest, "Invalid id")
		return
	}
	logger.Info("New websocket connection attempt", zap.String("chat_room_id", chatRoomIDStr), zap.String("user id", id.String()))

	ctx, cancel := context.WithCancel(context.Background())

	client := &Client{
		hub:        hub,
		conn:       conn,
		send:       make(chan []byte, 256),
		chatRoomID: chatRoomID,
		userID:     id,
		Cancel:     cancel,
	}
	hub.register <- client
	logger.Info("Client registered", zap.String("chat_room_id", chatRoomIDStr), zap.String("user id", id.String()))

	go func() {
		defer func() {
			hub.unregister <- client
			client.Cancel()
			_ = conn.Close(websocket.StatusNormalClosure, "closing connection")
		}()

		done := make(chan struct{})

		go func() {
			client.readPump(ctx)
			close(done)
		}()

		go func() {
			client.writePump(ctx)
			close(done)
		}()

		<-done
	}()
}
