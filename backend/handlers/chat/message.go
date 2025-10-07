package chat

import (
	"database/sql"
	"encoding/json"
	"net/http"

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
		Message, err := h.DB.CreateMessage(r.Context(), database.CreateMessageParams{
			ID:         uuid.New(),
			ChatRoomID: chatRoomID,
			SenderID:   id,
			Content:    sql.NullString{String: params.Content, Valid: true},
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create message")
			return
		}
		h.Hub.BroadcastMsg(ws.Message{
			UserID:     id,
			ChatRoomID: chatRoomID,
			Type:       "chat",
			Payload:    handlers.DatabaseMessageToMessage(Message),
		})
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseMessageToMessage(Message))
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

		messages, err := h.DB.GetMessages(r.Context(), chatRoomID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get messages")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseMessagesToMessages(messages))
	}
}
