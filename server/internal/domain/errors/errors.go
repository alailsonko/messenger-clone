package errors

import "errors"

var (
	ErrUserNotFound    = errors.New("user not found")
	ErrInvalidUserData = errors.New("invalid user data")
	ErrUserExists      = errors.New("user already exists")
)
