package handlers

import (
	"database/sql"

	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/google/uuid"
)

type Customer struct {
	ID          uuid.UUID      `json:"id"`
	Name        string         `json:"name"`
	Email       string         `json:"email"`
	Country     string         `json:"country"`
	Description sql.NullString `json:"description"`
	Photourl    sql.NullString `json:"photourl"`
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
	ID          uuid.UUID      `json:"id"`
	Name        string         `json:"name"`
	Email       string         `json:"email"`
	Address     string         `json:"address"`
	Description sql.NullString `json:"description"`
	Photourl    sql.NullString `json:"photourl"`
	Username    sql.NullString `json:"username"`
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
