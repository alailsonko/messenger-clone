package migration_repository

import (
	"github.com/alailsonko/messenger-clone/server/tools/migration/models"
	"gorm.io/gorm"
)

type MigrationRepository struct {
	db *gorm.DB
}

func NewMigrationRepository(db *gorm.DB) *MigrationRepository {
	return &MigrationRepository{
		db: db,
	}
}

func (r *MigrationRepository) GetLastAppliedMigration() (*models.MigrationModel, error) {
	var migration models.MigrationModel
	result := r.db.Order("id DESC").First(&migration)
	if result.Error != nil {
		return nil, result.Error
	}
	return &migration, nil
}

func (r *MigrationRepository) DeleteMigrationByName(name string) error {
	result := r.db.Where("name = ?", name).Delete(&models.MigrationModel{})
	return result.Error
}

func (r *MigrationRepository) CreateMigration(migration *models.MigrationModel) error {
	result := r.db.Create(migration)
	return result.Error
}

func (r *MigrationRepository) CreateLock(lock *models.MigrationLockModel) error {
	result := r.db.Create(lock)
	return result.Error
}

func (r *MigrationRepository) UpdateLock(locked bool) error {
	result := r.db.Model(&models.MigrationLockModel{}).Where("id = ?", 1).Update("locked", locked)
	return result.Error
}

func (r *MigrationRepository) IsLocked() (bool, error) {
	var lock models.MigrationLockModel
	result := r.db.First(&lock, 1)
	if result.Error != nil {
		return false, result.Error
	}
	return lock.Locked, nil
}

func (r *MigrationRepository) CreateTablesIfNotExists() error {
	if !r.db.Migrator().HasTable(&models.MigrationModel{}) {
		if err := r.db.Migrator().CreateTable(&models.MigrationModel{}); err != nil {
			return err
		}
	}
	if !r.db.Migrator().HasTable(&models.MigrationLockModel{}) {
		if err := r.db.Migrator().CreateTable(&models.MigrationLockModel{}); err != nil {
			return err
		} else {
			initialLock := &models.MigrationLockModel{
				Locked: false,
			}
			if err := r.CreateLock(initialLock); err != nil {
				return err
			}
		}
	}
	return nil
}
