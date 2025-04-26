package users

import (
	"github.com/alailsonko/messenger-clone/modules/orchestrator/app"
	user_pb "github.com/alailsonko/messenger-clone/modules/shared/protobuf"
	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

func GetUsers(c fiber.Ctx) error {
	app.Instance.Logger.Info("GetUsers called", zap.String("path", c.Path()))

	conn, err := grpc.NewClient("users", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		app.Instance.Logger.Error("Failed to create gRPC client", zap.Error(err))
		return c.Status(500).SendString("Internal Server Error")
	}
	defer conn.Close()

	client := user_pb.NewUsersServiceClient(conn)

	ctx := c.Context()
	request := &user_pb.GetUserRequest{
		Id: "example-id", // Replace with the actual user ID
	}
	response, err := client.GetUser(ctx, request, grpc.WaitForReady(true), grpc.Header(&metadata.MD{
		"authorization": []string{"Bearer example-token"}, // Replace with actual token
	}))
	if err != nil {
		app.Instance.Logger.Error("Failed to get user", zap.Error(err))
		return c.Status(500).SendString("Internal Server Error")
	}
	app.Instance.Logger.Info("GetUser response received", zap.Any("response", response))

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
