package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/LaurelEdison/bizbridge/handlers"
	"github.com/LaurelEdison/bizbridge/handlers/auth"
	"github.com/LaurelEdison/bizbridge/handlers/chat/ws"
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

	companySecret := os.Getenv("JWT_COMPANY_SECRET")
	customerSecret := os.Getenv("JWT_CUSTOMER_SECRET")
	auth.InitJWT(customerSecret, companySecret)

	router := chi.NewRouter()
	subRouter := chi.NewRouter()
	routes.SetupCors(zapLogger, router)
	hub := ws.NewHub()
	go ws.Run(hub, zapLogger)
	routes.SetupRoutes(handlers.New(zapLogger, queries, hub), subRouter)
	router.Mount("/bizbridge", subRouter)

	return &http.Server{
		Addr:    ":" + portString,
		Handler: router,
	}

}

func Run() error {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Failed to load .env : %v", err)
	}

	zapLogger, err := zap.NewProduction()
	if err != nil {
		return fmt.Errorf("error starting logger: %v", err)
	}
	defer func() {
		if err := zapLogger.Sync(); err != nil && !strings.Contains(err.Error(), "already closed") {
			fmt.Fprintf(os.Stderr, "error syncing logger: %v", err)
		}
	}()

	srv := NewServer(zapLogger)

	err = srv.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		zapLogger.Error("Failed to start http server", zap.Error(err))
	}

	return err
}

// TODO: Refactor main to cmd file
func main() {
	err := Run()
	fmt.Printf("%v", err)
}
