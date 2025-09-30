package handlers

import (
	"github.com/LaurelEdison/bizbridge/handlers/chat/ws"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"go.uber.org/zap"
)

type Handlers struct {
	ZapLogger *zap.Logger
	DB        *database.Queries
	Hub       *ws.Hub
}

func New(zapLogger *zap.Logger, DB *database.Queries, Hub *ws.Hub) *Handlers {
	return &Handlers{
		ZapLogger: zapLogger,
		DB:        DB,
		Hub:       Hub,
	}
}
