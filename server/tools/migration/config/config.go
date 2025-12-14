package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type Config struct {
	Version   int                  `yaml:"version"`
	Dir       string               `yaml:"dir"`
	Table     string               `yaml:"table"`
	LockTable string               `yaml:"lock_table"`
	Driver    string               `yaml:"driver"`
	Envs      map[string]EnvConfig `yaml:"envs"`
	GoEnv     string               `yaml:"go_env"`
}

type EnvConfig struct {
	DbHost     string `yaml:"db_host"`
	DbPort     string `yaml:"db_port"`
	DbName     string `yaml:"db_name"`
	DbUser     string `yaml:"db_user"`
	DbPassword string `yaml:"db_password"`
}

func (e *EnvConfig) Dsn() string {
	return fmt.Sprintf("host=%s port=%s dbname=%s user=%s password=%s sslmode=disable",
		e.DbHost, e.DbPort, e.DbName, e.DbUser, e.DbPassword)
}

func (e *EnvConfig) DBPortInt() (int, error) {
	var port int
	_, err := fmt.Sscanf(e.DbPort, "%d", &port)
	if err != nil {
		return 0, fmt.Errorf("invalid db_port: %w", err)
	}
	return port, nil
}

func (e *EnvConfig) Validate() error {
	if e.DbHost == "" {
		return errors.New("db_host is required")
	}
	if e.DbPort == "" {
		return errors.New("db_port is required")
	}
	if e.DbName == "" {
		return errors.New("db_name is required")
	}
	if e.DbUser == "" {
		return errors.New("db_user is required")
	}
	return nil
}

// loadConfig reads and parses YAML, expanding ${VAR} from the environment.
func loadConfig(configPath string) (*Config, error) {
	if configPath == "" {
		return nil, errors.New("config path is empty")
	}
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("read config: %w", err)
	}
	var c Config
	if err := yaml.Unmarshal(data, &c); err != nil {
		return nil, fmt.Errorf("parse yaml: %w", err)
	}

	// Expand env vars in top-level fields
	c.Dir = os.ExpandEnv(c.Dir)
	c.Table = os.ExpandEnv(c.Table)
	c.LockTable = os.ExpandEnv(c.LockTable)
	c.Driver = os.ExpandEnv(c.Driver)
	c.GoEnv = os.ExpandEnv(c.GoEnv)

	// Expand env vars in env-specific config
	if c.Envs == nil {
		c.Envs = map[string]EnvConfig{}
	}
	for name, env := range c.Envs {
		env.DbHost = os.ExpandEnv(env.DbHost)
		env.DbPort = os.ExpandEnv(env.DbPort)
		env.DbName = os.ExpandEnv(env.DbName)
		env.DbUser = os.ExpandEnv(env.DbUser)
		env.DbPassword = os.ExpandEnv(env.DbPassword)
		c.Envs[name] = env
	}

	return &c, nil
}

func NewConfig(configPath string) (*Config, error) {
	if configPath != "" {
		configDir := filepath.Dir(configPath)
		envPath := filepath.Join(configDir, ".env")
		_ = godotenv.Load(envPath)
	}

	return loadConfig(configPath)
}

// DSNFor returns the DSN for a given environment (e.g., "development").
func (c *Config) DSNFor(env string) (string, error) {
	if env == "" {
		return "", errors.New("env is empty")
	}
	envConfig := c.Envs[env]
	dsn := envConfig.Dsn()
	if dsn == "" {
		return "", fmt.Errorf("dsn is empty for env %q", env)
	}
	return dsn, nil
}

func (c *Config) Validate() error {
	if c.Dir == "" {
		return errors.New("dir is required")
	}
	if c.Table == "" {
		return errors.New("table is required")
	}
	if c.LockTable == "" {
		return errors.New("lock_table is required")
	}
	if c.Driver == "" {
		return errors.New("driver is required")
	}
	if len(c.Envs) == 0 {
		return errors.New("at least one env config is required")
	}
	if c.GoEnv == "" {
		return errors.New("go_env is required")
	}
	return nil
}
