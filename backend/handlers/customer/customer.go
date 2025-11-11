package customer

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/LaurelEdison/bizbridge/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
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
			return
		}

		hashedPassword, err := utils.CreatePasswordHash(params.Password)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not create password")
			return
		}

		customer, err := h.DB.CreateCustomer(r.Context(), database.CreateCustomerParams{
			ID:           uuid.New(),
			Name:         params.Name,
			PasswordHash: hashedPassword,
			Email:        strings.ToLower(params.Email),
			Country:      params.Country,
			Description:  sql.NullString{String: params.Description},
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create customer")
			return
		}

		_, err = h.DB.CreateWallet(r.Context(), database.CreateWalletParams{
			ID:        uuid.New(),
			OwnerRole: "customer",
			OwnerID:   customer.ID,
			Balance:   utils.FloatToDecimal(0.0).String(),
			Currency:  "USD",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to create wallet")
			h.ZapLogger.Error("Error creating wallet", zap.Error(err))
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCustomerToCustomer(customer))
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

		if role != "customer" {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Unexpected role")
			return
		}

		customer, err := h.DB.GetCustomerByID(r.Context(), id)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not find customer")
			return
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
			return
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

func UpdateCompanyProfilePicture(h *handlers.Handlers) http.HandlerFunc {
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
		r.Body = http.MaxBytesReader(w, r.Body, 20<<20)
		err = r.ParseMultipartForm(20 << 20)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "File too large or invalid form")
			return
		}
		file := r.MultipartForm.File["file"]
		if len(file) == 0 {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "No files uploaded")
			return
		}
		if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create file directory")
			return
		}
		src, err := file[0].Open()
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "failed to open file")
			return
		}
		fileName, err := apiutils.SaveUploadedFile(src, file[0].Filename, "uploads")
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "failed to open file")
			return
		}
		fileURL := fmt.Sprintf("/uploads/%s", fileName)
		err = h.DB.UpdateCustomerPhotoUrl(r.Context(), database.UpdateCustomerPhotoUrlParams{
			ID:        id,
			Photourl:  sql.NullString{String: fileURL, Valid: true},
			UpdatedAt: time.Now(),
		})

		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update company photo url to databse")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]string{"photo_url": fileURL})
	}
}

func UpdateCustomerDetails(h *handlers.Handlers) http.HandlerFunc {
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
		if role != "customer" {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Unexpected role")
			return
		}

		type Parameters struct {
			Name        *string `json:"name"`
			Country     *string `json:"country"`
			Description *string `json:"description"`
		}

		params := &Parameters{}
		decoder := json.NewDecoder(r.Body)
		err = decoder.Decode(&params)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		if params.Name != nil {
			err := h.DB.UpdateCustomerName(r.Context(), database.UpdateCustomerNameParams{
				ID:        id,
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
				ID:        id,
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
				ID:          id,
				Description: sql.NullString{String: *params.Description, Valid: true},
				UpdatedAt:   time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not update user name")
				return
			}
		}

		updatedCustomer, err := h.DB.GetCustomerByID(r.Context(), id)
		if err != nil {
			apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]string{"status": "updated"})
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCustomerToCustomer(updatedCustomer))
	}
}

//TODO: Implement update email
