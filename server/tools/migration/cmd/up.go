package cmd

import (
	"database/sql"
	"fmt"
	"os"
	"sort"
	"strings"

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
	UpCmdFlag = "up"
)

var UpCmd = &cobra.Command{
	Use:   UpCmdFlag,
	Short: "Apply the up migration",
	Run: func(cmd *cobra.Command, args []string) {
		configPath, _ := cmd.Flags().GetString("config")
		Up(configPath)
	},
}

func init() {
	UpCmd.Flags().StringP("config", "c", "", "path to migration YAML (defaults to $PWD/migration.yml)")
	UpCmd.MarkFlagRequired("config")
}

func Up(
	configPath string,
) {
	configInstance, err := config.NewConfig(configPath)
	if err != nil {
		panic(err)
	}
	err = configInstance.Validate()
	if err != nil {
		panic(err)
	}
	loggerInstance := logger.NewLogger()
	gormLogger := loggerInstance.GormLoggerFromZap()

	envConfig, ok := configInstance.Envs[configInstance.GoEnv]
	if !ok {
		panic("environment config not found: " + configInstance.GoEnv)
	}
	err = envConfig.Validate()
	if err != nil {
		panic(err)
	}

	dbPort, err := envConfig.DBPortInt()
	if err != nil {
		panic(err)
	}

	databaseInstance, err := database.NewDatabase(gormLogger, envConfig.DbHost, dbPort, envConfig.DbUser, envConfig.DbPassword, envConfig.DbName, configInstance.GoEnv)
	if err != nil {
		panic(err)
	}
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

	migrations, err := readMigrationsFromDir(configInstance.Dir)
	if err != nil {
		panic(fmt.Errorf("failed to read migrations: %w", err))
	}

	sort.Strings(migrations)

	for _, migration := range migrations {
		applied, err := isMigrationApplied(*databaseInstance.DB, configInstance.MigrationTable, migration)
		if err != nil {
			panic(fmt.Errorf("failed to check if migration applied: %w", err))
		}

		if !applied {
			migration, err := registry.Get(migration)
			if err != nil {
				panic(fmt.Errorf("failed to get migration from registry: %w", err))
			}

			err = databaseInstance.DB.Transaction(func(tx *gorm.DB) error {
				if err := migration.Up(tx); err != nil {
					tx.Rollback()
					loggerInstance.Error(fmt.Sprintf("Failed to execute migration %s: %v", migration.Name, err), zap.Error(err))
					return fmt.Errorf("failed to execute migration %s: %w", migration.Name, err)
				}

				if err := recordMigration(tx, configInstance.MigrationTable, migration.Name); err != nil {
					tx.Rollback()
					loggerInstance.Error(fmt.Sprintf("Failed to record migration %s: %v", migration.Name, err), zap.Error(err))
					return fmt.Errorf("failed to record migration %s: %w", migration.Name, err)
				}
				loggerInstance.Info(fmt.Sprintf("Successfully applied migration: %s", migration.Name))

				return nil
			}, &sql.TxOptions{Isolation: sql.LevelSerializable})
			if err != nil {
				panic(err)
			}

			loggerInstance.Info(fmt.Sprintf("applied the migration %s", migration.Name))
			return
		}
	}

	loggerInstance.Info("Up to date")
}

func createMigrationIfNotExists(migrator gorm.Migrator) error {
	hasTable := migrator.HasTable(models.MigrationModel{})
	if !hasTable {
		return migrator.CreateTable(models.MigrationModel{})
	}
	return nil
}

func createLockTableIfNotExists(migrator gorm.Migrator) error {
	hasTable := migrator.HasTable(models.MigrationLockModel{})
	if !hasTable {
		return migrator.CreateTable(models.MigrationLockModel{})
	}
	return nil
}

func isMigrationApplied(migrator gorm.DB, tableName string, migrationName string) (bool, error) {
	var count int64
	result := migrator.Table(tableName).Where("name = ?", migrationName).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

func recordMigration(db *gorm.DB, tableName string, migrationName string) error {
	result := db.Table(tableName).Create(&models.MigrationModel{
		Name: migrationName,
	})
	return result.Error
}

func acquireLock(db *gorm.DB, tableName string) error {
	var lock models.MigrationLockModel
	result := db.Table(tableName).First(&lock)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			lock.Locked = true
			return db.Table(tableName).Create(&lock).Error
		}
		return result.Error
	}
	if lock.Locked {
		return nil
	}
	lock.Locked = true
	return db.Table(tableName).Save(&lock).Error
}

func releaseLock(db *gorm.DB, tableName string) error {
	var lock models.MigrationLockModel
	result := db.Table(tableName).First(&lock)
	if result.Error != nil {
		return result.Error
	}
	if !lock.Locked {
		return nil
	}
	lock.Locked = false
	return db.Table(tableName).Save(&lock).Error
}

func readMigrationsFromDir(migrationDir string) ([]string, error) {
	files, err := os.ReadDir(migrationDir)
	if err != nil {
		return nil, err
	}
	var migrations []string
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".go") {
			migrations = append(migrations, file.Name())
		}
	}
	return migrations, nil
}
