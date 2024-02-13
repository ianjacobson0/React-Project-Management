-- AlterTable
ALTER TABLE "OrgRole" ADD COLUMN     "organizationId" INTEGER;

-- AddForeignKey
ALTER TABLE "OrgRole" ADD CONSTRAINT "OrgRole_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
