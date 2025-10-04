package handlers

import (
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/google/uuid"
)

type Customer struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Country     string    `json:"country"`
	Description *string   `json:"description,omitempty"`
	Photourl    *string   `json:"photourl,omitempty"`
}

func DatabaseCustomerToCustomer(dbCustomer database.Customer) Customer {
	return Customer{
		ID:          dbCustomer.ID,
		Name:        dbCustomer.Name,
		Email:       dbCustomer.Email,
		Country:     dbCustomer.Country,
		Description: &dbCustomer.Description.String,
		Photourl:    &dbCustomer.Photourl.String,
	}
}

type Company struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Address     string    `json:"address"`
	Description *string   `json:"description,omitempty"`
	Photourl    *string   `json:"photourl,omitempty"`
	Username    *string   `json:"username,omitempty"`
}

func DatabaseCompanyToCompany(dbCompany database.Company) Company {
	return Company{
		ID:          dbCompany.ID,
		Name:        dbCompany.Name,
		Email:       dbCompany.Email,
		Address:     dbCompany.Address,
		Description: &dbCompany.Description.String,
		Photourl:    &dbCompany.Photourl.String,
		Username:    &dbCompany.Username.String,
	}
}
