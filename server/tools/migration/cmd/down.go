package cmd

import (
	"context"
	"errors"
	"fmt"

	"github.com/alailsonko/messenger-clone/server/config"
	"github.com/alailsonko/messenger-clone/server/internal/infra/database"
	"github.com/alailsonko/messenger-clone/server/internal/infra/logger"
	_ "github.com/alailsonko/messenger-clone/server/migrations"
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	migration_repository "github.com/alailsonko/messenger-clone/server/tools/migration/repository/migration"
	"github.com/spf13/cobra"
	"gorm.io/gorm"
)

const (
	DownCmdFlag = "down"
)

func DownCmdFactory(cfg *config.Config, db *database.Database, log *logger.Logger) *cobra.Command {
	cmd := &cobra.Command{
		Use:   DownCmdFlag,
		Short: "Apply the down migration",
		RunE: RunExecutable(func(cmd *cobra.Command) (Executable, error) {
			downCommand := &DownCommand{
				cfg: cfg,
				db:  db,
				log: log,
				ctx: cmd.Context(),
			}
			return downCommand, nil
		}),
	}
	return cmd
}

type DownCommand struct {
	cfg *config.Config
	db  *database.Database
	log *logger.Logger
	ctx context.Context
}

func (d *DownCommand) Execute() error {
	if d.cfg == nil {
		return errors.New("config is required")
	}
	if d.db == nil || d.db.DB == nil {
		return errors.New("database is required")
	}
	if d.log == nil {
		return errors.New("logger is required")
	}
	if d.cfg.Dir == "" {
		return errors.New("migration dir is not configured")
	}
	migrationRepository := migration_repository.NewMigrationRepository(d.db.DB)
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
			d.log.Error(fmt.Sprintf("failed to release migration lock: %v", err))
		}
	}()

	appliedMigration, err := migrationRepository.GetLastAppliedMigration()
	if errors.Is(err, gorm.ErrRecordNotFound) {
		d.log.Info("no applied migrations found, skipping down migration")
		return nil
	}

	if err != nil {
		return fmt.Errorf("failed to get last applied migration: %w", err)
	}

	migration, err := registry.Get(appliedMigration.Name)
	if err != nil {
		return fmt.Errorf("failed to get migration %s from registry: %w", appliedMigration.Name, err)
	}

	if err := migration.Down(d.db.DB); err != nil {
		return fmt.Errorf("failed to execute down migration %s: %w", migration.Name, err)
	}

	if err := migrationRepository.DeleteMigrationByName(migration.Name); err != nil {
		return fmt.Errorf("failed to delete migration record: %w", err)
	}

	d.log.Info(fmt.Sprintf("applied the down migration %s", migration.Name))
	return nil
}
