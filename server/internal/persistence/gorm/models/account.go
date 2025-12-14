package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AccountModel struct {
	gorm.Model
	ID       uuid.UUID `gorm:"type:uuid;default:uuidv7();primaryKey"`
	Username string    `gorm:"uniqueIndex;size:255;not null"`
	Email    string    `gorm:"uniqueIndex;size:255;not null"`
	Password string    `gorm:"type:text;not null"`
}
