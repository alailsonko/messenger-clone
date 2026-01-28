package query

import "context"

// Query is a marker interface for all queries
type Query interface {
	QueryName() string
}

// QueryHandler handles a specific query type
type QueryHandler[Q Query, R any] interface {
	Handle(ctx context.Context, q Q) (R, error)
}
