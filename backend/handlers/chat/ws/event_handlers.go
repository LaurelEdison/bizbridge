package ws

import (
	"context"
	"fmt"
	"net/http"

	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/coder/websocket"
	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt"
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
	//TODO: Change to http cookies
	tokenCookie := r.URL.Query().Get("token")
	if tokenCookie == "" {
		apiutils.RespondWithError(logger, w, http.StatusUnauthorized, "Could not get auth token")
		return
	}
	token, err := jwt.Parse(tokenCookie, func(t *jwt.Token) (any, error) {

		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["Alg"])
		}
		claims, ok := t.Claims.(jwt.MapClaims)
		if !ok {
			return nil, fmt.Errorf("invalid claims")
		}
		iss := claims["iss"].(string)
		switch iss {
		case auth.CustomerIssuer:
			return auth.ConfigKey.CustomerJWTKey, nil
		case auth.CompanyIssuer:
			return auth.ConfigKey.CompanyJWTKey, nil
		default:
			return nil, fmt.Errorf("invalid issuer")
		}
	})
	if err != nil {
		apiutils.RespondWithError(logger, w, http.StatusUnauthorized, "Invalid token")
		return
	}
	claims := token.Claims.(jwt.MapClaims)
	idstr := claims["id"].(string)
	id, err := uuid.Parse(idstr)
	if err != nil {
		apiutils.RespondWithError(logger, w, http.StatusUnauthorized, "Invalid id")
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
		go func() {
			client.readPump(ctx)
			client.Cancel()
		}()

		go func() {
			client.writePump(ctx)
			client.Cancel()
		}()

		<-ctx.Done()
	}()
}
