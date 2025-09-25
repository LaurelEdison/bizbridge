package healthz

import (
	"net/http"

	"github.com/LaurelEdison/bizbridge/handlers"
	utils "github.com/LaurelEdison/bizbridge/handlers/apiutils"
)

func HandlerHealth(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		utils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, struct{}{})
	}
}
