package payment

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/LaurelEdison/bizbridge/utils"
	"github.com/google/uuid"
)

func CreateEscrow(ctx context.Context, h *handlers.Handlers,
	customer database.Customer, company database.Company, amount float64) (database.EscrowAccount, error) {

	wallet, err := h.DB.GetWallet(ctx, database.GetWalletParams{
		OwnerRole: "customer",
		OwnerID:   customer.ID,
	})
	if err != nil {
		return database.EscrowAccount{}, err
	}

	balance, err := utils.NumericStringToFloat(wallet.Balance)
	if err != nil {
		return database.EscrowAccount{}, err
	}
	if balance < amount {
		return database.EscrowAccount{}, fmt.Errorf("Insufficient funds")
	}

	_, err = h.DB.DeductFunds(ctx, database.DeductFundsParams{
		OwnerRole: "customer",
		OwnerID:   customer.ID,
		Balance:   utils.FloatToDecimal(amount).String(),
	})
	if err != nil {
		return database.EscrowAccount{}, err
	}

	escrow, err := h.DB.CreateEscrowAccount(ctx, database.CreateEscrowAccountParams{
		ID:         uuid.New(),
		InvestorID: customer.ID,
		BusinessID: company.ID,
		Amount:     utils.FloatToDecimal(amount).String(),
		Status:     "pending",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	})
	if err != nil {
		return database.EscrowAccount{}, err
	}

	_, err = CreateTransaction(ctx, h, wallet, amount, "escrow_hold", &escrow, true)
	if err != nil {
		return database.EscrowAccount{}, err
	}

	return escrow, nil
}

// RefundEscrow returns funds to the original payer and marks the escrow refunded.
func RefundEscrow(ctx context.Context, h *handlers.Handlers, escrowID uuid.UUID) (database.EscrowAccount, error) {
	escrow, err := h.DB.GetEscrowByID(ctx, escrowID)
	if err != nil {
		return database.EscrowAccount{}, err
	}
	if escrow.Status != "pending" {
		return database.EscrowAccount{}, fmt.Errorf("Escrow not pending")
	}

	wallet, err := h.DB.GetWallet(ctx, database.GetWalletParams{
		OwnerRole: "customer",
		OwnerID:   escrow.InvestorID,
	})
	if err != nil {
		return database.EscrowAccount{}, err
	}

	updatedWallet, err := h.DB.DepositFunds(ctx, database.DepositFundsParams{
		OwnerRole: wallet.OwnerRole,
		OwnerID:   wallet.OwnerID,
		Balance:   escrow.Amount,
	})
	if err != nil {
		return database.EscrowAccount{}, err
	}

	_, err = h.DB.EscrowRefund(ctx, escrow.ID)
	if err != nil {
		return database.EscrowAccount{}, err
	}

	escrowAmount, err := utils.NumericStringToFloat(escrow.Amount)
	if err != nil {
		return database.EscrowAccount{}, err
	}

	_, err = CreateTransaction(ctx, h, updatedWallet, escrowAmount, "escrow_refund", &escrow, true)
	if err != nil {
		return database.EscrowAccount{}, err
	}

	return escrow, nil
}

// ReleaseEscrow transfers funds from escrow to the business wallet.
func ReleaseEscrow(ctx context.Context, h *handlers.Handlers, escrowID uuid.UUID) (database.EscrowAccount, error) {
	escrow, err := h.DB.GetEscrowByID(ctx, escrowID)
	if err != nil {
		return database.EscrowAccount{}, err
	}
	if escrow.Status != "pending" {
		return database.EscrowAccount{}, fmt.Errorf("Escrow not pending")
	}

	wallet, err := h.DB.GetWallet(ctx, database.GetWalletParams{
		OwnerRole: "company",
		OwnerID:   escrow.BusinessID,
	})
	if err != nil {
		return database.EscrowAccount{}, err
	}

	updatedWallet, err := h.DB.DepositFunds(ctx, database.DepositFundsParams{
		OwnerRole: wallet.OwnerRole,
		OwnerID:   wallet.OwnerID,
		Balance:   escrow.Amount,
	})
	if err != nil {
		return database.EscrowAccount{}, err
	}

	_, err = h.DB.ReleaseEscrowAccount(ctx, escrow.ID)
	if err != nil {
		return database.EscrowAccount{}, err
	}

	escrowAmount, err := utils.NumericStringToFloat(escrow.Amount)
	if err != nil {
		return database.EscrowAccount{}, err
	}

	_, err = CreateTransaction(ctx, h, updatedWallet, escrowAmount, "escrow_release", &escrow, true)
	if err != nil {
		return database.EscrowAccount{}, err
	}

	return escrow, nil
}

func HandlerCreateEscrow(h *handlers.Handlers) http.HandlerFunc {
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
			RecipientID uuid.UUID `json:"recipient_id"`
			Amount      float64   `json:"amount"`
		}
		params := &Parameters{}
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}
		var customer database.Customer
		var company database.Company

		if role == "customer" {
			customer, err = h.DB.GetCustomerByID(r.Context(), id)
			company, err = h.DB.GetCompanyByID(r.Context(), params.RecipientID)
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get customer or company data")
				return
			}
		}
		if role == "company" {
			company, err = h.DB.GetCompanyByID(r.Context(), id)
			customer, err = h.DB.GetCustomerByID(r.Context(), params.RecipientID)
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get customer or company data")
				return
			}
		}

		wallet, err := h.DB.GetWallet(r.Context(), database.GetWalletParams{OwnerRole: role, OwnerID: id})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Could not get wallet")
			return
		}

		balance, err := utils.NumericStringToFloat(wallet.Balance)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to convert values")
			return
		}

		if err != nil || balance < params.Amount {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Insufficient funds")
			return
		}

		_, err = h.DB.DeductFunds(r.Context(), database.DeductFundsParams{
			OwnerRole: role,
			OwnerID:   id,
			Balance:   utils.FloatToDecimal(params.Amount).String(),
		})

		if err != nil || balance < params.Amount {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Error deducting funds")
			return
		}

		escrow, err := h.DB.CreateEscrowAccount(r.Context(), database.CreateEscrowAccountParams{
			ID:         uuid.New(),
			InvestorID: customer.ID,
			BusinessID: company.ID,
			Amount:     utils.FloatToDecimal(params.Amount).String(),
			Status:     "pending",
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Error creating escrow account")
			return
		}

		_, err = CreateTransaction(r.Context(), h, wallet, params.Amount, "escrow_hold", &escrow, true)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusInternalServerError, "Failed to create transaction record")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseEscrowToEscrow(escrow))

	}
}
func HandlerRefundEscrow(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Parameters struct {
			EscrowID uuid.UUID `json:"escrow_id"`
		}
		params := &Parameters{}
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}
		escrow, err := h.DB.GetEscrowByID(r.Context(), params.EscrowID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get escrow account")
			return
		}
		if escrow.Status != "pending" {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Escrow not pending")
			return
		}

		wallet, err := h.DB.GetWallet(r.Context(), database.GetWalletParams{
			OwnerRole: "customer",
			OwnerID:   escrow.InvestorID,
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get wallet")
			return
		}
		updatedWallet, err := h.DB.DepositFunds(r.Context(), database.DepositFundsParams{
			OwnerRole: wallet.OwnerRole,
			OwnerID:   wallet.OwnerID,
			Balance:   escrow.Amount,
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to deposit funds")
			return
		}
		_, err = h.DB.EscrowRefund(r.Context(), escrow.ID)

		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to set status to refund")
			return
		}
		escrowAmmount, err := utils.NumericStringToFloat(escrow.Amount)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to convert escrow amount")
			return
		}

		_, err = CreateTransaction(r.Context(), h, updatedWallet, escrowAmmount, "escrow_refund", &escrow, true)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to create transaction")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseEscrowToEscrow(escrow))
	}
}
func HandlerReleaseEscrow(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Parameters struct {
			EscrowID uuid.UUID `json:"escrow_id"`
		}
		params := &Parameters{}
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		escrow, err := h.DB.GetEscrowByID(r.Context(), params.EscrowID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get escrow account")
			return
		}
		if escrow.Status != "pending" {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Escrow not pending")
			return
		}

		wallet, err := h.DB.GetWallet(r.Context(), database.GetWalletParams{
			OwnerRole: "company",
			OwnerID:   escrow.BusinessID,
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get wallet")
			return
		}
		updatedWallet, err := h.DB.DepositFunds(r.Context(), database.DepositFundsParams{
			OwnerRole: wallet.OwnerRole,
			OwnerID:   wallet.OwnerID,
			Balance:   escrow.Amount,
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to deposit funds")
			return
		}
		_, err = h.DB.ReleaseEscrowAccount(r.Context(), escrow.ID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to set status to release")
			return
		}
		escrowAmmount, err := utils.NumericStringToFloat(escrow.Amount)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to convert escrow amount")
			return
		}

		_, err = CreateTransaction(r.Context(), h, updatedWallet, escrowAmmount, "escrow_release", &escrow, true)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to create transaction")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, handlers.DatabaseEscrowToEscrow(escrow))

	}
}
