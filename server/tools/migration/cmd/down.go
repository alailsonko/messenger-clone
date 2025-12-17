package cmd

import (
	"errors"
	"fmt"

	"github.com/alailsonko/messenger-clone/server/internal/infra/database"
	"github.com/alailsonko/messenger-clone/server/internal/infra/logger"
	_ "github.com/alailsonko/messenger-clone/server/migrations"
	"github.com/alailsonko/messenger-clone/server/tools/migration/config"
	"github.com/alailsonko/messenger-clone/server/tools/migration/models"
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	"github.com/spf13/cobra"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

const (
	DownCmdFlag = "down"
)

func DownCmdFactory(cfg *config.Config, db *database.Database, log *logger.Logger) *cobra.Command {
	cmd := &cobra.Command{
		Use:   DownCmdFlag,
		Short: "Apply the down migration",
		RunE: func(cmd *cobra.Command, args []string) error {
			Down(db, log, cfg)
			return nil
		},
	}
	return cmd
}

func Down(
	databaseInstance *database.Database, loggerInstance *logger.Logger, configInstance *config.Config,
) error {
	migrator := databaseInstance.DB.Migrator()
	if err := createMigrationIfNotExists(migrator); err != nil {
		panic(err)
	}
	if err := createLockTableIfNotExists(migrator); err != nil {
		panic(err)
	}

	if err := acquireLock(databaseInstance.DB, configInstance.MigrationLockTable); err != nil {
		panic(fmt.Errorf("failed to acquire lock: %w", err))
	}
	defer func() {
		if err := releaseLock(databaseInstance.DB, configInstance.MigrationLockTable); err != nil {
			loggerInstance.Error(fmt.Sprintf("failed to release lock: %v", err))
		}
	}()

	// Get all applied migrations from the database
	appliedMigration, err := getLastAppliedMigration(databaseInstance.DB, configInstance.MigrationTable)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		loggerInstance.Info("No migrations to rollback")
		return nil
	}

	if err != nil {
		panic(fmt.Errorf("failed to get applied migrations: %w", err))
	}

	migration, err := registry.Get(appliedMigration)
	if err != nil {
		panic(fmt.Errorf("failed to get migration from registry: %w", err))
	}

	if err := migration.Down(databaseInstance.DB); err != nil {
		panic(fmt.Errorf("failed to execute down migration %s: %w", migration.Name, err))
	}

	if err := removeMigrationRecord(databaseInstance.DB, configInstance.MigrationTable, migration.Name); err != nil {
		panic(fmt.Errorf("failed to remove migration record: %w", err))
	}

	loggerInstance.Info(fmt.Sprintf("applied the down migration %s", migration.Name))
	return nil
}

func getLastAppliedMigration(db *gorm.DB, tableName string) (string, error) {
	loggerInstance := logger.NewLogger()
	loggerInstance.Info("Retrieving applied migrations from the database", zap.String("table", tableName))

	var migration models.MigrationModel

	result := db.Table(tableName).Last(&migration)
	if result.Error != nil {
		return "", result.Error
	}

	return migration.Name, nil
}

func removeMigrationRecord(db *gorm.DB, tableName string, migrationName string) error {
	result := db.Table(tableName).Where("name = ?", migrationName).Delete(&models.MigrationModel{}).Unscoped()
	return result.Error
}
