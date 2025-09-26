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
	"github.com/go-chi/chi/v5"
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

func UpdateCustomerDetails(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Parameters struct {
			Name        *string   `json:"name"`
			Country     *string   `json:"country"`
			Description *string   `json:"description"`
			Id          uuid.UUID `json:"id"` //TODO: Pass uid params through auth function
		}
		params := &Parameters{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&params)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		if params.Name != nil {
			err := h.DB.UpdateCustomerName(r.Context(), database.UpdateCustomerNameParams{
				ID:        params.Id,
				Name:      *params.Name,
				UpdatedAt: time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update user name")
				return
			}
		}

		if params.Country != nil {
			err := h.DB.UpdateCustomerCountry(r.Context(), database.UpdateCustomerCountryParams{
				ID:        params.Id,
				Country:   *params.Country,
				UpdatedAt: time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update user name")
				return
			}
		}

		if params.Description != nil {
			err := h.DB.UpdateCustomerDescription(r.Context(), database.UpdateCustomerDescriptionParams{
				ID:          params.Id,
				Description: sql.NullString{String: *params.Description, Valid: true},
				UpdatedAt:   time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update user name")
				return
			}
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]string{"status": "updated"})
	}
}
