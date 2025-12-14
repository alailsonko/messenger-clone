package registry

import (
	"fmt"
	"maps"
	"sync"

	"gorm.io/gorm"
)

type Migration struct {
	Name string
	Up   func(*gorm.DB) error
	Down func(*gorm.DB) error
}

var (
	migrations = make(map[string]*Migration)
	mu         sync.RWMutex
)

// Register adds a migration to the registry
func Register(name string, up func(*gorm.DB) error, down func(*gorm.DB) error) {
	mu.Lock()
	defer mu.Unlock()
	migrations[name] = &Migration{
		Name: name,
		Up:   up,
		Down: down,
	}
}

// Get retrieves a migration by name
func Get(name string) (*Migration, error) {
	mu.RLock()
	defer mu.RUnlock()
	m, ok := migrations[name]
	if !ok {
		return nil, fmt.Errorf("migration %q not found in registry", name)
	}
	return m, nil
}

// All returns all registered migrations
func All() map[string]*Migration {
	mu.RLock()
	defer mu.RUnlock()
	result := make(map[string]*Migration, len(migrations))
	maps.Copy(result, migrations)
	return result
}
