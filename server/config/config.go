package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

// DBConfig holds database connection configuration
type DBConfig struct {
	Host            string `yaml:"host"`
	Port            int    `yaml:"port"`
	User            string `yaml:"user"`
	Password        string `yaml:"password"`
	Database        string `yaml:"database"`
	MaxOpenConns    int    `yaml:"max_open_conns"`
	MaxIdleConns    int    `yaml:"max_idle_conns"`
	ConnMaxLifetime int    `yaml:"conn_max_lifetime_minutes"`
}

// DSN returns the PostgreSQL connection string
func (d *DBConfig) DSN() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		d.Host, d.Port, d.User, d.Password, d.Database)
}

// ServerConfig holds HTTP server configuration
type ServerConfig struct {
	Port string `yaml:"port"`
}

// ShardConfig holds configuration for database sharding
type ShardConfig struct {
	ShardCount      int    `yaml:"shard_count"`       // Number of shards (default: 4)
	VirtualNodes    int    `yaml:"virtual_nodes"`     // Virtual nodes per shard for consistent hashing
	BaseHost        string `yaml:"base_host"`         // Base hostname pattern for writes (e.g., "pgbouncer" or "shard")
	ReplicaHost     string `yaml:"replica_host"`      // Base hostname for replicas (e.g., "shard", defaults to BaseHost)
	BasePort        int    `yaml:"base_port"`         // Starting port for primaries (shard-0: port, shard-1: port+1, etc.)
	ReplicaBasePort int    `yaml:"replica_base_port"` // Starting port for replicas (default: BasePort+10)
	PerShardHosts   bool   `yaml:"per_shard_hosts"`   // If true, use {BaseHost}-{i} for each shard host (Docker mode)
}

// Config holds all application configuration
type Config struct {
	// Server configuration
	Server ServerConfig `yaml:"server"`

	// Database configuration (CQRS: separate read/write)
	WriteDB DBConfig `yaml:"write_db"`
	ReadDB  DBConfig `yaml:"read_db"`

	// Sharding configuration
	Sharding ShardConfig `yaml:"sharding"`

	// Migration configuration (legacy support)
	Version            int                  `yaml:"version"`
	Dir                string               `yaml:"dir"`
	MigrationTable     string               `yaml:"migration_table"`
	MigrationLockTable string               `yaml:"migration_lock_table"`
	Driver             string               `yaml:"driver"`
	Envs               map[string]EnvConfig `yaml:"envs"`
	GoEnv              string               `yaml:"go_env"`
}

// EnvConfig holds environment-specific database configuration (for migrations)
type EnvConfig struct {
	DbHost     string `yaml:"db_host"`
	DbPort     string `yaml:"db_port"`
	DbName     string `yaml:"db_name"`
	DbUser     string `yaml:"db_user"`
	DbPassword string `yaml:"db_password"`
}

// Load loads configuration from environment variables
func Load() *Config {
	return &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
		},
		WriteDB: DBConfig{
			Host:            getEnv("DB_WRITE_HOST", "localhost"),
			Port:            getEnvInt("DB_WRITE_PORT", 5432),
			User:            getEnv("DB_WRITE_USER", "postgres"),
			Password:        getEnv("DB_WRITE_PASSWORD", "postgres"),
			Database:        getEnv("DB_WRITE_NAME", "postgres"),
			MaxOpenConns:    getEnvInt("DB_WRITE_MAX_OPEN_CONNS", 100),
			MaxIdleConns:    getEnvInt("DB_WRITE_MAX_IDLE_CONNS", 50),
			ConnMaxLifetime: getEnvInt("DB_WRITE_CONN_MAX_LIFETIME", 10),
		},
		ReadDB: DBConfig{
			Host:            getEnv("DB_READ_HOST", "localhost"),
			Port:            getEnvInt("DB_READ_PORT", 5433),
			User:            getEnv("DB_READ_USER", "postgres"),
			Password:        getEnv("DB_READ_PASSWORD", "postgres"),
			Database:        getEnv("DB_READ_NAME", "postgres"),
			MaxOpenConns:    getEnvInt("DB_READ_MAX_OPEN_CONNS", 100),
			MaxIdleConns:    getEnvInt("DB_READ_MAX_IDLE_CONNS", 50),
			ConnMaxLifetime: getEnvInt("DB_READ_CONN_MAX_LIFETIME", 10),
		},
		Sharding: ShardConfig{
			ShardCount:      getEnvInt("SHARDING_COUNT", 4),
			VirtualNodes:    getEnvInt("SHARDING_VIRTUAL_NODES", 150),
			BaseHost:        getEnv("SHARDING_BASE_HOST", "localhost"),
			ReplicaHost:     getEnv("SHARDING_REPLICA_HOST", ""), // Empty = use BaseHost
			BasePort:        getEnvInt("SHARDING_BASE_PORT", 5440),
			ReplicaBasePort: getEnvInt("SHARDING_REPLICA_BASE_PORT", 5450),
			PerShardHosts:   getEnvBool("SHARDING_PER_SHARD_HOSTS", false),
		},
	}
}

// getEnv retrieves an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvInt retrieves an environment variable as int or returns a default value
func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

// getEnvBool retrieves an environment variable as bool or returns a default value
func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
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

	c.Dir = os.ExpandEnv(c.Dir)
	c.MigrationTable = os.ExpandEnv(c.MigrationTable)
	c.MigrationLockTable = os.ExpandEnv(c.MigrationLockTable)
	c.Driver = os.ExpandEnv(c.Driver)
	c.GoEnv = os.ExpandEnv(c.GoEnv)

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
	if c.MigrationTable == "" {
		return errors.New("migration_table is required")
	}
	if c.MigrationLockTable == "" {
		return errors.New("migration_lock_table is required")
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
