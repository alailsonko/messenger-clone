package app

import (
	"github.com/alailsonko/messenger-clone/modules/shared/logger"
	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
)

type App struct {
	Logger *logger.Logger
	Api    *fiber.App
}

var Instance *App

func NewApp() *App {
	Instance = &App{
		Logger: logger.NewLogger(),
		Api:    fiber.New(),
	}

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
