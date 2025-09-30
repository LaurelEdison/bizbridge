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

