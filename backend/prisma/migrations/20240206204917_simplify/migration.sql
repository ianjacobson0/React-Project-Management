/*
  Warnings:

  - You are about to drop the column `organizationId` on the `OrgRole` table. All the data in the column will be lost.
  - You are about to drop the `UserOrganizationMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrgRole" DROP CONSTRAINT "OrgRole_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganizationMap" DROP CONSTRAINT "UserOrganizationMap_orgRoleId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganizationMap" DROP CONSTRAINT "UserOrganizationMap_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganizationMap" DROP CONSTRAINT "UserOrganizationMap_userId_fkey";

-- AlterTable
ALTER TABLE "OrgRole" DROP COLUMN "organizationId",
ADD COLUMN     "orgId" INTEGER;

-- DropTable
DROP TABLE "UserOrganizationMap";

-- CreateTable
CREATE TABLE "UserOrgMap" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER,
    "userId" INTEGER,
    "roleId" INTEGER,

    CONSTRAINT "UserOrgMap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserOrgMap" ADD CONSTRAINT "UserOrgMap_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrgMap" ADD CONSTRAINT "UserOrgMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrgMap" ADD CONSTRAINT "UserOrgMap_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "OrgRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgRole" ADD CONSTRAINT "OrgRole_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
