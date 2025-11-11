package order

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/handlers/payment"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/LaurelEdison/bizbridge/utils"
	"github.com/google/uuid"
)

func CreateOrder(h *handlers.Handlers) http.HandlerFunc {
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
		var description sql.NullString
		type Parameters struct {
			RecipientID      uuid.UUID `json:"recipient_id"`
			Amount           float64   `json:"amount"`
			InputDescription *string   `json:"description"`
		}
		params := &Parameters{}
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}
		if params.InputDescription != nil {
			description = sql.NullString{String: *params.InputDescription, Valid: true}
		}

		if id == params.RecipientID {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Cannot create order with self as recipient")
			return
		}

		var customer database.Customer
		var company database.Company

		if role == "customer" {

			customer, err = h.DB.GetCustomerByID(r.Context(), id)
			company, err = h.DB.GetCompanyByID(r.Context(), params.RecipientID)
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not fetch customer and company")
				return
			}
		}
		if role == "company" {
			customer, err = h.DB.GetCustomerByID(r.Context(), params.RecipientID)
			company, err = h.DB.GetCompanyByID(r.Context(), id)
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not fetch customer and company")
				return
			}
		}

		escrow, err := payment.CreateEscrow(r.Context(), h, customer, company, params.Amount)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to create escrow account")
			return
		}
		order, err := h.DB.CreateOrder(r.Context(), database.CreateOrderParams{
			ID:          uuid.New(),
			CompanyID:   company.ID,
			CustomerID:  customer.ID,
			EscrowID:    uuid.NullUUID{UUID: escrow.ID, Valid: true},
			TotalAmount: utils.FloatToDecimal(params.Amount).String(),
			Status:      "in_progress",
			Description: description,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		})
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Failed to create order")
			return
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]any{
			"order":  handlers.DatabaseOrderToOrder(order),
			"escrow": handlers.DatabaseEscrowToEscrow(escrow)},
		)

	}
}

func RefundOrder(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Parameters struct {
			OrderID uuid.UUID `json:"order_id"`
		}
		params := &Parameters{}
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		order, err := h.DB.GetOrderByID(r.Context(), params.OrderID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get order")
			return
		}
		if !order.EscrowID.Valid {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid escrowID")
			return
		}

		escrow, err := h.DB.GetEscrowByID(r.Context(), order.EscrowID.UUID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get escrow")
			return
		}

		updatedEscrow, err := payment.RefundEscrow(r.Context(), h, escrow.ID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not update escrow")
			return
		}

		updatedOrder, err := h.DB.RefundOrder(r.Context(), order.ID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not update order")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]any{
			"order":  handlers.DatabaseOrderToOrder(updatedOrder),
			"escrow": handlers.DatabaseEscrowToEscrow(updatedEscrow)},
		)
	}
}

func CompleteOrder(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Parameters struct {
			OrderID uuid.UUID `json:"order_id"`
		}
		params := &Parameters{}
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json")
			return
		}

		order, err := h.DB.GetOrderByID(r.Context(), params.OrderID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get order")
			return
		}
		if !order.EscrowID.Valid {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid escrowID")
			return
		}

		escrow, err := h.DB.GetEscrowByID(r.Context(), order.EscrowID.UUID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get escrow")
			return
		}

		updatedEscrow, err := payment.ReleaseEscrow(r.Context(), h, escrow.ID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not update escrow")
			return
		}

		updatedOrder, err := h.DB.CompleteOrder(r.Context(), order.ID)
		if err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not update order")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]any{
			"order":  handlers.DatabaseOrderToOrder(updatedOrder),
			"escrow": handlers.DatabaseEscrowToEscrow(updatedEscrow)},
		)

	}
}

func GetOrders(h *handlers.Handlers) http.HandlerFunc {
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
		var Orders []handlers.Order

		if role == "customer" {
			dbOrders, err := h.DB.GetOrdersByCustomerID(r.Context(), id)
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get orders")
				return
			}
			Orders = handlers.DatabaseOrdersToOrders(dbOrders)
		}
		if role == "company" {
			dbOrders, err := h.DB.GetOrdersByCompanyID(r.Context(), id)
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not get orders")
				return
			}
			Orders = handlers.DatabaseOrdersToOrders(dbOrders)
		}
		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, Orders)
	}
}

// TODO: Implement these
func CancelOrder(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
func PayOrder(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
