package cmd

import (
	"context"
	"errors"
	"fmt"

	"github.com/alailsonko/messenger-clone/server/config"
	"github.com/alailsonko/messenger-clone/server/internal/infra/database"
	"github.com/alailsonko/messenger-clone/server/internal/infra/logger"
	"github.com/alailsonko/messenger-clone/server/tools/migration/runner"
	"github.com/spf13/cobra"
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

	applied, err := runner.RunLatest(l.ctx, l.db.DB)
	if err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	if applied > 0 {
		l.log.Info(fmt.Sprintf("Successfully applied %d migration(s)", applied))
	}

	return nil
}
