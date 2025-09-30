package auth

import (
	"context"
	"fmt"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strings"
	"time"
)

type Config struct {
	CustomerJWTKey []byte
	CompanyJWTKey  []byte
}

var ConfigKey Config

var CustomerIssuer string = "customer"
var CompanyIssuer string = "company"

type contextKey string

const Claims contextKey = "claims"

func InitJWT(customerKey string, companyKey string) {
	ConfigKey.CompanyJWTKey = []byte(companyKey)
	ConfigKey.CustomerJWTKey = []byte(customerKey)
}

func GenerateJWT(id uuid.UUID, role string, secret []byte, issuer string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   id.String(),
		"role": role,
		"exp":  time.Now().Add(time.Hour * 72).Unix(),
		"iss":  issuer,
	})
	return token.SignedString(secret)
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
				return ConfigKey.CustomerJWTKey, nil
			case CompanyIssuer:
				return ConfigKey.CompanyJWTKey, nil
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
