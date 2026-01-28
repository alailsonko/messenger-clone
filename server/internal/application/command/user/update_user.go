package user

import (
	"context"
	"time"

	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
	domainerrors "github.com/alailsonko/messenger-clone/server/internal/domain/errors"
	"github.com/alailsonko/messenger-clone/server/internal/domain/repository"
)

// UpdateUserCommand represents a command to update an existing user
type UpdateUserCommand struct {
	ID        string
	FirstName string
	LastName  string
}

func (c UpdateUserCommand) CommandName() string {
	return "user.update"
}

// UpdateUserHandler handles UpdateUserCommand
type UpdateUserHandler struct {
	repo repository.UserRepository
}

func NewUpdateUserHandler(repo repository.UserRepository) *UpdateUserHandler {
	return &UpdateUserHandler{repo: repo}
}

func (h *UpdateUserHandler) Handle(ctx context.Context, cmd UpdateUserCommand) (*entity.User, error) {
	user, err := h.repo.FindByID(ctx, cmd.ID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, domainerrors.ErrUserNotFound
	}

	if cmd.FirstName != "" {
		user.FirstName = cmd.FirstName
	}
	if cmd.LastName != "" {
		user.LastName = cmd.LastName
	}
	user.UpdatedAt = time.Now()

	if err := h.repo.Update(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}
