-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "orgRoleId" INTEGER;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_orgRoleId_fkey" FOREIGN KEY ("orgRoleId") REFERENCES "OrgRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
