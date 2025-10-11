package sector

import (
	"encoding/json"
	"net/http"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func GetAllSectors(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sectors, err := h.DB.GetSectors(r.Context())
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get sectors")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseSectorsToSectors(sectors))
	}
}
func GetSectorsByCompany(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		CompanyIdStr := chi.URLParam(r, "company_id")
		CompanyId, err := uuid.Parse(CompanyIdStr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get company id")
			return
		}

		sectors, err := h.DB.GetSectorsByCompany(r.Context(), CompanyId)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get sectors")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseSectorsToSectors(sectors))
	}
}
func AddSectorLink(h *handlers.Handlers) http.HandlerFunc {
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

		type Parameters struct {
			SectorID uuid.UUID `json:"sector_id"`
		}
		params := &Parameters{}
		decoder := json.NewDecoder(r.Body)
		err = decoder.Decode(&params)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		profileSector, err := h.DB.AddCompanySector(r.Context(), database.AddCompanySectorParams{
			CompanyID: id,
			SectorID:  params.SectorID,
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not create company sector link")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseProfileSectorToProfileSector(profileSector))
	}
}
func RemoveSectorLink(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		CompanyIdStr := chi.URLParam(r, "company_id")
		CompanyId, err := uuid.Parse(CompanyIdStr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get company id")
			return
		}
		SectorIDstr := chi.URLParam(r, "sector_id")
		SectorID, err := uuid.Parse(SectorIDstr)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get sector id")
			return
		}

		err = h.DB.RemoveCompanySector(r.Context(), database.RemoveCompanySectorParams{
			CompanyID: CompanyId,
			SectorID:  SectorID,
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not remove company sector link")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, struct{}{})
	}
}
