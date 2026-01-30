package routes

import (
	"github.com/alailsonko/messenger-clone/server/internal/bootstrap"
	"github.com/alailsonko/messenger-clone/server/internal/presentation/handlers"
	"github.com/gofiber/fiber/v3"
)

// SetupUserRoutes configures routes for user-related HTTP endpoints.
//
// # Endpoints
//
//	GET    /users      → List all users
//	GET    /users/:id  → Get user by ID
//	POST   /users      → Create a new user
//	PUT    /users/:id  → Update an existing user
//	DELETE /users/:id  → Delete a user
//
// Parameters:
//   - router: The Fiber router (app or group) to attach routes to
//   - appService: The application service containing user service
//
// Example:
//
//	api := app.Group("/api/v1")
//	routes.SetupUserRoutes(api, appService)
func SetupUserRoutes(router fiber.Router, appService *bootstrap.ApplicationService) {
	userHandler := handlers.NewUserHandler(appService)

	users := router.Group("/users")

	users.Get("/", userHandler.GetAllUsers)
	users.Get("/:id", userHandler.GetUserByID)
	users.Post("/", userHandler.CreateUser)
	users.Put("/:id", userHandler.UpdateUser)
	users.Delete("/:id", userHandler.DeleteUser)
}
