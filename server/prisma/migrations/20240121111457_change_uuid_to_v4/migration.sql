
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();
