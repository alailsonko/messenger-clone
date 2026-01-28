package user

import (
	"context"

	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
	"github.com/alailsonko/messenger-clone/server/internal/domain/repository"
)

// GetUserQuery represents a query to get a user by ID
type GetUserQuery struct {
	ID string
}

func (q GetUserQuery) QueryName() string {
	return "user.get"
}

// GetUserHandler handles GetUserQuery
type GetUserHandler struct {
	repo repository.UserRepository
}

func NewGetUserHandler(repo repository.UserRepository) *GetUserHandler {
	return &GetUserHandler{repo: repo}
}

func (h *GetUserHandler) Handle(ctx context.Context, q GetUserQuery) (*entity.User, error) {
	return h.repo.FindByID(ctx, q.ID)
}
