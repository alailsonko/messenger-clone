package query

import (
	"context"
	"fmt"
)

// Bus dispatches queries to their handlers
type Bus struct {
	handlers map[string]any
}

// NewBus creates a new query bus
func NewBus() *Bus {
	return &Bus{
		handlers: make(map[string]any),
	}
}

// Register registers a handler for a query type
func Register[Q Query, R any](bus *Bus, handler QueryHandler[Q, R]) {
	var q Q
	bus.handlers[q.QueryName()] = handler
}

// Dispatch dispatches a query to its handler
func Dispatch[Q Query, R any](ctx context.Context, bus *Bus, q Q) (R, error) {
	var zero R
	handler, ok := bus.handlers[q.QueryName()]
	if !ok {
		return zero, fmt.Errorf("no handler registered for query: %s", q.QueryName())
	}

	h, ok := handler.(QueryHandler[Q, R])
	if !ok {
		return zero, fmt.Errorf("handler type mismatch for query: %s", q.QueryName())
	}

	return h.Handle(ctx, q)
}
