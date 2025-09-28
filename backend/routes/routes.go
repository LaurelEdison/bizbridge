package routes

import (
	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/handlers/customer"
	"github.com/LaurelEdison/bizbridge/handlers/healthz"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"go.uber.org/zap"
)

func SetupRoutes(h *handlers.Handlers, router chi.Router) {
	router.Get("/healthz", healthz.HandlerHealth(h))
	router.Post("/customer", customer.CreateCustomer(h))
	router.Post("/customer/login", auth.Login(h))

	router.Group(func(router chi.Router) {
		router.Use(auth.JWTAuthMiddleware)
		router.Get("/customer/me", auth.JWTAuthMiddleware(customer.GetMe(h)).ServeHTTP)
		router.Patch("/customer/update", customer.UpdateCustomerDetails(h))

	})

	//TODO: Add router groups for admin only ops
}

// TODO: Change to less permissive in prod
func SetupCors(zapLogger *zap.Logger, router chi.Router) {
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"}, // Allow all origins for dev
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"}, // Accept all headers
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	zapLogger.Info("CORS middleware configuered")
}
