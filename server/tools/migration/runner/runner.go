// Package runner provides programmatic access to run migrations.
// This can be used both by the CLI tool and by the server at startup.
package runner

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"sort"

	// Import migrations to register them
	_ "github.com/alailsonko/messenger-clone/server/migrations"
	"github.com/alailsonko/messenger-clone/server/tools/migration/models"
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	migration_repository "github.com/alailsonko/messenger-clone/server/tools/migration/repository/migration"
	"gorm.io/gorm"
)

// RunLatest applies all pending migrations using the registry.
// It returns the number of migrations applied and any error encountered.
// This function can be called from both CLI and server startup.
func RunLatest(ctx context.Context, db *gorm.DB) (int, error) {
	if ctx != nil {
		db = db.WithContext(ctx)
	}

	migrationRepository := migration_repository.NewMigrationRepository(db)

	// Create migration tracking tables if they don't exist
	if err := migrationRepository.CreateTablesIfNotExists(); err != nil {
		return 0, fmt.Errorf("failed to create migration tables: %w", err)
	}

	// Check and acquire lock
	locked, err := migrationRepository.IsLocked()
	if err != nil {
		return 0, fmt.Errorf("failed to check migration lock: %w", err)
	}
	if locked {
		log.Println("[MIGRATION] Migration is locked, skipping (another process may be running)")
		return 0, nil
	}

	if err := migrationRepository.UpdateLock(true); err != nil {
		return 0, fmt.Errorf("failed to acquire migration lock: %w", err)
	}
	defer func() {
		if err := migrationRepository.UpdateLock(false); err != nil {
			log.Printf("[MIGRATION] Warning: failed to release migration lock: %v", err)
		}
	}()

	// Get all registered migrations and sort them
	allMigrations := registry.All()
	var migrationNames []string
	for name := range allMigrations {
		migrationNames = append(migrationNames, name)
	}
	sort.Strings(migrationNames)

	// Apply pending migrations
	applied := 0
	for _, migrationName := range migrationNames {
		isApplied, err := isMigrationApplied(db, migrationName)
		if err != nil {
			return applied, fmt.Errorf("failed to check migration status: %w", err)
		}
		if isApplied {
			continue
		}

		mig, err := registry.Get(migrationName)
		if err != nil {
			return applied, fmt.Errorf("failed to get migration from registry: %w", err)
		}

		log.Printf("[MIGRATION] Applying migration: %s", mig.Name)

		err = db.Transaction(func(tx *gorm.DB) error {
			if err := mig.Up(tx); err != nil {
				return fmt.Errorf("failed to execute migration %s: %w", mig.Name, err)
			}
			if err := tx.Create(&models.MigrationModel{Name: mig.Name}).Error; err != nil {
				return fmt.Errorf("failed to record migration %s: %w", mig.Name, err)
			}
			return nil
		}, &sql.TxOptions{Isolation: sql.LevelSerializable})

		if err != nil {
			return applied, err
		}

		log.Printf("[MIGRATION] Applied migration: %s", mig.Name)
		applied++
	}

	if applied == 0 {
		log.Println("[MIGRATION] Database is up to date")
	} else {
		log.Printf("[MIGRATION] Applied %d migration(s)", applied)
	}

	return applied, nil
}

func isMigrationApplied(db *gorm.DB, migrationName string) (bool, error) {
	var count int64
	result := db.Model(&models.MigrationModel{}).Where("name = ?", migrationName).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}
