package routes

import (
	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/healthz"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"go.uber.org/zap"
)

func SetupRoutes(h *handlers.Handlers, router chi.Router) {
	router.Get("/healthz", healthz.HandlerHealth(h))
}
