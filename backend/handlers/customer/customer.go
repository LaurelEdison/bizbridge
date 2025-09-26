package customer

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/LaurelEdison/bizbridge/utils"
	"github.com/google/uuid"
)

func CreateCustomer(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Parameters struct {
			Name        string `json:"name"`
			Email       string `json:"email"`
			Password    string `json:"password"`
			Country     string `json:"country"`
			Description string `json:"description"`
		}

		params := &Parameters{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&params)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
		}

		hashedPassword, err := utils.CreatePasswordHash(params.Password)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not create password")
		}

		customer, err := h.DB.CreateCustomer(r.Context(), database.CreateCustomerParams{
			ID:           uuid.New(),
			Name:         params.Name,
			PasswordHash: hashedPassword,
			Email:        params.Email,
			Country:      params.Country,
			Description:  sql.NullString{String: params.Description},
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create customer")
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCustomerToCustomer(customer))
	}
}

func GetCustomerByID(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		customerIDStr := chi.URLParam(r, "id")
		customerID, err := uuid.Parse(customerIDStr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Error parsign string")
			return
		}

		customer, err := h.DB.GetCustomerByID(r.Context(), customerID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get customer by id")
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCustomerToCustomer(customer))
	}
}
func GetCustomerByEmail(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		Email := chi.URLParam(r, "email")
		customer, err := h.DB.GetCustomerByEmail(r.Context(), Email)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get customer by email")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCustomerToCustomer(customer))
	}
}
