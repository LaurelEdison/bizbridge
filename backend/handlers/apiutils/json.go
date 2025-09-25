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

func RespondWithError(logger *zap.Logger, w http.ResponseWriter,
	code int, msg string) {
	if code > 499 {
		logger.Error("Responding with server error",
			zap.Int("code", code), zap.String("message", msg))
	} else {
		logger.Warn("Responding with client error",
			zap.Int("code", code), zap.String("message", msg))
	}

	type errResponse struct {
		Error string `json:"error"`
	}

	RespondWithJSON(logger, w, code, errResponse{Error: msg})

}
