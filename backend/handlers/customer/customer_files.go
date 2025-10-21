package customer

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

type UploadedFile struct {
	FileName string `json:"filename"`
	URL      string `json:"url"`
}

func FileUpload(h *handlers.Handlers) http.HandlerFunc {
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

		r.Body = http.MaxBytesReader(w, r.Body, 20<<20)
		err = r.ParseMultipartForm(20 << 20)
		if err != nil {
			h.ZapLogger.Error("File too large, or invalid form")
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "File too large or invalid form")
			return
		}
		files := r.MultipartForm.File["files"]
		if len(files) == 0 {
			h.ZapLogger.Error("No files uploaded")
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "No files uploaded")
			return
		}
		if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
			h.ZapLogger.Error("Could not create file directory")
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create file directory")
			return
		}
		var uploaded []UploadedFile
		for _, fileHeader := range files {
			src, err := fileHeader.Open()
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to open file")
				return
			}
			defer src.Close()
			if !isAllowedFileType(fileHeader.Filename) {
				h.ZapLogger.Error("File type not allowed")
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "File type not allowed")
				continue
			}

			fileName, err := apiutils.SaveUploadedFile(src, fileHeader.Filename, "uploads")
			if err != nil {
				h.ZapLogger.Error("Saveuploadedfile failed", zap.Error(err))
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed creating file")
				continue
			}

			fileURL := fmt.Sprintf("/uploads/%s", fileName)
			upload, err := h.DB.CreateCustomerFile(r.Context(), database.CreateCustomerFileParams{
				ID:         uuid.New(),
				CustomerID: id,
				FileName:   fileName,
				Url:        fileURL,
				UploadedAt: time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed adding file to db")
				continue
			}
			uploaded = append(uploaded, UploadedFile{
				FileName: upload.FileName,
				URL:      upload.Url,
			})
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, uploaded)
	}
}

func GetFilesByCustomerID(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		customerIDSTr := r.URL.Query().Get("customer_id")
		customerID, err := uuid.Parse(customerIDSTr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid customer id")
			return
		}

		customerFiles, err := h.DB.GetCustomerFilesFromCustomerID(r.Context(), customerID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get customer files")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCustomerFilesToCustomerFIles(customerFiles))
	}
}

func isAllowedFileType(filename string) bool {
	lower := strings.ToLower(filename)
	return strings.HasSuffix(lower, "pdf") ||
		strings.HasSuffix(lower, "png") ||
		strings.HasSuffix(lower, "jpg") ||
		strings.HasSuffix(lower, "jpeg")
}
