package migrations

import (
	"github.com/alailsonko/messenger-clone/server/internal/persistence/gorm/models"
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	"gorm.io/gorm"
)

func init() {
	registry.Register("20251213161251_add_account_table.go", Up_20251213161251, Down_20251213161251)
}

func Up_20251213161251(db *gorm.DB) error {
	err := db.Migrator().CreateTable(&models.AccountModel{})
	return err
}

func Down_20251213161251(db *gorm.DB) error {
	err := db.Migrator().DropTable(&models.AccountModel{})
	return err
}
