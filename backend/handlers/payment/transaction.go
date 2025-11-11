package payment

import (
	"context"
	"database/sql"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/LaurelEdison/bizbridge/utils"
	"github.com/google/uuid"
)

func CreateTransaction(ctx context.Context, h *handlers.Handlers, wallet database.Wallet,
	amount float64, transactionType string, escrow *database.EscrowAccount, useIdempotencyKey bool) (database.Transaction, error) {

	var relatedEscrowID uuid.NullUUID
	if escrow != nil && escrow.ID != uuid.Nil {
		relatedEscrowID = uuid.NullUUID{UUID: escrow.ID, Valid: true}
	}
	var idempotencyKey sql.NullString
	if useIdempotencyKey {
		idempotencyKey = sql.NullString{
			String: uuid.New().String(),
			Valid:  true,
		}
	}
	transaction, err := h.DB.CreateTransaction(ctx, database.CreateTransactionParams{
		ID:              uuid.New(),
		WalletID:        wallet.ID,
		Amount:          utils.FloatToDecimal(amount).String(),
		TransactionType: transactionType,
		RelatedEscrowID: relatedEscrowID,
		IdempotencyKey:  idempotencyKey,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	})
	return transaction, err

}
