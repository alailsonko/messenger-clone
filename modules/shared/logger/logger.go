package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"go.uber.org/zap/zaptest/observer"
)

// Logger is a structured logger that wraps zap.Logger and provides
// additional functionality for error output and log observation.
//
// Fields:
//   - core:        The underlying zapcore.Core used for logging.
//   - errorOutput: The WriteSyncer for error output.
//   - logger:      The zap.Logger instance for logging.
//   - observer:    ObservedLogs for capturing logs in tests or for inspection.
type Logger struct {
	core        zapcore.Core
	errorOutput zapcore.WriteSyncer
	logger      *zap.Logger
	observer    *observer.ObservedLogs
}

// NewLogger creates and returns a new Logger instance.
// It sets up a zap logger with JSON encoding, writes logs to stdout,
// error logs to stderr, and attaches an observer for capturing logs
// (useful for testing and inspection).
func NewLogger() *Logger {

	encoderCfg := zap.NewProductionEncoderConfig()

	encoderCfg.EncodeTime = zapcore.ISO8601TimeEncoder

	l := &Logger{
		core:        zapcore.NewCore(zapcore.NewJSONEncoder(encoderCfg), zapcore.Lock(os.Stdout), zap.DebugLevel),
		errorOutput: zapcore.Lock(os.Stderr),
	}

	l.logger = zap.New(l.core, zap.ErrorOutput(l.errorOutput))

	core, logs := observer.New(zap.DebugLevel)
	l.core = core
	l.observer = logs

	return l
}

func (l *Logger) Sync() error {
	return l.logger.Sync()
}

func (l *Logger) With(fields ...zapcore.Field) *Logger {
	return &Logger{
		core:        l.core.With(fields),
		errorOutput: l.errorOutput,
		logger:      l.logger.With(fields...),
		observer:    l.observer,
	}
}

func (l *Logger) Info(msg string, fields ...zapcore.Field) {
	l.logger.Info(msg, fields...)
}

func (l *Logger) Error(msg string, fields ...zapcore.Field) {
	l.logger.Error(msg, fields...)
}

func (l *Logger) Debug(msg string, fields ...zapcore.Field) {
	l.logger.Debug(msg, fields...)
}

func (l *Logger) Warn(msg string, fields ...zapcore.Field) {
	l.logger.Warn(msg, fields...)
}

func (l *Logger) Fatal(msg string, fields ...zapcore.Field) {
	l.logger.Fatal(msg, fields...)
}

func (l *Logger) DPanic(msg string, fields ...zapcore.Field) {
	l.logger.DPanic(msg, fields...)
}
