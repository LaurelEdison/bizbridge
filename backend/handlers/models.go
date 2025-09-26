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

