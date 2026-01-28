// Package dto contains domain-level data transfer objects.
//
// These DTOs are used by domain services and can be referenced by both
// the application and presentation layers, following Clean Architecture
// dependency rules (dependencies point inward).
package dto

// PaginationData contains pagination parameters.
type PaginationData struct {
	Limit  int
	Offset int
}

// CreateUserData contains the data required to create a new user.
type CreateUserData struct {
	FirstName string
	LastName  string
}

// UpdateUserData contains the data required to update an existing user.
type UpdateUserData struct {
	FirstName string
	LastName  string
}
