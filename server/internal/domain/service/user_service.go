package service

import (
	"context"

	"github.com/alailsonko/messenger-clone/server/internal/domain/dto"
	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
)

type UserService interface {
	GetAllUsers(ctx context.Context, pagination dto.PaginationData) ([]entity.User, error)
	GetUserByID(ctx context.Context, id string) (*entity.User, error)
	CreateUser(ctx context.Context, data dto.CreateUserData) (*entity.User, error)
	UpdateUser(ctx context.Context, id string, data dto.UpdateUserData) (*entity.User, error)
	DeleteUser(ctx context.Context, id string) error
}
