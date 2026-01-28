package routes

import (
	"github.com/alailsonko/messenger-clone/server/internal/domain/service"
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
//   - userService: The user service for handling user operations
//
// Example:
//
//	api := app.Group("/api/v1")
//	routes.SetupUserRoutes(api, userService)
func SetupUserRoutes(router fiber.Router, userService service.UserService) {
	userHandler := handlers.NewUserHandler(userService)

	users := router.Group("/users")

	users.Get("/", userHandler.GetAllUsers)
	users.Get("/:id", userHandler.GetUserByID)
	users.Post("/", userHandler.CreateUser)
	users.Put("/:id", userHandler.UpdateUser)
	users.Delete("/:id", userHandler.DeleteUser)
}
