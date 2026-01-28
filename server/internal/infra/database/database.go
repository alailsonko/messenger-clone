package database

import (
	"context"
	"fmt"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	internalCtx context.Context
	cancel      context.CancelFunc
	dialect     gorm.Dialector
	logger      logger.Interface
	Host        string
	Port        int
	User        string
	Password    string
	Database    string
	Name        string
	DB          *gorm.DB
}

func NewDatabase(logger logger.Interface, host string, port int, user, password, database, name string) (*Database, error) {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable connect_timeout=5",
		host, port, user, password, database)
	dialect := postgres.Open(dsn)

	// GORM optimizations for high performance
	db, err := gorm.Open(dialect, &gorm.Config{
		Logger: logger,
		// Skip default transaction wrapping for single queries (30% faster)
		SkipDefaultTransaction: true,
		// Prepare statement cache for repeated queries
		PrepareStmt: true,
	})

	ctx := context.Background()

	if err != nil {
		logger.Error(ctx, "Failed to connect to database", err)
		return nil, err
	}

	// Configure connection pool to handle high concurrency
	sqlDB, err := db.DB()
	if err != nil {
		logger.Error(ctx, "Failed to get underlying sql.DB", err)
		return nil, err
	}

	// Connection pool tuning for high concurrency:
	// - MaxOpenConns: PostgreSQL max_connections=500, leave headroom for admin
	// - MaxIdleConns: Keep connections warm, ~50% of max open
	// - ConnMaxLifetime: Recycle connections to prevent stale state
	// - ConnMaxIdleTime: Close truly idle connections to free resources
	sqlDB.SetMaxOpenConns(100)                 // Match ~20% of PostgreSQL max_connections per DB
	sqlDB.SetMaxIdleConns(50)                  // Keep half of max open as idle (warm connections)
	sqlDB.SetConnMaxLifetime(10 * time.Minute) // Recycle connections periodically
	sqlDB.SetConnMaxIdleTime(5 * time.Minute)  // Close idle connections after 5 min

	internalCtx, cancel := context.WithCancel(ctx)

	dbInstance := &Database{
		internalCtx: internalCtx,
		logger:      logger,
		cancel:      cancel,
		dialect:     dialect,
		Host:        host,
		Port:        port,
		User:        user,
		Password:    password,
		Name:        name,
		Database:    database,
		DB:          db,
	}

	go func() {
		for {
			select {
			case <-dbInstance.internalCtx.Done():
				return
			case <-time.After(5 * time.Minute):
				dbInstance.keepAlive()
			}
		}
	}()

	return dbInstance, nil
}

func (d *Database) healthcheck() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		d.logger.Error(d.internalCtx, "Failed to get sqlDB from gorm.DB", err)
		return err
	}

	ctx, cancel := context.WithTimeout(d.internalCtx, 5*time.Second)
	defer cancel()

	return sqlDB.PingContext(ctx)
}

func (d *Database) reconnect() error {
	db, err := gorm.Open(d.dialect, &gorm.Config{
		Logger: d.logger,
	})

	if err != nil {
		d.logger.Error(d.internalCtx, "Failed to reconnect to database", err)
		return err
	}

	// Configure connection pool on reconnect
	sqlDB, err := db.DB()
	if err != nil {
		d.logger.Error(d.internalCtx, "Failed to get underlying sql.DB on reconnect", err)
		return err
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)
	sqlDB.SetConnMaxIdleTime(1 * time.Minute)

	d.DB = db
	d.logger.Info(d.internalCtx, "Database reconnected successfully")
	return nil
}

func (d *Database) keepAlive() {
	if err := d.healthcheck(); err != nil {
		_ = d.reconnect()
	} else {
		d.logger.Info(d.internalCtx, "Database connection is healthy")
	}
}

func (d *Database) Close() error {
	d.cancel()

	sqlDB, err := d.DB.DB()
	if err != nil {
		d.logger.Error(d.internalCtx, "Failed to get sqlDB from gorm.DB", err)
		return err
	}

	errClose := sqlDB.Close()
	if errClose != nil {
		d.logger.Error(d.internalCtx, "Failed to close sqlDB", errClose)
	} else {
		d.logger.Info(d.internalCtx, "Database connection closed successfully")
	}
	return errClose
}
