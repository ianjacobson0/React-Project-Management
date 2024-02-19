/*
  Warnings:

  - Made the column `joinExpireMinutes` on table `Invite` required. This step will fail if there are existing NULL values in that column.
  - Made the column `joinCreated` on table `Invite` required. This step will fail if there are existing NULL values in that column.
  - Made the column `joinCode` on table `Invite` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "joinExpireMinutes" SET NOT NULL,
ALTER COLUMN "joinCreated" SET NOT NULL,
ALTER COLUMN "joinCode" SET NOT NULL;
