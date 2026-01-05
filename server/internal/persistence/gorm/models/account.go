package models

import (
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/common"
)

type AccountModel struct {
	common.CommonModel
	Username string `gorm:"uniqueIndex;size:255;not null"`
	Email    string `gorm:"uniqueIndex;size:255;not null"`
	Password string `gorm:"type:text;not null"`
}

func (AccountModel) TableName() string {
	return "accounts"
}
