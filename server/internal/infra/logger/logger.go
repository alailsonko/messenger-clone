package logger

import (
	"context"
	"errors"
	"log"
	"syscall"
	"time"

	"go.uber.org/zap"
	"gorm.io/gorm/logger"
)

type gormLogger struct {
	zap                       *zap.Logger
	level                     logger.LogLevel
	slowThreshold             time.Duration
	ignoreRecordNotFoundError bool
}

func (g gormLogger) LogMode(level logger.LogLevel) logger.Interface {
	g.level = level
	return g
}

func (g gormLogger) Info(ctx context.Context, msg string, data ...any) {
	if g.level < logger.Info {
		return
	}
	g.zap.Sugar().Infow(msg, "data", data)
}

func (g gormLogger) Warn(ctx context.Context, msg string, data ...any) {
	if g.level < logger.Warn {
		return
	}
	g.zap.Sugar().Warnw(msg, "data", data)
}

func (g gormLogger) Error(ctx context.Context, msg string, data ...any) {
	if g.level < logger.Error {
		return
	}
	g.zap.Sugar().Errorw(msg, "data", data)
}

func (g gormLogger) Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error) {
	if g.level <= logger.Silent {
		return
	}
	sql, rows := fc()
	elapsed := time.Since(begin)

	switch {
	case err != nil && (!g.ignoreRecordNotFoundError || !errors.Is(err, logger.ErrRecordNotFound)):
		g.zap.Sugar().Errorw("gorm trace",
			"err", err,
			"elapsed", elapsed,
			"rows", rows,
			"sql", sql,
		)
	case g.slowThreshold > 0 && elapsed > g.slowThreshold:
		g.zap.Sugar().Warnw("gorm slow query",
			"elapsed", elapsed,
			"rows", rows,
			"sql", sql,
		)
	default:
		if g.level >= logger.Info {
			g.zap.Sugar().Infow("gorm trace",
				"elapsed", elapsed,
				"rows", rows,
				"sql", sql,
			)
		}
	}
}

type Logger struct {
	zap *zap.Logger
}

func NewLogger() *Logger {
	z, err := zap.NewDevelopment()
	if err != nil {
		log.Fatal("Failed to initialize zap logger:", err)
	}
	return &Logger{zap: z}
}

func (l *Logger) GormLoggerFromZap() gormLogger {
	return gormLogger{
		zap:                       l.zap,
		level:                     logger.Info,
		slowThreshold:             200 * time.Millisecond,
		ignoreRecordNotFoundError: true,
	}
}

func (l *Logger) Sync() {
	if err := l.zap.Sync(); err != nil && !errors.Is(err, syscall.ENOTTY) && !errors.Is(err, syscall.EINVAL) {
		log.Println("Failed to sync zap logger:", err)
	} else {
		log.Println("Zap logger synced successfully")
	}
}

func (l *Logger) Info(msg string, fields ...zap.Field) {
	l.zap.Info(msg, fields...)
}

func (l *Logger) Error(msg string, fields ...zap.Field) {
	l.zap.Error(msg, fields...)
}

func (l *Logger) Warn(msg string, fields ...zap.Field) {
	l.zap.Warn(msg, fields...)
}

func (l *Logger) Debug(msg string, fields ...zap.Field) {
	l.zap.Debug(msg, fields...)
}
