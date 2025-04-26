package routes

import (
	"github.com/alailsonko/messenger-clone/modules/orchestrator/app"
	"github.com/alailsonko/messenger-clone/modules/orchestrator/handlers/users"
)

func SetupRoutes() {
	apiUsers := app.Instance.Api.Group("/api/users")

	apiUsers.Get("/", users.GetUsers).Name("GetUser")
	apiUsers.Get("/:id", users.GetUserById).Name("GetUserById")
	apiUsers.Post("/", users.CreateUser).Name("CreateUser")
	apiUsers.Put("/:id", users.UpdateUser).Name("UpdateUser")
	apiUsers.Delete("/:id", users.DeleteUser).Name("DeleteUser")
}
