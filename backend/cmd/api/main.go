package main

import (
	"log"

	"backend/internal/config"
	"backend/internal/database"
	"backend/internal/server"
)

func main() {
	cfg := config.Load()

	db, err := database.New(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	srv := server.New(db, cfg.JWTSecret)

	if err := srv.App().Listen(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}

