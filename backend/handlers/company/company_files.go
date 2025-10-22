package company

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
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

		if role != "company" {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Unexpected role")
			return
		}

		r.Body = http.MaxBytesReader(w, r.Body, 20<<20)
		err = r.ParseMultipartForm(20 << 20)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "File too large or invalid form")
			return
		}
		files := r.MultipartForm.File["files"]
		if len(files) == 0 {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "No files uploaded")
			return
		}
		if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create file directory")
			return
		}
		var uploaded []handlers.CompanyFile
		for _, fileHeader := range files {
			src, err := fileHeader.Open()
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to open file")
				return
			}
			defer src.Close()
			if !isAllowedFileType(fileHeader.Filename) {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "File type not allowed")
				continue
			}

			fileName, err := apiutils.SaveUploadedFile(src, fileHeader.Filename, "uploads")
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed creating file")
				continue
			}

			ext := filepath.Ext(fileHeader.Filename)
			category := strings.TrimPrefix(ext, ".")

			fileURL := fmt.Sprintf("/uploads/%s", fileName)
			upload, err := h.DB.CreateCompanyFile(r.Context(), database.CreateCompanyFileParams{
				ID:         uuid.New(),
				CompanyID:  id,
				FileName:   fileName,
				Url:        fileURL,
				UploadedAt: time.Now(),
				Category:   category,
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create file on db")
				h.ZapLogger.Error("Error creating db instance", zap.Error(err))
				return
			}
			uploaded = append(uploaded, handlers.DatabaseCompanyFileToCompanyFile(upload))
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, uploaded)
	}
}

func GetFilesByCompanyID(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		companyIDStr := r.URL.Query().Get("company_id")
		companyID, err := uuid.Parse(companyIDStr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid company id")
			return
		}

		companyFiles, err := h.DB.GetCompanyFilesFromCompanyID(r.Context(), companyID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get company files")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCompanyFilesToCompanyFiles(companyFiles))
	}
}

func UploadCompanyBanners(h *handlers.Handlers) http.HandlerFunc {
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

		r.Body = http.MaxBytesReader(w, r.Body, 20<<20)
		err = r.ParseMultipartForm(20 << 20)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "File too large or invalid form")
			return
		}
		files := r.MultipartForm.File["files"]
		if len(files) == 0 {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "No files uploaded")
			return
		}
		if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create file directory")
			return
		}
		var uploaded []handlers.CompanyBanner
		for _, fileHeader := range files {
			src, err := fileHeader.Open()
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to open file")
				return
			}
			defer src.Close()
			if !isAllowedFileType(fileHeader.Filename) {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "File type not allowed")
				continue
			}

			fileName, err := apiutils.SaveUploadedFile(src, fileHeader.Filename, "uploads")
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed creating file")
				continue
			}

			fileURL := fmt.Sprintf("/uploads/%s", fileName)
			upload, err := h.DB.CreateCompanyBanner(r.Context(), database.CreateCompanyBannerParams{
				ID:         uuid.New(),
				CompanyID:  id,
				FileName:   fileName,
				Url:        fileURL,
				UploadedAt: time.Now(),
			})
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create file on db")
				h.ZapLogger.Error("Error creating db instance", zap.Error(err))
				return
			}
			uploaded = append(uploaded, handlers.DatabaseCompanyBannerToCompanyBanner(upload))
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, uploaded)
	}
}

func GetCompanyBanners(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		companyIDStr := r.URL.Query().Get("company_id")
		companyID, err := uuid.Parse(companyIDStr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid company id")
			return
		}

		companyFiles, err := h.DB.GetCompanyBannersFromCompanyID(r.Context(), companyID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get company files")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseCompanyBannersToCompanyBanners(companyFiles))
	}
}

func isAllowedFileType(filename string) bool {
	lower := strings.ToLower(filename)
	return strings.HasSuffix(lower, "pdf") ||
		strings.HasSuffix(lower, "png") ||
		strings.HasSuffix(lower, "jpg") ||
		strings.HasSuffix(lower, "jpeg")
}
