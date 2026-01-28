package entity

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        string
	FirstName string
	LastName  string
	CreatedAt time.Time
	UpdatedAt time.Time
}

// NewUser creates a new User entity with a generated UUID and timestamps.
func NewUser(firstName, lastName string) *User {
	now := time.Now()
	return &User{
		ID:        uuid.New().String(),
		FirstName: firstName,
		LastName:  lastName,
		CreatedAt: now,
		UpdatedAt: now,
	}
}
