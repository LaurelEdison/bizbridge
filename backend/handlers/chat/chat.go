package chat

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func CreateChatRoom(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		claims, ok := auth.GetClaims(r.Context())
		if !ok {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusUnauthorized, "Invalid claims")
			return
		}
		role := claims["role"].(string)
		idstr := claims["id"].(string)
		id, err := uuid.Parse(idstr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid id")
			return
		}

		type Parameters struct {
			Recipient uuid.UUID `json:"recipient_id"`
		}
		params := &Parameters{}
		decoder := json.NewDecoder(r.Body)
		err = decoder.Decode(&params)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		if role == "company" {
			company, _ := h.DB.GetCompanyByID(r.Context(), id)
			customer, _ := h.DB.GetCustomerByID(r.Context(), params.Recipient)
			chatRoom, err := h.DB.CreateChatRoom(r.Context(), database.CreateChatRoomParams{
				ID:           uuid.New(),
				CreatedAt:    time.Now(),
				UpdatedAt:    time.Now(),
				CustomerID:   customer.ID,
				CustomerName: customer.Name,
				CompanyID:    company.ID,
				CompanyName:  company.Name,
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to create chatroom")
				return
			}
			apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseChatRoomToChatRoom(chatRoom))
		}
		if role == "customer" {
			company, _ := h.DB.GetCompanyByID(r.Context(), params.Recipient)
			customer, _ := h.DB.GetCustomerByID(r.Context(), id)
			chatRoom, err := h.DB.CreateChatRoom(r.Context(), database.CreateChatRoomParams{
				ID:           uuid.New(),
				CreatedAt:    time.Now(),
				UpdatedAt:    time.Now(),
				CustomerID:   customer.ID,
				CustomerName: customer.Name,
				CompanyID:    company.ID,
				CompanyName:  company.Name,
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to create chatroom")
				h.ZapLogger.Info("Error", zap.Error(err))
				return
			}
			apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseChatRoomToChatRoom(chatRoom))
		}

	}
}

//TODO: Need to normalize chat rooms output

func GetUserChatRooms(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		claims, ok := auth.GetClaims(r.Context())
		if !ok {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusUnauthorized, "Invalid claims")
			return
		}
		idstr := claims["id"].(string)
		id, err := uuid.Parse(idstr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid id")
			return
		}
		chatRooms := []handlers.ChatRoom{}
		dbChatRooms, err := h.DB.GetUserChatRooms(r.Context(), id)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to get chat rooms")
			return
		}

		for _, dbChatroom := range dbChatRooms {
			customer, _ := h.DB.GetCustomerByID(r.Context(), dbChatroom.CustomerID)
			company, _ := h.DB.GetCompanyByID(r.Context(), dbChatroom.CompanyID)
			chatRooms = append(chatRooms, handlers.ChatRoom{
				ID:               dbChatroom.ID,
				CustomerID:       customer.ID,
				CompanyID:        company.ID,
				CustomerName:     dbChatroom.CustomerName,
				CompanyName:      dbChatroom.CompanyName,
				CompanyPhotoUrl:  &company.Photourl.String,
				CustomerPhotoUrl: &customer.Photourl.String,
				CreatedAt:        dbChatroom.CreatedAt,
				UpdatedAt:        dbChatroom.UpdatedAt,
			})
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, chatRooms)

	}
}
