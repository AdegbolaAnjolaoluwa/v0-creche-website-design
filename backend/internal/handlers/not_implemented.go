package handlers

import "github.com/gofiber/fiber/v2"

func NotImplemented(code string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotImplemented).JSON(ErrorResponseEnvelope{
			Error: ErrorBody{
				Code:    code,
				Message: "Endpoint not implemented yet",
			},
		})
	}
}

