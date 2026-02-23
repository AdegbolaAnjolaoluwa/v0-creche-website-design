package server

import (
	"database/sql"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/google/uuid"

	"backend/internal/handlers"
	"backend/internal/middleware"
)

type Server struct {
	app       *fiber.App
	db        *sql.DB
	jwtSecret []byte
}

func New(db *sql.DB, jwtSecret string) *Server {
	s := &Server{
		db:        db,
		jwtSecret: []byte(jwtSecret),
	}

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(handlers.ErrorResponseEnvelope{
				Error: handlers.ErrorBody{
					Code:    "INTERNAL_ERROR",
					Message: "Internal server error",
				},
			})
		},
	})

	app.Use(requestIDMiddleware())
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format:     "${time} | ${status} | ${latency} | ${method} ${path} | request_id=${locals:request_id}\n",
		TimeFormat: time.RFC3339,
		TimeZone:   "UTC",
	}))

	s.app = app
	s.registerRoutes()

	return s
}

func (s *Server) App() *fiber.App {
	return s.app
}

func (s *Server) registerRoutes() {
	app := s.app

	app.Get("/health/live", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(handlers.HealthResponse{Status: "ok"})
	})

	app.Get("/health/ready", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(handlers.HealthResponse{Status: "ready"})
	})

	api := app.Group("/v1")

	authHandler := handlers.NewAuthHandler(s.db, s.jwtSecret)
	api.Post("/auth/login", authHandler.Login)
	api.Post("/auth/register", middleware.RequireAdmin(s.jwtSecret), authHandler.Register)

	staffAuth := middleware.RequireStaff(s.jwtSecret)
	adminAuth := middleware.RequireAdmin(s.jwtSecret)

	api.Post("/attendance/staff/signin", staffAuth, handlers.NotImplemented("STAFF_ATTENDANCE_SIGNIN"))
	api.Post("/attendance/students", staffAuth, handlers.NotImplemented("STUDENT_ATTENDANCE"))
	api.Post("/reports", staffAuth, handlers.NotImplemented("DAILY_REPORT_CREATE"))
	api.Post("/results/upload", staffAuth, handlers.NotImplemented("RESULT_UPLOAD"))
	api.Get("/results/my-class", staffAuth, handlers.NotImplemented("RESULTS_MY_CLASS"))

	api.Get("/attendance/all", adminAuth, handlers.NotImplemented("ATTENDANCE_ALL"))
	api.Get("/reports/all", adminAuth, handlers.NotImplemented("REPORTS_ALL"))
	api.Get("/results/all", adminAuth, handlers.NotImplemented("RESULTS_ALL"))
	api.Get("/analytics/attendance", adminAuth, handlers.NotImplemented("ANALYTICS_ATTENDANCE"))
	api.Get("/analytics/performance", adminAuth, handlers.NotImplemented("ANALYTICS_PERFORMANCE"))
}

func requestIDMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		requestID := c.Get("X-Request-Id")
		if requestID == "" {
			requestID = uuid.NewString()
		}
		c.Locals("request_id", requestID)
		c.Set("X-Request-Id", requestID)
		return c.Next()
	}
}

