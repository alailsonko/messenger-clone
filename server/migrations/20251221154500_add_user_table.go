package migrations

import (
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/models"
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	"gorm.io/gorm"
)

func init() {
	registry.Register("20251221154500_add_user_table.go", Up_20251221154500, Down_20251221154500)
}

func Up_20251221154500(db *gorm.DB) error {
	err := db.Migrator().CreateTable(&models.UserModel{})
	return err
}

func Down_20251221154500(db *gorm.DB) error {
	err := db.Migrator().DropTable(&models.UserModel{})
	return err
}
