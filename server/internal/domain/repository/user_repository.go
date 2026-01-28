package repository

import (
	"context"

	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
)

// Pagination holds pagination parameters
type Pagination struct {
	Limit  int
	Offset int
}

// DefaultPagination returns default pagination (limit 100)
func DefaultPagination() Pagination {
	return Pagination{Limit: 100, Offset: 0}
}

type UserRepository interface {
	FindAll(ctx context.Context, pagination *Pagination) ([]entity.User, error)
	FindByID(ctx context.Context, id string) (*entity.User, error)
	Create(ctx context.Context, user *entity.User) error
	Update(ctx context.Context, user *entity.User) error
	Delete(ctx context.Context, id string) error
}
