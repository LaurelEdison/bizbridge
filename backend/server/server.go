package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/LaurelEdison/bizbridge/routes"
	"github.com/LaurelEdison/bizbridge/utils"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
)

func NewServer(zapLogger *zap.Logger) *http.Server {
	portString := utils.GetPort(zapLogger)
	dbUrl, err := utils.GetDBUrl(zapLogger)
	if err != nil {
		panic(err)
	}
	conn, err := sql.Open("postgres", dbUrl)
	if err != nil {
		zapLogger.Error("Failed connecting to database", zap.Error(err))
		panic(err)
	}
	queries := database.New(conn)

	router := chi.NewRouter()
	subRouter := chi.NewRouter()
	routes.SetupCors(zapLogger, router)
	routes.SetupRoutes(handlers.New(zapLogger, queries), subRouter)
	router.Mount("/bizbridge", subRouter)
	return &http.Server{
		Addr:    ":" + portString,
		Handler: router,
	}

}

