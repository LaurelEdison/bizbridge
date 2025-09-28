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

func generateJWT(id uuid.UUID, role string, secret []byte, issuer string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   id.String(),
		"role": role,
		"exp":  time.Now().Add(time.Hour * 72).Unix(),
		"iss":  issuer,
	})
	return token.SignedString(secret)
}

func Login(h *handlers.Handlers) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type parameters struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			Role     string `json:"role"`
		}
		params := &parameters{}

		if err := json.NewDecoder(r.Body).Decode(params); err != nil {
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not decode json request")
			return
		}

		var token string

		if params.Role == "customer" {
			customer, err := h.DB.GetCustomerByEmail(r.Context(), strings.ToLower(params.Email))
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid email or password")
				return
			}

			if passOk := CheckPasswordHash(customer.PasswordHash, params.Password); !passOk {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Invalid email or password")
				return
			}

			token, err = generateJWT(customer.ID, "customer", config.CustomerJWTKey, CustomerIssuer)
			if err != nil {
				apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Could not generate jwt token")
				return
			}
		}

		if params.Role == "company" {
			//TODO:Implement company handler and sql
			apiutils.RespondWithError(h.ZapLogger, w, http.StatusBadRequest, "Companies are not implemented yet")
			return
		}

		apiutils.RespondWithJSON(h.ZapLogger, w, http.StatusOK, map[string]string{"token": token})
	}
}

func JWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
			return
		}
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["Alg"])
			}
			claims, ok := t.Claims.(jwt.MapClaims)
			if !ok {
				return nil, fmt.Errorf("invalid claims")
			}
			iss := claims["iss"].(string)
			switch iss {
			case CustomerIssuer:
				return config.CustomerJWTKey, nil
			case CompanyIssuer:
				return config.CompanyJWTKey, nil
			default:
				return nil, fmt.Errorf("invalid issuer")
			}
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), Claims, token.Claims.(jwt.MapClaims))
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func CheckPasswordHash(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

func GetClaims(ctx context.Context) (jwt.MapClaims, bool) {
	claims, ok := ctx.Value(Claims).(jwt.MapClaims)
	return claims, ok
}
