package routes

import (
	"net/http"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/handlers/chat"
	"github.com/LaurelEdison/bizbridge/handlers/chat/ws"
	"github.com/LaurelEdison/bizbridge/handlers/company"
	"github.com/LaurelEdison/bizbridge/handlers/customer"
	"github.com/LaurelEdison/bizbridge/handlers/healthz"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"go.uber.org/zap"
)

func SetupRoutes(h *handlers.Handlers, router chi.Router) {
	router.Get("/healthz", healthz.HandlerHealth(h))

	router.Post("/customer", customer.CreateCustomer(h))
	router.Post("/company", company.CreateCompany(h))

	router.Post("/company/login", company.Login(h))
	router.Post("/customer/login", customer.Login(h))

	router.Get("/social/{chat_room_id}", func(w http.ResponseWriter, r *http.Request) {
		ws.ServeWS(h.Hub, h.ZapLogger, w, r)
	})
	router.Group(func(router chi.Router) {
		router.Use(auth.JWTAuthMiddleware)

		router.Get("/customer/me", customer.GetMe(h))
		router.Patch("/customer/update", customer.UpdateCustomerDetails(h))

		router.Get("/company/me", company.GetMe(h))
		router.Patch("/company/update", company.UpdateCompanyDetails(h))

		router.Post("/social/chat", chat.CreateChatRoom(h))
		router.Get("/social/chat", chat.GetUserChatRooms(h))
		router.Post("/social/{chat_room_id}/message", chat.CreateMessage(h))
		router.Get("/social/{chat_room_id}/message", chat.GetMessages(h))

	})

	//TODO: Add router groups for admin only ops
}

// TODO: Change to less permissive in prod
func SetupCors(zapLogger *zap.Logger, router chi.Router) {
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"}, // Allow all origins for dev
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"*"}, // Accept all headers
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	zapLogger.Info("CORS middleware configuered")
}
