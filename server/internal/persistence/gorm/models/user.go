package models

import (
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/common"
)

type UserModel struct {
	common.CommonModel
	FirstName string `gorm:"size:100;not null"`
	LastName  string `gorm:"size:100;not null"`
}

func (UserModel) TableName() string {
	return "users"
}
