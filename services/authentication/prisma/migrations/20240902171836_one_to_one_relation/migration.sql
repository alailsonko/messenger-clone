/*
  Warnings:

  - A unique constraint covering the columns `[credentialId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_credentialId_key" ON "Session"("credentialId");
