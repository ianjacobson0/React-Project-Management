-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "joinCreated" TIMESTAMP(3),
ADD COLUMN     "joinExpireMinutes" INTEGER,
ADD COLUMN     "joinRoleId" INTEGER;
