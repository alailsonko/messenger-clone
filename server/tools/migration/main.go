package main

import (
	"flag"
	"log"
	"os"
	"path/filepath"

	"github.com/alailsonko/messenger-clone/server/tools/migration/cmd"
)

const (
	GenerateCmd = "generate"
	UpCmd       = "up"
	DownCmd     = "down"
)

func main() {
	cmdFlag := flag.String("cmd", "", "command to run (e.g., up, down, generate)")
	configPath := flag.String("config", "", "path to migration YAML (defaults to $PWD/migration.yml)")
	migrationName := flag.String("name", "", "migration name (e.g., add_public_id)")
	flag.Parse()

	if *cmdFlag == GenerateCmd && *migrationName == "" {
		log.Fatal("missing -name")
	}

	if *cmdFlag == "" {
		log.Fatal("missing -cmd")
	}

	wd, err := os.Getwd()
	if err != nil {
		log.Fatalf("failed to get working dir: %v", err)
	}

	if *configPath == "" {
		*configPath = filepath.Join(wd, "migration.yml")
	} else if !filepath.IsAbs(*configPath) {
		*configPath = filepath.Join(wd, *configPath)
	}

	switch *cmdFlag {
	case GenerateCmd:
		cmd.Generate(
			*configPath,
			*migrationName,
		)
	case UpCmd:
		cmd.Up(
			*configPath,
		)
	case DownCmd:
		cmd.Down(
			*configPath,
		)
	default:
		log.Fatalf("unknown command: %q", *cmdFlag)
	}
}
