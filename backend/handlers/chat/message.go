package chat

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/handlers/chat/ws"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func CreateMessage(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		claims, ok := auth.GetClaims(r.Context())
		if !ok {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusUnauthorized, "Invalid claims")
			return
		}
		idstr := claims["id"].(string)
		id, err := uuid.Parse(idstr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusUnauthorized, "Invalid id")
			return
		}
		role := claims["role"].(string)

		chatRoomIDStr := chi.URLParam(r, "chat_room_id")
		chatRoomID, err := uuid.Parse(chatRoomIDStr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not parse chatroom id")
			return
		}

		type Parameters struct {
			Content  string  `json:"content"`
			FileUrl  *string `json:"file_url"`
			FileName *string `json:"file_name"`
			FileSize *string `json:"file_size"`
		}
		params := &Parameters{}
		decoder := json.NewDecoder(r.Body)
		err = decoder.Decode(params)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}
		DBMessage, err := h.DB.CreateMessage(r.Context(), database.CreateMessageParams{
			ID:         uuid.New(),
			ChatRoomID: chatRoomID,
			SenderID:   id,
			Content:    sql.NullString{String: params.Content, Valid: true},
			Role:       role,
			SentAt:     sql.NullTime{Time: time.Now(), Valid: true},
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create message")
			return
		}
		message := handlers.DatabaseMessageToMessage(DBMessage)
		if role == "customer" {
			customer, _ := h.DB.GetCustomerByID(r.Context(), DBMessage.SenderID)
			message.Sender = handlers.User{
				ID:    customer.ID,
				Role:  role,
				Name:  customer.Name,
				Email: customer.Email,
			}
		}
		if role == "company" {
			company, _ := h.DB.GetCompanyByID(r.Context(), DBMessage.SenderID)
			message.Sender = handlers.User{
				ID:    company.ID,
				Role:  role,
				Name:  company.Name,
				Email: company.Email,
			}
		}
		h.Hub.BroadcastMsg(ws.Message{
			UserID:     id,
			ChatRoomID: chatRoomID,
			Type:       "chat",
			Payload:    message,
		})
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, message)
	}
}

func GetMessages(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		chatRoomIDStr := chi.URLParam(r, "chat_room_id")
		chatRoomID, err := uuid.Parse(chatRoomIDStr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not parse chatroom id")
			return
		}

		DBMessages, err := h.DB.GetMessages(r.Context(), chatRoomID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get messages")
			return
		}

		messages := make([]handlers.Message, 0, len(DBMessages))
		for _, DBMessage := range DBMessages {
			msg := handlers.DatabaseMessageToMessage(DBMessage)
			var sender handlers.User
			switch DBMessage.Role {
			case "customer":
				customer, _ := h.DB.GetCustomerByID(r.Context(), DBMessage.SenderID)
				sender = handlers.User{
					ID:    customer.ID,
					Name:  customer.Name,
					Email: customer.Email,
					Role:  "customer",
				}

			case "company":
				company, _ := h.DB.GetCompanyByID(r.Context(), DBMessage.SenderID)
				sender = handlers.User{
					ID:    company.ID,
					Name:  company.Name,
					Email: company.Email,
					Role:  "customer",
				}
			}
			msg.Sender = sender
			messages = append(messages, msg)
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, messages)
	}
}
