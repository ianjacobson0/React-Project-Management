/*
  Warnings:

  - You are about to drop the column `joinCode` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `joinCreated` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `joinExpireMinutes` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `joinRoleId` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "joinCode",
DROP COLUMN "joinCreated",
DROP COLUMN "joinExpireMinutes",
DROP COLUMN "joinRoleId";

-- CreateTable
CREATE TABLE "Invite" (
    "id" SERIAL NOT NULL,
    "joinExpireMinutes" INTEGER,
    "joinCreated" TIMESTAMP(3),
    "joinCode" TEXT,
    "orgId" INTEGER,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
