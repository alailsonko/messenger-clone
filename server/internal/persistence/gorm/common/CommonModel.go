package common

import (
	"time"

	"github.com/google/uuid"
)

type CommonModel struct {
	Id        uuid.UUID `gorm:"type:uuid;default:uuidv7();primaryKey"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
