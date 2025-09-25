package handlers

import (
	"github.com/LaurelEdison/bizbridge/internal/database"
	"go.uber.org/zap"
)

type Handlers struct {
	ZapLogger *zap.Logger
	DB        *database.Queries
}

func New(zapLogger *zap.Logger, DB *database.Queries) *Handlers {
	return &Handlers{
		ZapLogger: zapLogger,
		DB:        DB,
	}
}
