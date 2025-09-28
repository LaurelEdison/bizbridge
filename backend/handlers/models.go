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
	}
}

type Company struct {
	ID          uuid.UUID
	Name        string
	Email       string
	Address     string
	Description sql.NullString
	Photourl    sql.NullString
	Username    sql.NullString
}

func DatabaseCompanyToCompany(dbCompany database.Company) Company {
	return Company{
		ID:          dbCompany.ID,
		Name:        dbCompany.Name,
		Email:       dbCompany.Email,
		Address:     dbCompany.Address,
		Description: dbCompany.Description,
		Photourl:    dbCompany.Photourl,
		Username:    dbCompany.Username,
	}
}
