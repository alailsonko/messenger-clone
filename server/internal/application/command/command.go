package command

import "context"

// Command is a marker interface for all commands
type Command interface {
	CommandName() string
}

// CommandHandler handles a specific command type
type CommandHandler[C Command, R any] interface {
	Handle(ctx context.Context, cmd C) (R, error)
}
