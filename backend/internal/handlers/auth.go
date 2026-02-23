package handlers

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	db        *sql.DB
	jwtSecret []byte
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type RegisterRequest struct {
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
	ClassID  *int   `json:"class_id"`
}

func NewAuthHandler(db *sql.DB, jwtSecret []byte) *AuthHandler {
	return &AuthHandler{
		db:        db,
		jwtSecret: jwtSecret,
	}
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponseEnvelope{
			Error: ErrorBody{
				Code:    "VALIDATION_ERROR",
				Message: "Invalid request body",
			},
		})
	}

	return c.Status(fiber.StatusNotImplemented).JSON(ErrorResponseEnvelope{
		Error: ErrorBody{
			Code:    "NOT_IMPLEMENTED",
			Message: "Login endpoint not implemented yet",
		},
	})
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponseEnvelope{
			Error: ErrorBody{
				Code:    "VALIDATION_ERROR",
				Message: "Invalid request body",
			},
		})
	}

	return c.Status(fiber.StatusNotImplemented).JSON(ErrorResponseEnvelope{
		Error: ErrorBody{
			Code:    "NOT_IMPLEMENTED",
			Message: "Register endpoint not implemented yet",
		},
	})
}

