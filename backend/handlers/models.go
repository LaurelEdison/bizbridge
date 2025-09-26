package handlers

import (
	"database/sql"
	"time"

	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/google/uuid"
)

type Customer struct {
	ID          uuid.UUID
	Name        string
	Email       string
	Country     string
	Description sql.NullString
	Photourl    sql.NullString
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func DatabaseCustomerToCustomer(dbCustomer database.Customer) Customer {
	return Customer{
		ID:          dbCustomer.ID,
		Name:        dbCustomer.Name,
		Email:       dbCustomer.Email,
		Country:     dbCustomer.Country,
		Description: dbCustomer.Description,
		Photourl:    dbCustomer.Photourl,
		CreatedAt:   dbCustomer.CreatedAt,
		UpdatedAt:   dbCustomer.UpdatedAt,
	}
}
