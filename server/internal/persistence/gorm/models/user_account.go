package models

import (
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/common"
	"github.com/google/uuid"
)

type UserAccountModel struct {
	common.CommonModel
	UserID    uuid.UUID    `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_account"`
	User      UserModel    `gorm:"foreignKey:UserID;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	AccountID uuid.UUID    `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_account"`
	Account   AccountModel `gorm:"foreignKey:AccountID;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func (UserAccountModel) TableName() string {
	return "users_accounts"
}
