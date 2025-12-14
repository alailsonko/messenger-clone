package migration

import (
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	"gorm.io/gorm"
)

func init() {
	registry.Register("20251213161251_add_account_table.go", Up, Down)
}

func Up(db *gorm.DB) error {
	// Implement the migration logic here
	return nil
}

func Down(db *gorm.DB) error {
	// Implement the rollback logic here
	return nil
}
