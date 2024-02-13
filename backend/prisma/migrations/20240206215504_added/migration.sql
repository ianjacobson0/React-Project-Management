-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orgId" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProjMap" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER,
    "userId" INTEGER,
    "roleId" INTEGER,

    CONSTRAINT "UserProjMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "canEditAllTasks" BOOLEAN NOT NULL,
    "canEditAllStates" BOOLEAN NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "ProjectRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskPermissions" (
    "id" SERIAL NOT NULL,
    "access" BOOLEAN NOT NULL,
    "taskId" INTEGER,
    "projectRoleId" INTEGER,

    CONSTRAINT "TaskPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatePermissions" (
    "id" SERIAL NOT NULL,
    "access" BOOLEAN NOT NULL,
    "taskStateId" INTEGER,
    "projectRoleId" INTEGER,

    CONSTRAINT "StatePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" INTEGER,
    "taskStateId" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskState" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "TaskState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTaskMap" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "UserTaskMap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjMap" ADD CONSTRAINT "UserProjMap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjMap" ADD CONSTRAINT "UserProjMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjMap" ADD CONSTRAINT "UserProjMap_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ProjectRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRole" ADD CONSTRAINT "ProjectRole_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskPermissions" ADD CONSTRAINT "TaskPermissions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskPermissions" ADD CONSTRAINT "TaskPermissions_projectRoleId_fkey" FOREIGN KEY ("projectRoleId") REFERENCES "ProjectRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatePermissions" ADD CONSTRAINT "StatePermissions_taskStateId_fkey" FOREIGN KEY ("taskStateId") REFERENCES "TaskState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatePermissions" ADD CONSTRAINT "StatePermissions_projectRoleId_fkey" FOREIGN KEY ("projectRoleId") REFERENCES "ProjectRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskStateId_fkey" FOREIGN KEY ("taskStateId") REFERENCES "TaskState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskMap" ADD CONSTRAINT "UserTaskMap_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskMap" ADD CONSTRAINT "UserTaskMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
