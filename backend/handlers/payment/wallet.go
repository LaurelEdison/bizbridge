package payment

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/LaurelEdison/bizbridge/utils"
	"github.com/google/uuid"
)

func GetWallet(h *handlers.Handlers) http.HandlerFunc {
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
		wallet, err := h.DB.GetWallet(r.Context(), database.GetWalletParams{
			OwnerRole: role,
			OwnerID:   id,
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get id")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseWalletToWallet(wallet))
	}
}

func AddFunds(h *handlers.Handlers) http.HandlerFunc {
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
		type Parameters struct {
			Amount float64 `json:"amount"`
		}
		params := &Parameters{}
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		wallet, err := h.DB.DepositFunds(r.Context(), database.DepositFundsParams{
			OwnerRole: role,
			OwnerID:   id,
			Balance:   utils.FloatToDecimal(params.Amount).String(),
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Error depositing funds")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseWalletToWallet(wallet))
	}
}
func DeductFunds(ctx context.Context, h handlers.Handlers, wallet database.Wallet, amount float64) error {
	wallet, err := h.DB.DeductFunds(ctx, database.DeductFundsParams{
		OwnerRole: wallet.OwnerRole,
		OwnerID:   wallet.OwnerID,
		Balance:   utils.FloatToDecimal(amount).String(),
	})
	return err
}
func CheckBalance(ctx context.Context, h handlers.Handlers, wallet database.Wallet) float64 {
	dbbalance, err := h.DB.CheckBalance(ctx, database.CheckBalanceParams{
		OwnerRole: wallet.OwnerRole,
		OwnerID:   wallet.OwnerID,
	})
	if err != nil {
		return -1
	}
	balance, err := utils.NumericStringToFloat(dbbalance)
	if err != nil {
		return -1
	}
	return balance
}
