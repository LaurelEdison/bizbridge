package company

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/LaurelEdison/bizbridge/utils"
	"github.com/google/uuid"
)

func CreateCompany(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Parameters struct {
			Name     string `json:"name"`
			Email    string `json:"email"`
			Password string `json:"password"`
			Address  string `json:"address"`
		}
		params := &Parameters{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&params)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}
		hashedPassword, err := utils.CreatePasswordHash(params.Password)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not create password")
			return
		}

		company, err := h.DB.CreateCompany(r.Context(), database.CreateCompanyParams{
			ID:           uuid.New(),
			Name:         params.Name,
			Email:        params.Email,
			PasswordHash: hashedPassword,
			Address:      params.Address,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to create company")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCompanyToCompany(company))
	}
}

func GetMe(h *handlers.Handlers) http.HandlerFunc {
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

		if role != "company" {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Unexpected role")
			return
		}

		company, err := h.DB.GetCompanyByID(r.Context(), id)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not find customer")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCompanyToCompany(company))

	}
}

func UpdateCompanyDetails(h *handlers.Handlers) http.HandlerFunc {
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

		if role != "company" {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Unexpected role")
			return
		}
		type Parameters struct {
			Name        *string `json:"name"`
			Description *string `json:"description"`
			Address     *string `json:"address"`
			Username    *string `json:"username"`
		}

		params := &Parameters{}
		decoder := json.NewDecoder(r.Body)
		err = decoder.Decode(&params)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		if params.Name != nil {
			err := h.DB.UpdateCompanyName(r.Context(), database.UpdateCompanyNameParams{
				ID:        id,
				Name:      *params.Name,
				UpdatedAt: time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update company name")
				return
			}
		}

		if params.Description != nil {
			err := h.DB.UpdateCompanyDescription(r.Context(), database.UpdateCompanyDescriptionParams{
				ID:          id,
				Description: sql.NullString{String: *params.Description, Valid: true},
				UpdatedAt:   time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update company description")
				return
			}
		}

		if params.Address != nil {
			err := h.DB.UpdateCompanyAddress(r.Context(), database.UpdateCompanyAddressParams{
				ID:        id,
				Address:   *params.Address,
				UpdatedAt: time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update company address")
				return
			}
		}

		if params.Username != nil {
			err := h.DB.UpdateCompanyUsername(r.Context(), database.UpdateCompanyUsernameParams{
				ID:        id,
				Username:  sql.NullString{String: *params.Username, Valid: true},
				UpdatedAt: time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update company username")
				return
			}
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]string{"status": "updated"})
	}
}
