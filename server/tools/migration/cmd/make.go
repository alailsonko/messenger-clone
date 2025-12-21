package cmd

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/alailsonko/messenger-clone/server/internal/infra/logger"
	"github.com/alailsonko/messenger-clone/server/tools/migration/config"
	"github.com/alailsonko/messenger-clone/server/tools/migration/template"
	"github.com/spf13/cobra"
)

const (
	MakeCmdFlag = "make"
)

func MakeCmdFactory(cfg *config.Config, log *logger.Logger) *cobra.Command {
	var migrationName string

	cmd := &cobra.Command{
		Use:   MakeCmdFlag,
		Short: "Create a new migration file",
		RunE: RunExecutable(func(cmd *cobra.Command) (Executable, error) {
			makeCommand := &MakeCommand{
				cfg:  cfg,
				log:  log,
				ctx:  cmd.Context(),
				name: migrationName,
			}
			return makeCommand, nil
		}),
	}

	cmd.Flags().StringVarP(&migrationName, "name", "n", "", "name of the migration (required)")
	_ = cmd.MarkFlagRequired("name")
	return cmd
}

type MakeCommand struct {
	cfg  *config.Config
	log  *logger.Logger
	ctx  context.Context
	name string
}

func (m *MakeCommand) Execute() error {
	if m.cfg == nil {
		return errors.New("config is required")
	}
	if m.log == nil {
		return errors.New("logger is required")
	}
	if m.cfg.Dir == "" {
		return errors.New("migration dir is not configured")
	}

	safe := m.sanitizeName(m.name)
	if safe == "" {
		return errors.New("migration name cannot be empty")
	}

	if err := os.MkdirAll(m.cfg.Dir, 0o755); err != nil {
		return fmt.Errorf("create migrations dir: %w", err)
	}

	ts := time.Now().UTC().Format("20060102150405")
	filename := fmt.Sprintf("%s_%s.go", ts, safe)
	path := filepath.Join(m.cfg.Dir, filename)

	content := template.MigrationTemplate(ts, safe)
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		return fmt.Errorf("write migration file: %w", err)
	}

	m.log.Info(fmt.Sprintf("Created migration: %s", path))
	return nil
}

func (m *MakeCommand) sanitizeName(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = strings.ReplaceAll(s, " ", "_")
	// keep only [a-z0-9_]
	re := regexp.MustCompile(`[^a-z0-9_]+`)
	return re.ReplaceAllString(s, "")
}
