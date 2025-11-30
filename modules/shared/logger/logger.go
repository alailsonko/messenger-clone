package logger

import (
	"context"

	"go.uber.org/zap"
	"gorm.io/gorm/logger"
)

type gormLogger struct {
	logger.Interface
	zap *zap.Logger
}

func (g gormLogger) Info(ctx context.Context, msg string, data ...any) {
	g.zap.Sugar().Infof(msg, data...)
}

func (g gormLogger) Warn(ctx context.Context, msg string, data ...any) {
	g.zap.Sugar().Warnf(msg, data...)
}

func (g gormLogger) Error(ctx context.Context, msg string, data ...any) {
	g.zap.Sugar().Errorf(msg, data...)
}

func (g gormLogger) Trace(ctx context.Context, begin int64, fc func() (string, int64), err error) {
	sql, rows := fc()
	if err != nil {
		g.zap.Sugar().Errorf("Error: %v | Rows: %d | SQL: %s", err, rows, sql)
	} else {
		g.zap.Sugar().Infof("Rows: %d | SQL: %s", rows, sql)
	}
}

type Logger struct {
	zap *zap.Logger
}

func NewLogger() *Logger {
	logger, _ := zap.NewDevelopment()
	return &Logger{zap: logger}
}

func (l *Logger) GormLoggerFromZap() gormLogger {
	return gormLogger{zap: l.zap}
}
