package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID  int   `json:"user_id"`
	Role    string `json:"role"`
	ClassID *int   `json:"class_id"`
	jwt.RegisteredClaims
}

func RequireAuth(jwtSecret []byte) fiber.Handler {
	return func(c *fiber.Ctx) error {
		header := c.Get("Authorization")
		if header == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]interface{}{
				"error": map[string]interface{}{
					"code":    "UNAUTHENTICATED",
					"message": "Missing authorization header",
				},
			})
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]interface{}{
				"error": map[string]interface{}{
					"code":    "UNAUTHENTICATED",
					"message": "Invalid authorization header",
				},
			})
		}

		token, err := jwt.ParseWithClaims(parts[1], &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]interface{}{
				"error": map[string]interface{}{
					"code":    "UNAUTHENTICATED",
					"message": "Invalid token",
				},
			})
		}

		claims, ok := token.Claims.(*Claims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]interface{}{
				"error": map[string]interface{}{
					"code":    "UNAUTHENTICATED",
					"message": "Invalid token claims",
				},
			})
		}

		c.Locals("user_id", claims.UserID)
		c.Locals("role", claims.Role)
		c.Locals("class_id", claims.ClassID)

		return c.Next()
	}
}

func RequireAdmin(jwtSecret []byte) fiber.Handler {
	auth := RequireAuth(jwtSecret)
	return func(c *fiber.Ctx) error {
		if err := auth(c); err != nil {
			return err
		}
		role, _ := c.Locals("role").(string)
		if role != "admin" {
			return c.Status(fiber.StatusForbidden).JSON(map[string]interface{}{
				"error": map[string]interface{}{
					"code":    "FORBIDDEN",
					"message": "Admin access required",
				},
			})
		}
		return c.Next()
	}
}

func RequireStaff(jwtSecret []byte) fiber.Handler {
	auth := RequireAuth(jwtSecret)
	return func(c *fiber.Ctx) error {
		if err := auth(c); err != nil {
			return err
		}
		role, _ := c.Locals("role").(string)
		if role != "staff" {
			return c.Status(fiber.StatusForbidden).JSON(map[string]interface{}{
				"error": map[string]interface{}{
					"code":    "FORBIDDEN",
					"message": "Staff access required",
				},
			})
		}
		return c.Next()
	}
}

