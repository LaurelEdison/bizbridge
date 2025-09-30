package company

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
)

func Login(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type parameters struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		params := &parameters{}

		if err := json.NewDecoder(r.Body).Decode(params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json request")
			return
		}

		var token string

		company, err := h.DB.GetCompanyByEmail(r.Context(), strings.ToLower(params.Email))
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid email or password")
			return
		}

		if passOk := auth.CheckPasswordHash(company.PasswordHash, params.Password); !passOk {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid email or password")
			return
		}
		token, err = auth.GenerateJWT(company.ID, "company", auth.ConfigKey.CompanyJWTKey, auth.CompanyIssuer)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not generate jwt token")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]string{"token": token})
	}
}
