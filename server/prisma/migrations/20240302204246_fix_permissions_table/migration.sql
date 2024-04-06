/*
  Warnings:

  - You are about to drop the column `permissionId` on the `ContentType` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContentType" DROP CONSTRAINT "ContentType_permissionId_fkey";

-- AlterTable
ALTER TABLE "AdminLog" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "ContentType" DROP COLUMN "permissionId",
ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "GroupPermission" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "contentTypeId" TEXT,
ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "UserGroup" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "UserPermission" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
