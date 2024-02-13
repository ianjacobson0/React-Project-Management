/*
  Warnings:

  - You are about to drop the `StatePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskPermissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StatePermissions" DROP CONSTRAINT "StatePermissions_projectRoleId_fkey";

-- DropForeignKey
ALTER TABLE "StatePermissions" DROP CONSTRAINT "StatePermissions_taskStateId_fkey";

-- DropForeignKey
ALTER TABLE "TaskPermissions" DROP CONSTRAINT "TaskPermissions_projectRoleId_fkey";

-- DropForeignKey
ALTER TABLE "TaskPermissions" DROP CONSTRAINT "TaskPermissions_taskId_fkey";

-- DropTable
DROP TABLE "StatePermissions";

-- DropTable
DROP TABLE "TaskPermissions";

-- CreateTable
CREATE TABLE "TaskPermission" (
    "id" SERIAL NOT NULL,
    "access" BOOLEAN NOT NULL,
    "taskId" INTEGER,
    "projectRoleId" INTEGER,

    CONSTRAINT "TaskPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatePermission" (
    "id" SERIAL NOT NULL,
    "access" BOOLEAN NOT NULL,
    "taskStateId" INTEGER,
    "projectRoleId" INTEGER,

    CONSTRAINT "StatePermission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskPermission" ADD CONSTRAINT "TaskPermission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskPermission" ADD CONSTRAINT "TaskPermission_projectRoleId_fkey" FOREIGN KEY ("projectRoleId") REFERENCES "ProjectRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatePermission" ADD CONSTRAINT "StatePermission_taskStateId_fkey" FOREIGN KEY ("taskStateId") REFERENCES "TaskState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatePermission" ADD CONSTRAINT "StatePermission_projectRoleId_fkey" FOREIGN KEY ("projectRoleId") REFERENCES "ProjectRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
