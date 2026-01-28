package models

import (
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/common"
)

type UserModel struct {
	common.CommonModel
	FirstName string `gorm:"size:100;not null;index:idx_user_name"`
	LastName  string `gorm:"size:100;not null;index:idx_user_name"`
}

func (UserModel) TableName() string {
	return "users"
}
