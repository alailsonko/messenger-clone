/*
Package handlers contains HTTP request handlers for the presentation layer.

Handlers are responsible for:
  - Parsing and validating HTTP request data
  - Calling application services to perform business operations
  - Formatting and returning HTTP responses

# Architecture

Handlers follow the Clean Architecture pattern and depend on application services
(not repositories directly). This ensures:

  - Clear separation of concerns

  - Testability (services can be mocked)

  - Business logic stays in the service layer

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                      HTTP Request                                        │
    └─────────────────────────────────────────────────────────────────────────┘
    │
    ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                      Handler (user_handler.go)                           │
    │  1. Parse request (path params, body, query params)                      │
    │  2. Validate input                                                       │
    │  3. Call service method                                                  │
    │  4. Map result to response DTO                                           │
    │  5. Return HTTP response                                                 │
    └─────────────────────────────────────────────────────────────────────────┘
    │
    ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                      Service (UserService)                               │
    │  - Business logic                                                        │
    │  - Domain validation                                                     │
    │  - Repository coordination                                               │
    └─────────────────────────────────────────────────────────────────────────┘
*/
package handlers

import (
	"strconv"

	domaindto "github.com/alailsonko/messenger-clone/server/internal/domain/dto"
	"github.com/alailsonko/messenger-clone/server/internal/domain/errors"
	"github.com/alailsonko/messenger-clone/server/internal/domain/service"
	"github.com/alailsonko/messenger-clone/server/internal/presentation/dto"
	"github.com/gofiber/fiber/v3"
)

// UserHandler handles HTTP requests for user-related operations.
//
// It follows the single responsibility principle by only handling HTTP concerns:
//   - Request parsing and validation
//   - Response formatting
//   - HTTP status code mapping
//
// All business logic is delegated to the UserService.
type UserHandler struct {
	// userService handles all user-related business operations.
	// It abstracts the CQRS pattern internally (separate read/write repos).
	userService service.UserService
}

// NewUserHandler creates a new UserHandler with the given UserService.
//
// Parameters:
//   - userService: The application service for user operations
//
// Returns:
//   - A new UserHandler instance
//
// Example:
//
//	userService := appservice.NewUserService(writeRepo, readRepo)
//	handler := handlers.NewUserHandler(userService)
func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// GetAllUsers retrieves all users.
//
// # HTTP Endpoint
//
//	GET /api/v1/users
//
// # Response
//
// Success (200 OK):
//
//	{
//	    "success": true,
//	    "data": [
//	        {
//	            "id": "uuid",
//	            "first_name": "John",
//	            "last_name": "Doe",
//	            "created_at": "2024-01-01T00:00:00Z",
//	            "updated_at": "2024-01-01T00:00:00Z"
//	        }
//	    ]
//	}
//
// Error (500 Internal Server Error):
//
//	{
//	    "success": false,
//	    "error": "error message"
//	}
func (h *UserHandler) GetAllUsers(c fiber.Ctx) error {
	ctx := c.Context()

	// Parse pagination query params with defaults
	limit := 20
	offset := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}
	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = parsed
		}
	}

	// Enforce limits
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	users, err := h.userService.GetAllUsers(ctx, domaindto.PaginationData{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	response := make([]dto.UserResponse, len(users))
	for i, u := range users {
		response[i] = dto.NewUserResponse(u)
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

// GetUserByID retrieves a user by their unique identifier.
//
// # HTTP Endpoint
//
//	GET /api/v1/users/:id
//
// # Path Parameters
//
//   - id: The unique identifier of the user (UUID format)
//
// # Response
//
// Success (200 OK):
//
//	{
//	    "success": true,
//	    "data": {
//	        "id": "uuid",
//	        "first_name": "John",
//	        "last_name": "Doe",
//	        "created_at": "2024-01-01T00:00:00Z",
//	        "updated_at": "2024-01-01T00:00:00Z"
//	    }
//	}
//
// Not Found (404):
//
//	{
//	    "success": false,
//	    "error": "User not found"
//	}
//
// Error (500 Internal Server Error):
//
//	{
//	    "success": false,
//	    "error": "error message"
//	}
func (h *UserHandler) GetUserByID(c fiber.Ctx) error {
	ctx := c.Context()
	id := c.Params("id")

	user, err := h.userService.GetUserByID(ctx, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(dto.NewUserResponse(*user))
}

// CreateUser creates a new user.
//
// # HTTP Endpoint
//
//	POST /api/v1/users
//
// # Request Body
//
//	{
//	    "first_name": "John",
//	    "last_name": "Doe"
//	}
//
// # Response
//
// Success (201 Created):
//
//	{
//	    "success": true,
//	    "data": {
//	        "id": "generated-uuid",
//	        "first_name": "John",
//	        "last_name": "Doe",
//	        "created_at": "2024-01-01T00:00:00Z",
//	        "updated_at": "2024-01-01T00:00:00Z"
//	    }
//	}
//
// Bad Request (400):
//
//	{
//	    "success": false,
//	    "error": "Invalid request body"
//	}
//
// Error (500 Internal Server Error):
//
//	{
//	    "success": false,
//	    "error": "error message"
//	}
func (h *UserHandler) CreateUser(c fiber.Ctx) error {
	ctx := c.Context()
	var req dto.CreateUserRequest

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	user, err := h.userService.CreateUser(ctx, domaindto.CreateUserData{
		FirstName: req.FirstName,
		LastName:  req.LastName,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(dto.NewUserResponse(*user))
}

// UpdateUser updates an existing user.
//
// # HTTP Endpoint
//
//	PUT /api/v1/users/:id
//
// # Path Parameters
//
//   - id: The unique identifier of the user to update (UUID format)
//
// # Request Body
//
//	{
//	    "first_name": "Jane",
//	    "last_name": "Smith"
//	}
//
// # Response
//
// Success (200 OK):
//
//	{
//	    "success": true,
//	    "data": {
//	        "id": "uuid",
//	        "first_name": "Jane",
//	        "last_name": "Smith",
//	        "created_at": "2024-01-01T00:00:00Z",
//	        "updated_at": "2024-01-02T00:00:00Z"
//	    }
//	}
//
// Not Found (404):
//
//	{
//	    "success": false,
//	    "error": "User not found"
//	}
//
// Bad Request (400):
//
//	{
//	    "success": false,
//	    "error": "Invalid request body"
//	}
//
// Error (500 Internal Server Error):
//
//	{
//	    "success": false,
//	    "error": "error message"
//	}
func (h *UserHandler) UpdateUser(c fiber.Ctx) error {
	ctx := c.Context()
	id := c.Params("id")

	var req dto.UpdateUserRequest

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	user, err := h.userService.UpdateUser(ctx, id, domaindto.UpdateUserData{
		FirstName: req.FirstName,
		LastName:  req.LastName,
	})
	if err != nil {
		if err == errors.ErrUserNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(dto.NewUserResponse(*user))
}

// DeleteUser deletes a user by ID.
//
// # HTTP Endpoint
//
//	DELETE /api/v1/users/:id
//
// # Path Parameters
//
//   - id: The unique identifier of the user to delete (UUID format)
//
// # Response
//
// Success (200 OK):
//
//	{
//	    "success": true,
//	    "message": "User deleted successfully"
//	}
//
// Not Found (404):
//
//	{
//	    "success": false,
//	    "error": "User not found"
//	}
//
// Error (500 Internal Server Error):
//
//	{
//	    "success": false,
//	    "error": "error message"
//	}
func (h *UserHandler) DeleteUser(c fiber.Ctx) error {
	ctx := c.Context()
	id := c.Params("id")

	err := h.userService.DeleteUser(ctx, id)
	if err != nil {
		if err == errors.ErrUserNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
