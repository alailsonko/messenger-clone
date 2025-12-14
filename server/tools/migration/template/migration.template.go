package template

func MigrationTemplate(timestamp string, name string) string {
	return `package migrations

import (
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	"gorm.io/gorm"
)

func init() {
	registry.Register("` + timestamp + `_` + name + `.go", Up, Down)
}

func Up(db *gorm.DB) error {
	// Implement the migration logic here
	return nil
}

func Down(db *gorm.DB) error {
	// Implement the rollback logic here
	return nil
}
`
}
