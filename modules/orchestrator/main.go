package main

import (
	"github.com/alailsonko/messenger-clone/modules/orchestrator/app"
	"github.com/alailsonko/messenger-clone/modules/orchestrator/routes"
)

func main() {
	app := app.NewApp()

	defer app.Stop()
	defer app.Sync()

	routes.SetupRoutes()

	app.Start()
}
