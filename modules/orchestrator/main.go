package main

import (
	"orchestrator/app"
	"orchestrator/routes"
)

func main() {
	app := app.NewApp()

	defer app.Stop()
	defer app.Sync()

	routes.SetupRoutes(app)

	app.Start()
}
