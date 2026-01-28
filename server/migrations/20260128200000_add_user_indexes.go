package migrations

import (
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	"gorm.io/gorm"
)

func init() {
	registry.Register("20260128200000_add_user_indexes.go", Up_20260128200000, Down_20260128200000)
}

func Up_20260128200000(db *gorm.DB) error {
	// Add composite index on first_name, last_name for faster lookups
	if err := db.Exec(`CREATE INDEX IF NOT EXISTS idx_users_name ON users (first_name, last_name)`).Error; err != nil {
		return err
	}

	// Add index on created_at for faster ORDER BY queries
	if err := db.Exec(`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC)`).Error; err != nil {
		return err
	}

	return nil
}

func Down_20260128200000(db *gorm.DB) error {
	if err := db.Exec(`DROP INDEX IF EXISTS idx_users_name`).Error; err != nil {
		return err
	}
	if err := db.Exec(`DROP INDEX IF EXISTS idx_users_created_at`).Error; err != nil {
		return err
	}
	return nil
}
