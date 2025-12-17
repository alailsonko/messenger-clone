package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/alailsonko/messenger-clone/server/internal/infra/database"
	"github.com/alailsonko/messenger-clone/server/internal/infra/logger"
	"github.com/alailsonko/messenger-clone/server/tools/migration/cmd"
	"github.com/alailsonko/messenger-clone/server/tools/migration/config"
	"github.com/spf13/cobra"
)

func main() {
	var rootCmd = &cobra.Command{
		Use:   "gorm-migration",
		Short: "Database migration tool",
	}
	var (
		configPath string
	)
	defaultConfigPath, err := os.Getwd()
	if err != nil {
		log.Fatalf("failed to get working dir: %v", err)
	}
	defaultConfigPath = filepath.Join(defaultConfigPath, "migration.yml")
	rootCmd.PersistentFlags().StringVar(&configPath, "config", defaultConfigPath, "path to migration YAML (defaults to $PWD/migration.yml)")
	rootCmd.MarkPersistentFlagRequired("config")

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

	defer loggerInstance.Sync()

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
	defer databaseInstance.Close()

	rootCmd.AddCommand(cmd.MakeCmd, cmd.UpCmd, cmd.DownCmdFactory(configInstance, databaseInstance, loggerInstance))
	if err := rootCmd.Execute(); err != nil {
		log.Fatalf("command execution failed: %v", err)
	} else {
		loggerInstance.Info("command executed successfully")
	}
}
