package utils

import (
	"errors"
	"go.uber.org/zap"
	"os"
)

func GetPort(logger *zap.Logger) string {
	portString := os.Getenv("PORT")
	if portString == "" {
		portString = "8080"
		logger.Warn("Unknown portstring: setting default: 8080")
	}
	return portString
}

func GetDBUrl(logger *zap.Logger) (string, error) {
	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		logger.Panic("Could not find dbURL")
		return "", errors.New("Could not find database url")
	}
	return dbUrl, nil
}

func CreatePasswordHash(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(bytes), err
}
