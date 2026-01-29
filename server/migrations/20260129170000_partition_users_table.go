package migrations

import (
	"github.com/alailsonko/messenger-clone/server/tools/migration/registry"
	"gorm.io/gorm"
)

func init() {
	registry.Register("20260129170000_partition_users_table.go", Up_20260129170000, Down_20260129170000)
}

// Up_20260129170000 converts the users table to a hash-partitioned table with 16 partitions.
//
// PARTITIONING STRATEGY:
// - Hash partitioning by `id` (UUID) column
// - 16 partitions for good balance between parallelism and overhead
// - At 7M+ users, each partition holds ~437K rows
// - At 100M users, each partition would hold ~6.25M rows
//
// MIGRATION STEPS:
// 1. Create new partitioned table structure
// 2. Create 16 hash partitions (users_p00 to users_p15)
// 3. Create indexes on partitioned table (auto-propagates to all partitions)
// 4. Copy data from old table (PostgreSQL auto-routes to correct partitions)
// 5. Drop foreign key temporarily
// 6. Swap tables atomically (rename)
// 7. Restore foreign key
// 8. Drop old table
// 9. Update statistics
func Up_20260129170000(db *gorm.DB) error {
	// Execute each step separately for better error handling
	steps := []string{
		// STEP 1: Create the new partitioned table structure
		`CREATE TABLE users_partitioned (
			id UUID NOT NULL DEFAULT uuidv7(),
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ,
			first_name VARCHAR(100) NOT NULL,
			last_name VARCHAR(100) NOT NULL,
			PRIMARY KEY (id)
		) PARTITION BY HASH (id)`,

		// STEP 2: Create 16 hash partitions
		// MODULUS 16 = 16 buckets, REMAINDER 0-15 assigns each partition a bucket
		`CREATE TABLE users_p00 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 0)`,
		`CREATE TABLE users_p01 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 1)`,
		`CREATE TABLE users_p02 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 2)`,
		`CREATE TABLE users_p03 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 3)`,
		`CREATE TABLE users_p04 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 4)`,
		`CREATE TABLE users_p05 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 5)`,
		`CREATE TABLE users_p06 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 6)`,
		`CREATE TABLE users_p07 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 7)`,
		`CREATE TABLE users_p08 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 8)`,
		`CREATE TABLE users_p09 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 9)`,
		`CREATE TABLE users_p10 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 10)`,
		`CREATE TABLE users_p11 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 11)`,
		`CREATE TABLE users_p12 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 12)`,
		`CREATE TABLE users_p13 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 13)`,
		`CREATE TABLE users_p14 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 14)`,
		`CREATE TABLE users_p15 PARTITION OF users_partitioned FOR VALUES WITH (MODULUS 16, REMAINDER 15)`,

		// STEP 3: Create indexes on partitioned table (auto-propagates to all partitions)
		`CREATE INDEX idx_users_part_name ON users_partitioned (first_name, last_name)`,
		`CREATE INDEX idx_users_part_created_at ON users_partitioned (created_at DESC)`,

		// STEP 4: Copy data from old table to new partitioned table
		// PostgreSQL automatically routes each row to the correct partition based on hash(id) % 16
		`INSERT INTO users_partitioned (id, created_at, updated_at, first_name, last_name)
		 SELECT id, created_at, updated_at, first_name, last_name FROM users`,

		// STEP 5: Drop foreign key constraint temporarily
		`ALTER TABLE users_accounts DROP CONSTRAINT IF EXISTS fk_users_accounts_user`,

		// STEP 6: Swap tables atomically
		`ALTER TABLE users RENAME TO users_old`,
		`ALTER TABLE users_partitioned RENAME TO users`,

		// STEP 7: Recreate foreign key constraint pointing to new partitioned table
		`ALTER TABLE users_accounts 
		 ADD CONSTRAINT fk_users_accounts_user 
		 FOREIGN KEY (user_id) REFERENCES users(id) 
		 ON UPDATE CASCADE ON DELETE CASCADE`,

		// STEP 8: Drop the old non-partitioned table
		`DROP TABLE users_old CASCADE`,

		// STEP 9: Analyze the new table for query optimizer
		`ANALYZE users`,
	}

	for _, sql := range steps {
		if err := db.Exec(sql).Error; err != nil {
			return err
		}
	}

	return nil
}

// Down_20260129170000 reverts the partitioned table back to a regular table.
// WARNING: This is a destructive operation - use only in development/testing!
func Down_20260129170000(db *gorm.DB) error {
	steps := []string{
		// Create non-partitioned table
		`CREATE TABLE users_regular (
			id UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ,
			first_name VARCHAR(100) NOT NULL,
			last_name VARCHAR(100) NOT NULL
		)`,

		// Copy data
		`INSERT INTO users_regular SELECT * FROM users`,

		// Drop FK
		`ALTER TABLE users_accounts DROP CONSTRAINT IF EXISTS fk_users_accounts_user`,

		// Swap
		`DROP TABLE users CASCADE`,
		`ALTER TABLE users_regular RENAME TO users`,

		// Recreate indexes
		`CREATE INDEX idx_user_name ON users (first_name, last_name)`,
		`CREATE INDEX idx_users_created_at ON users (created_at DESC)`,

		// Recreate FK
		`ALTER TABLE users_accounts 
		 ADD CONSTRAINT fk_users_accounts_user 
		 FOREIGN KEY (user_id) REFERENCES users(id) 
		 ON UPDATE CASCADE ON DELETE CASCADE`,

		`ANALYZE users`,
	}

	for _, sql := range steps {
		if err := db.Exec(sql).Error; err != nil {
			return err
		}
	}

	return nil
}
