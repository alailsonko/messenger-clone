package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/alailsonko/messenger-clone/server/config"
	"github.com/alailsonko/messenger-clone/server/internal/infra/database"
	"github.com/alailsonko/messenger-clone/server/internal/infra/logger"
	"github.com/alailsonko/messenger-clone/server/tools/migration/cmd"
	"github.com/spf13/cobra"
)

func main() {
	if err := run(context.Background()); err != nil {
		log.Fatal(fmt.Errorf("migration tool failed: %w", err))
	}
}

func run(ctx context.Context) error {
	var configPath string
	var databaseInstance *database.Database
	var loggerInstance *logger.Logger
	var configInstance *config.Config

	rootCmd := &cobra.Command{
		Use:           "gorm-migration",
		Short:         "Database migration tool",
		SilenceUsage:  true,
		SilenceErrors: true,
		PersistentPostRunE: func(cmd *cobra.Command, args []string) error {
			if databaseInstance != nil {
				if err := databaseInstance.Close(); err != nil {
					return fmt.Errorf("close db: %w", err)
				}
			}
			if loggerInstance != nil {
				loggerInstance.Sync()
			}
			return nil
		},
	}

	cwd, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("get working dir: %w", err)
	}
	defaultConfigPath := filepath.Join(cwd, "migration.yml")
	rootCmd.PersistentFlags().StringVar(&configPath, "config", defaultConfigPath, "path to migration YAML (defaults to $PWD/migration.yml)")
	cfg, err := config.NewConfig(configPath)
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}
	if err := cfg.Validate(); err != nil {
		return fmt.Errorf("invalid config: %w", err)
	}

	envConfig, ok := cfg.Envs[cfg.GoEnv]
	if !ok {
		return fmt.Errorf("environment config not found: %s", cfg.GoEnv)
	}
	if err := envConfig.Validate(); err != nil {
		return fmt.Errorf("invalid env config: %w", err)
	}

	dbPort, err := envConfig.DBPortInt()
	if err != nil {
		return fmt.Errorf("db port: %w", err)
	}

	logr := logger.NewLogger()
	gormLogger := logr.GormLoggerFromZap()
	db, err := database.NewDatabase(gormLogger, envConfig.DbHost, dbPort, envConfig.DbUser, envConfig.DbPassword, envConfig.DbName, cfg.GoEnv)
	if err != nil {
		return fmt.Errorf("connect db: %w", err)
	}

	databaseInstance = db
	loggerInstance = logr
	configInstance = cfg

	rootCmd.AddCommand(
		cmd.LatestCmdFactory(configInstance, loggerInstance, databaseInstance),
		cmd.MakeCmdFactory(configInstance, loggerInstance),
		cmd.UpCmdFactory(configInstance, databaseInstance, loggerInstance),
		cmd.DownCmdFactory(configInstance, databaseInstance, loggerInstance),
	)

	if err := rootCmd.ExecuteContext(ctx); err != nil {
		return err
	}
	log.Println("Command executed successfully")
	return nil
}
