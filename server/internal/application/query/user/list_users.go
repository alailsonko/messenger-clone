package user

import (
	"context"

	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
	"github.com/alailsonko/messenger-clone/server/internal/domain/repository"
)

// ListUsersQuery represents a query to list all users
type ListUsersQuery struct {
	Limit  int
	Offset int
}

func (q ListUsersQuery) QueryName() string {
	return "user.list"
}

// ListUsersHandler handles ListUsersQuery
type ListUsersHandler struct {
	repo repository.UserRepository
}

func NewListUsersHandler(repo repository.UserRepository) *ListUsersHandler {
	return &ListUsersHandler{repo: repo}
}

func (h *ListUsersHandler) Handle(ctx context.Context, q ListUsersQuery) ([]entity.User, error) {
	pagination := &repository.Pagination{
		Limit:  q.Limit,
		Offset: q.Offset,
	}
	if pagination.Limit <= 0 {
		pagination.Limit = 100 // default
	}
	return h.repo.FindAll(ctx, pagination)
}
