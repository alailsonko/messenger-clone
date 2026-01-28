package database

import (
	"fmt"
	"log"
	"time"

	"github.com/alailsonko/messenger-clone/server/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// ConnectionManager manages read and write database connections
type ConnectionManager struct {
	writeDB *gorm.DB
	readDB  *gorm.DB
}

// NewConnectionManager creates a new connection manager with separate read/write connections
func NewConnectionManager(writeConfig, readConfig config.DBConfig, log logger.Interface) (*ConnectionManager, error) {
	// Write connection (primary) with retry
	writeDB, err := connectWithRetry(writeConfig, log, "write", 10, 3*time.Second)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to write database: %w", err)
	}

	// Read connection (replica) with retry - give more time as replica needs to sync
	readDB, err := connectWithRetry(readConfig, log, "read", 30, 5*time.Second)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to read database: %w", err)
	}

	return &ConnectionManager{
		writeDB: writeDB,
		readDB:  readDB,
	}, nil
}

// connectWithRetry attempts to connect to the database with retries
func connectWithRetry(dbConfig config.DBConfig, gormLogger logger.Interface, dbName string, maxRetries int, retryInterval time.Duration) (*gorm.DB, error) {
	// DSN with connect_timeout for faster failure detection
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable connect_timeout=5",
		dbConfig.Host, dbConfig.Port, dbConfig.User, dbConfig.Password, dbConfig.Database)

	var db *gorm.DB
	var err error

	for i := 0; i < maxRetries; i++ {
		// GORM optimizations for high performance
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: gormLogger,
			// Skip default transaction wrapping for single queries (~30% faster)
			SkipDefaultTransaction: true,
			// Prepare statement cache for repeated queries
			PrepareStmt: true,
		})
		if err == nil {
			// Configure connection pool
			sqlDB, sqlErr := db.DB()
			if sqlErr == nil {
				// Connection pool tuning based on config
				maxOpen := dbConfig.MaxOpenConns
				if maxOpen <= 0 {
					maxOpen = 100
				}
				maxIdle := dbConfig.MaxIdleConns
				if maxIdle <= 0 {
					maxIdle = 50
				}
				maxLifetime := dbConfig.ConnMaxLifetime
				if maxLifetime <= 0 {
					maxLifetime = 10
				}

				sqlDB.SetMaxOpenConns(maxOpen)
				sqlDB.SetMaxIdleConns(maxIdle)
				sqlDB.SetConnMaxLifetime(time.Duration(maxLifetime) * time.Minute)
				sqlDB.SetConnMaxIdleTime(5 * time.Minute)

				if pingErr := sqlDB.Ping(); pingErr == nil {
					log.Printf("Successfully connected to %s database (pool: maxOpen=%d, maxIdle=%d)", dbName, maxOpen, maxIdle)
					return db, nil
				}
			}
		}

		log.Printf("Attempt %d/%d: Failed to connect to %s database, retrying in %v...", i+1, maxRetries, dbName, retryInterval)
		time.Sleep(retryInterval)
	}

	return nil, fmt.Errorf("failed to connect after %d attempts: %w", maxRetries, err)
}

// WriteDB returns the write (primary) database connection
func (cm *ConnectionManager) WriteDB() *gorm.DB {
	return cm.writeDB
}

// ReadDB returns the read (replica) database connection
func (cm *ConnectionManager) ReadDB() *gorm.DB {
	return cm.readDB
}

// Ping verifies both database connections are alive
func (cm *ConnectionManager) Ping() error {
	writeSQL, err := cm.writeDB.DB()
	if err != nil {
		return fmt.Errorf("failed to get write DB: %w", err)
	}
	if err := writeSQL.Ping(); err != nil {
		return fmt.Errorf("write DB ping failed: %w", err)
	}

	readSQL, err := cm.readDB.DB()
	if err != nil {
		return fmt.Errorf("failed to get read DB: %w", err)
	}
	if err := readSQL.Ping(); err != nil {
		return fmt.Errorf("read DB ping failed: %w", err)
	}

	return nil
}

// Close closes both database connections
func (cm *ConnectionManager) Close() error {
	writeSQL, err := cm.writeDB.DB()
	if err != nil {
		return err
	}
	if err := writeSQL.Close(); err != nil {
		return err
	}

	readSQL, err := cm.readDB.DB()
	if err != nil {
		return err
	}
	return readSQL.Close()
}
