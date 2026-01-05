package migrations

import (
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/models"
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	"gorm.io/gorm"
)

func init() {
	registry.Register("20251221162915_add_user_account_table.go", Up_20251221162915, Down_20251221162915)
}

func Up_20251221162915(db *gorm.DB) error {
	m := db.Migrator()
	if !m.HasTable(&models.UserModel{}) {
		if err := m.CreateTable(&models.UserModel{}); err != nil {
			return err
		}
	}
	if !m.HasTable(&models.AccountModel{}) {
		if err := m.CreateTable(&models.AccountModel{}); err != nil {
			return err
		}
	}
	return m.CreateTable(&models.UserAccountModel{})
}

func Down_20251221162915(db *gorm.DB) error {
	err := db.Migrator().DropTable(&models.UserAccountModel{})
	return err
}
