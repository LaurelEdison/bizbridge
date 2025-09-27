package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/apiutils"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Config struct {
	CustomerJWTKey []byte
	CompanyJWTKey  []byte
}

var config Config

var CustomerIssuer string = "customer"
var CompanyIssuer string = "company"

type contextKey string

const Claims contextKey = "claims"

func InitJWT(customerKey string, companyKey string) {
	config.CompanyJWTKey = []byte(companyKey)
	config.CustomerJWTKey = []byte(customerKey)
}
