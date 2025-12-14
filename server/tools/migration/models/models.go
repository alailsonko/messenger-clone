package models

type MigrationModel struct {
	ID        uint64 `gorm:"primaryKey;autoIncrement"`
	Name      string `gorm:"type:varchar(255);not null;uniqueIndex"`
	UpdatedAt string `gorm:"type:timestamptz;not null;default:now()"`
	CreatedAt string `gorm:"type:timestamptz;not null;default:now()"`
}

func (MigrationModel) TableName() string {
	return "migration"
}

type MigrationLockModel struct {
	ID        uint64 `gorm:"primaryKey;autoIncrement"`
	Locked    bool   `gorm:"type:boolean;not null;default:false"`
	UpdatedAt string `gorm:"type:timestamptz;not null;default:now()"`
	CreatedAt string `gorm:"type:timestamptz;not null;default:now()"`
}

func (MigrationLockModel) TableName() string {
	return "migration_lock"
}
