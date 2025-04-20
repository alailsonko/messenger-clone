package app

import (
	"context"
	"orchestrator/logger"

	"github.com/gofiber/fiber/v3"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"
	"go.uber.org/zap"
)

type App struct {
	Logger *logger.Logger
	Api    *fiber.App
}

var Instance *App

var tracer = otel.Tracer("fiber-v3-app")

func InitTracer() func() {
	ctx := context.Background()
	exporter, err := otlptracegrpc.New(ctx,
		otlptracegrpc.WithInsecure(),              // For local dev, remove for prod
		otlptracegrpc.WithEndpoint("jaeger:4317"), // Default OTLP gRPC port
	)
	if err != nil {
		panic(err)
	}
	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName("orchestrator"),
		)),
	)
	otel.SetTracerProvider(tp)
	return func() { _ = tp.Shutdown(ctx) }
}

func otelMiddleware(c fiber.Ctx) error {
	ctx := c.Context()

	// Extract context from headers
	carrier := propagation.HeaderCarrier(c.GetReqHeaders())
	ctx = otel.GetTextMapPropagator().Extract(ctx, carrier)

	// Start span
	ctx, span := tracer.Start(ctx, c.Route().Path)
	defer span.End()

	// Add attributes
	span.SetAttributes(
		attribute.String("http.method", c.Method()),
		attribute.String("http.route", c.Path()),
		attribute.String("http.user_agent", c.Get("User-Agent")),
		attribute.String("http.client_ip", c.IP()),
		attribute.String("http.request_id", c.Get("X-Request-Id")),
		attribute.Int("http.status_code", c.Response().StatusCode()),
	)

	// Store context in Fiber locals
	c.Locals("otelCtx", ctx)

	// Continue processing
	return c.Next()
}

func NewApp() *App {
	InitTracer()
	Instance = &App{
		Logger: logger.NewLogger(),
		Api:    fiber.New(),
	}

	Instance.Api.Use(otelMiddleware)

	return Instance
}

func (app *App) Start() {
	if err := app.Api.Listen(":8080", fiber.ListenConfig{EnablePrefork: true, EnablePrintRoutes: true}); err != nil {
		app.Logger.Error("Failed to start server", zap.String("error", err.Error()))
	}
}

func (app *App) Stop() {
	if err := app.Api.Shutdown(); err != nil {
		app.Logger.Error("Failed to stop server", zap.String("error", err.Error()))
	}
}

func (app *App) Sync() error {
	return app.Logger.Sync()
}
