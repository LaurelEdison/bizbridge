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
