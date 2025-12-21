package cmd

import (
	"context"
	"database/sql"
	"errors"
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
	migration_repository "github.com/alailsonko/messenger-clone/server/tools/migration/repository/migration"
	"github.com/spf13/cobra"
	"gorm.io/gorm"
)

const (
	UpCmdFlag = "up"
)

func UpCmdFactory(cfg *config.Config, db *database.Database, log *logger.Logger) *cobra.Command {
	cmd := &cobra.Command{
		Use:   UpCmdFlag,
		Short: "Apply the up migration",
		RunE: RunExecutable(func(cmd *cobra.Command) (Executable, error) {
			upCommand := &UpCommand{
				cfg: cfg,
				db:  db,
				log: log,
				ctx: cmd.Context(),
			}
			return upCommand, nil
		}),
	}
	return cmd
}

type UpCommand struct {
	cfg *config.Config
	db  *database.Database
	log *logger.Logger
	ctx context.Context
}

func (u *UpCommand) Execute() error {
	if u.cfg == nil {
		return errors.New("config is required")
	}
	if u.db == nil || u.db.DB == nil {
		return errors.New("database is required")
	}
	if u.log == nil {
		return errors.New("logger is required")
	}
	if u.cfg.Dir == "" {
		return errors.New("migration dir is not configured")
	}

	db := u.db.DB
	if u.ctx != nil {
		db = db.WithContext(u.ctx)
	}

	migrationRepository := migration_repository.NewMigrationRepository(db)
	if err := migrationRepository.CreateTablesIfNotExists(); err != nil {
		return fmt.Errorf("failed to create migration tables: %w", err)
	}

	locked, err := migrationRepository.IsLocked()
	if err != nil {
		return fmt.Errorf("failed to check migration lock: %w", err)
	}
	if locked {
		return errors.New("migration is locked, another migration process might be running")
	}

	if err := migrationRepository.UpdateLock(true); err != nil {
		return fmt.Errorf("failed to acquire migration lock: %w", err)
	}
	defer func() {
		if err := migrationRepository.UpdateLock(false); err != nil {
			u.log.Error(fmt.Sprintf("failed to release migration lock: %v", err))
		}
	}()

	migrations, err := u.readMigrationsFromDir(u.cfg.Dir)
	if err != nil {
		return fmt.Errorf("failed to read migrations: %w", err)
	}
	sort.Strings(migrations)

	for _, migrationName := range migrations {
		applied, err := u.isMigrationApplied(migrationName)
		if err != nil {
			return fmt.Errorf("failed to check if migration applied: %w", err)
		}
		if applied {
			continue
		}

		mig, err := registry.Get(migrationName)
		if err != nil {
			return fmt.Errorf("failed to get migration from registry: %w", err)
		}

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
			return err
		}

		u.log.Info(fmt.Sprintf("applied the migration %s", mig.Name))
		return nil
	}

	u.log.Info("Up to date")
	return nil
}

func (u *UpCommand) isMigrationApplied(migrationName string) (bool, error) {
	var count int64
	res := u.db.DB.Model(&models.MigrationModel{}).Where("name = ?", migrationName).Count(&count)
	if res.Error != nil {
		return false, res.Error
	}
	return count > 0, nil
}

func (u *UpCommand) readMigrationsFromDir(migrationDir string) ([]string, error) {
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
