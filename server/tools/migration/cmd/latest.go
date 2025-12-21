package cmd

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"sort"
	"strings"

	"github.com/alailsonko/messenger-clone/server/config"
	"github.com/alailsonko/messenger-clone/server/internal/infra/database"
	"github.com/alailsonko/messenger-clone/server/internal/infra/logger"
	_ "github.com/alailsonko/messenger-clone/server/migrations"
	"github.com/alailsonko/messenger-clone/server/tools/migration/models"
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	migration_repository "github.com/alailsonko/messenger-clone/server/tools/migration/repository/migration"
	"github.com/spf13/cobra"
	"gorm.io/gorm"
)

const (
	LatestCmdFlag = "latest"
)

func LatestCmdFactory(cfg *config.Config, log *logger.Logger, db *database.Database) *cobra.Command {
	cmd := &cobra.Command{
		Use:   LatestCmdFlag,
		Short: "Migrate all created migrations that have not been applied yet",
		RunE: RunExecutable(func(cmd *cobra.Command) (Executable, error) {
			latestCommand := &LatestCommand{
				cfg: cfg,
				log: log,
				db:  db,
				ctx: cmd.Context(),
			}
			return latestCommand, nil
		}),
	}
	return cmd
}

type LatestCommand struct {
	cfg *config.Config
	log *logger.Logger
	db  *database.Database
	ctx context.Context
}

func (l *LatestCommand) Execute() error {
	if l.cfg == nil {
		return errors.New("config is required")
	}
	if l.log == nil {
		return errors.New("logger is required")
	}
	if l.db == nil || l.db.DB == nil {
		return errors.New("database is required")
	}
	if l.cfg.Dir == "" {
		return errors.New("migration dir is not configured")
	}

	db := l.db.DB
	if l.ctx != nil {
		db = db.WithContext(l.ctx)
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
			l.log.Error(fmt.Sprintf("failed to release migration lock: %v", err))
		}
	}()

	migrations, err := l.readMigrationsFromDir(l.cfg.Dir)
	if err != nil {
		return fmt.Errorf("failed to read migrations: %w", err)
	}
	sort.Strings(migrations)

	appliedAny := false
	for _, migrationName := range migrations {
		applied, err := l.isMigrationApplied(migrationName)
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

		l.log.Info(fmt.Sprintf("applying migration %s", mig.Name))
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
		l.log.Info(fmt.Sprintf("applied migration %s", mig.Name))
		appliedAny = true
	}

	if !appliedAny {
		l.log.Info("Up to date")
		return nil
	}

	l.log.Info("all migrations are up to date")
	return nil
}

func (l *LatestCommand) isMigrationApplied(migrationName string) (bool, error) {
	var count int64
	res := l.db.DB.Model(&models.MigrationModel{}).Where("name = ?", migrationName).Count(&count)
	if res.Error != nil {
		return false, res.Error
	}
	return count > 0, nil
}

func (l *LatestCommand) readMigrationsFromDir(migrationDir string) ([]string, error) {
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
