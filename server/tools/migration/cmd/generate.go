package cmd

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/alailsonko/messenger-clone/server/tools/migration/config"
	"github.com/alailsonko/messenger-clone/server/tools/migration/template"
)

func Generate(
	configPath string,
	migrationName string,
) {
	cfg, err := config.NewConfig(configPath)
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	migrationDir := cfg.Dir

	// Ensure dir exists
	if err := os.MkdirAll(migrationDir, 0o755); err != nil {
		log.Fatalf("Create migrations dir: %v", err)
	}

	// Build ID and filename
	ts := time.Now().UTC().Format("20060102150405")
	safe := sanitizeName(migrationName)
	id := fmt.Sprintf("%s_%s", ts, safe)
	filename := id + ".go"
	path := filepath.Join(migrationDir, filename)

	// Derive package name from folder name
	pkg := filepath.Base(migrationDir)
	if !isValidPackageName(pkg) {
		pkg = "migrations"
	}

	// Template content
	content := template.MigrationTemplate(ts, safe)

	// Write file
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		log.Fatalf("Write migration file: %v", err)
	}

	log.Printf("Created migration: %s", path)
}

func sanitizeName(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = strings.ReplaceAll(s, " ", "_")
	// keep only [a-z0-9_]
	re := regexp.MustCompile(`[^a-z0-9_]+`)
	return re.ReplaceAllString(s, "")
}

func isValidPackageName(s string) bool {
	re := regexp.MustCompile(`^[a-zA-Z_][a-zA-Z0-9_]*$`)
	return re.MatchString(s)
}
