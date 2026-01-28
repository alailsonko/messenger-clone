package user

import (
	"context"

	domainerrors "github.com/alailsonko/messenger-clone/server/internal/domain/errors"
	"github.com/alailsonko/messenger-clone/server/internal/domain/repository"
)

// DeleteUserCommand represents a command to delete a user
type DeleteUserCommand struct {
	ID string
}

func (c DeleteUserCommand) CommandName() string {
	return "user.delete"
}

// DeleteUserResult represents the result of a delete operation
type DeleteUserResult struct {
	Success bool
}

// DeleteUserHandler handles DeleteUserCommand
type DeleteUserHandler struct {
	repo repository.UserRepository
}

func NewDeleteUserHandler(repo repository.UserRepository) *DeleteUserHandler {
	return &DeleteUserHandler{repo: repo}
}

func (h *DeleteUserHandler) Handle(ctx context.Context, cmd DeleteUserCommand) (*DeleteUserResult, error) {
	user, err := h.repo.FindByID(ctx, cmd.ID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, domainerrors.ErrUserNotFound
	}

	if err := h.repo.Delete(ctx, cmd.ID); err != nil {
		return nil, err
	}

	return &DeleteUserResult{Success: true}, nil
}
