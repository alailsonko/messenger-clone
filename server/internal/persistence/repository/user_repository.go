package repository

import (
	"context"

	"github.com/alailsonko/messenger-clone/server/internal/domain/entity"
	"github.com/alailsonko/messenger-clone/server/internal/domain/repository"
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/common"
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UserGormRepository implements UserRepository using GORM
type UserGormRepository struct {
	db *gorm.DB
}

// NewUserGormRepository creates a new UserGormRepository
func NewUserGormRepository(db *gorm.DB) repository.UserRepository {
	return &UserGormRepository{db: db}
}

func (r *UserGormRepository) FindAll(ctx context.Context, pagination *repository.Pagination) ([]entity.User, error) {
	var userModels []models.UserModel

	// Default pagination if nil
	limit := 100
	offset := 0
	if pagination != nil {
		if pagination.Limit > 0 && pagination.Limit <= 1000 {
			limit = pagination.Limit
		}
		if pagination.Offset >= 0 {
			offset = pagination.Offset
		}
	}

	// Optimized query: select only needed columns, with limit
	err := r.db.WithContext(ctx).
		Select("id", "first_name", "last_name", "created_at", "updated_at").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&userModels).Error

	if err != nil {
		return nil, err
	}

	users := make([]entity.User, len(userModels))
	for i, m := range userModels {
		users[i] = toUserEntity(m)
	}
	return users, nil
}

func (r *UserGormRepository) FindByID(ctx context.Context, id string) (*entity.User, error) {
	var userModel models.UserModel

	// Use Take instead of First for better performance (no ORDER BY)
	err := r.db.WithContext(ctx).
		Select("id", "first_name", "last_name", "created_at", "updated_at").
		Where("id = ?", id).
		Take(&userModel).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Return nil, nil for not found - handlers check for nil user
		}
		return nil, err
	}

	user := toUserEntity(userModel)
	return &user, nil
}

func (r *UserGormRepository) Create(ctx context.Context, user *entity.User) error {
	userModel := toUserModel(user)
	return r.db.WithContext(ctx).Create(&userModel).Error
}

func (r *UserGormRepository) Update(ctx context.Context, user *entity.User) error {
	// Use Updates instead of Save for better performance (only updates changed fields)
	return r.db.WithContext(ctx).
		Model(&models.UserModel{}).
		Where("id = ?", user.ID).
		Updates(map[string]interface{}{
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"updated_at": user.UpdatedAt,
		}).Error
}

func (r *UserGormRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&models.UserModel{}).Error
}

// Mappers
func toUserEntity(m models.UserModel) entity.User {
	return entity.User{
		ID:        m.CommonModel.Id.String(),
		FirstName: m.FirstName,
		LastName:  m.LastName,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

func toUserModel(e *entity.User) models.UserModel {
	id, _ := uuid.Parse(e.ID)
	return models.UserModel{
		CommonModel: common.CommonModel{
			Id:        id,
			CreatedAt: e.CreatedAt,
			UpdatedAt: e.UpdatedAt,
		},
		FirstName: e.FirstName,
		LastName:  e.LastName,
	}
}
