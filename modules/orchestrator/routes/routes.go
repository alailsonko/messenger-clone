package routes

import (
	"orchestrator/app"
	"orchestrator/handlers/users"
)

func SetupRoutes(app *app.App) {
	apiUsers := app.Api.Group("/api/users")

	apiUsers.Get("/", users.GetUsers).Name("GetUser")
	apiUsers.Get("/:id", users.GetUserById).Name("GetUserById")
	apiUsers.Post("/", users.CreateUser).Name("CreateUser")
	apiUsers.Put("/:id", users.UpdateUser).Name("UpdateUser")
	apiUsers.Delete("/:id", users.DeleteUser).Name("DeleteUser")
}
