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

func NewDatabase(logger logger.Interface, host string, port int, user, password, database, name string) *Database {
	dialect := postgres.Open(fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, database))
	db, err := gorm.Open(dialect, &gorm.Config{
		Logger: logger,
	})

	ctx := context.Background()

	if err != nil {
		logger.Error(ctx, "Failed to connect to database", err)
		panic("failed to connect database")
	}

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

	return dbInstance
}

func (d *Database) healthcheck() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		d.logger.Error(d.internalCtx, "Failed to get sqlDB from gorm.DB", err)
		return err
	}

	return sqlDB.PingContext(d.internalCtx)
}

func (d *Database) reconnect() error {
	db, err := gorm.Open(d.dialect, &gorm.Config{})

	if err != nil {
		d.logger.Error(d.internalCtx, "Failed to reconnect to database", err)
		return err
	}

	d.DB = db
	return nil
}

func (d *Database) keepAlive() {
	if err := d.healthcheck(); err != nil {
		_ = d.reconnect()
	}
}

func (d *Database) Close() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		d.logger.Error(d.internalCtx, "Failed to get sqlDB from gorm.DB", err)
		return err
	}

	d.cancel()
	errClose := sqlDB.Close()
	if errClose != nil {
		d.logger.Error(d.internalCtx, "Failed to close sqlDB", errClose)
	}
	return errClose
}
