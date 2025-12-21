package models

import (
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/common"
)

type UserModel struct {
	common.CommonModel
	FirstName string `gorm:"size:100;not null"`
	LastName  string `gorm:"size:100;not null"`
	Email     string `gorm:"uniqueIndex;size:255;not null"`
}
