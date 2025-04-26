package users

import (
	"github.com/alailsonko/messenger-clone/modules/orchestrator/app"
	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
)

func GetUsers(c fiber.Ctx) error {
	app.Instance.Logger.Info("GetUsers called", zap.String("path", c.Path()))

	return c.SendString("Get Users")
}

func GetUserById(c fiber.Ctx) error {
	app.Instance.Logger.Info("GetUserById called", zap.String("path", c.Path()))

	id := c.Params("id")

	return c.SendString("Get User by ID: " + id)
}

func CreateUser(c fiber.Ctx) error {
	app.Instance.Logger.Info("CreateUser called", zap.String("path", c.Path()))

	// Simulate user creation logic
	return c.SendString("User created")
}

func UpdateUser(c fiber.Ctx) error {
	app.Instance.Logger.Info("UpdateUser called", zap.String("path", c.Path()))

	id := c.Params("id")

	// Simulate user update logic
	return c.SendString("User updated with ID: " + id)
}

func DeleteUser(c fiber.Ctx) error {
	app.Instance.Logger.Info("DeleteUser called", zap.String("path", c.Path()))

	id := c.Params("id")

	// Simulate user deletion logic
	return c.SendString("User deleted with ID: " + id)
}
