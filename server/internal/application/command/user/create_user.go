package user

import (
	"context"
	"time"

	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
	"github.com/alailsonko/messenger-clone/server/internal/domain/repository"
	"github.com/google/uuid"
)

// CreateUserCommand represents a command to create a new user
type CreateUserCommand struct {
	FirstName string
	LastName  string
}

func (c CreateUserCommand) CommandName() string {
	return "user.create"
}

// CreateUserHandler handles CreateUserCommand
type CreateUserHandler struct {
	repo repository.UserRepository
}

func NewCreateUserHandler(repo repository.UserRepository) *CreateUserHandler {
	return &CreateUserHandler{repo: repo}
}

func (h *CreateUserHandler) Handle(ctx context.Context, cmd CreateUserCommand) (*entity.User, error) {
	user := &entity.User{
		ID:        uuid.New().String(),
		FirstName: cmd.FirstName,
		LastName:  cmd.LastName,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := h.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}
