package apiutils

import (
	"encoding/json"
	"go.uber.org/zap"
	"net/http"
)

func RespondWithJSON(logger *zap.Logger, w http.ResponseWriter, code int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		logger.Error("Error encoding json", zap.Error(err))
		return
	}

}

