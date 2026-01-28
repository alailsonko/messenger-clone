package command

import (
	"context"
	"fmt"
)

// Bus dispatches commands to their handlers
type Bus struct {
	handlers map[string]any
}

// NewBus creates a new command bus
func NewBus() *Bus {
	return &Bus{
		handlers: make(map[string]any),
	}
}

// Register registers a handler for a command type
func Register[C Command, R any](bus *Bus, handler CommandHandler[C, R]) {
	var cmd C
	bus.handlers[cmd.CommandName()] = handler
}

// Dispatch dispatches a command to its handler
func Dispatch[C Command, R any](ctx context.Context, bus *Bus, cmd C) (R, error) {
	var zero R
	handler, ok := bus.handlers[cmd.CommandName()]
	if !ok {
		return zero, fmt.Errorf("no handler registered for command: %s", cmd.CommandName())
	}

	h, ok := handler.(CommandHandler[C, R])
	if !ok {
		return zero, fmt.Errorf("handler type mismatch for command: %s", cmd.CommandName())
	}

	return h.Handle(ctx, cmd)
}
