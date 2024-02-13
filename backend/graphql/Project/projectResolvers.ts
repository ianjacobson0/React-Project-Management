import { PrismaClient } from "@prisma/client";
import { CreateProjectInput, CreateProjectRoleInput, CreateTaskInput, CreateTaskPermissionInput, CreateUserProjMapInput, UpdateProjectRoleInput } from "../../types/graphql/projectTypes";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        checkProjectByUserId: async (_: any, { id }: { id: number }) => {
            const user = await prisma.user.findFirst(
                {
                    where: {
                        id: id
                    },
                    include: {
                        userProjMap: { include: { project: true } }
                    }
                });
            if (!user) {
                return [];
            } else {
                return await user.userProjMap.map(u => u.project);
            }
        },
        projectRolesByProjectId: async (_: any, { id }: { id: number }) => {
            const project = await prisma.project.findFirst({ where: { id: id }, include: { roles: true } });
            return project?.roles;
        },
        projectRole: async (_: any, { id }: { id: number }) => {
            return await prisma.projectRole.findFirst({ where: { id: id } });
        }
    },
    Mutation: {
        createProject: async (_: any, { input }: { input: CreateProjectInput }) => {
            const createProjectInput = {
                title: input.title,
                description: input.description,
                orgId: input.orgId
            }
            const project = await prisma.project.create({ data: createProjectInput });
            const role = await prisma.projectRole.create({
                data: {
                    name: "owner",
                    admin: true,
                    canEditAllStates: true,
                    canEditAllTasks: true,
                    projectId: project.id
                }
            });
            const userProjMap = await prisma.userProjMap.create({
                data: {
                    userId: input.userId,
                    roleId: role.id,
                    projectId: project.id
                }
            });
            return project;

        },
        createTask: async (_: any, { input }: { input: CreateTaskInput }) => {
            return await prisma.task.create({ data: input });
        },
        createProjectRole: async (_: any, { input }: { input: CreateProjectRoleInput }) => {
            return await prisma.projectRole.create({ data: input });
        },
        createTaskPermission: async (_: any, { input }: { input: CreateTaskPermissionInput }) => {
            return await prisma.taskPermission.create({ data: input });
        },
        createUserProjMap: async (_: any, { input }: { input: CreateUserProjMapInput }) => {
            const userProjMap = await prisma.userProjMap.findFirst({
                where: {
                    userId: input.userId,
                    projectId: input.projectId,
                    roleId: input.roleId
                }
            });
            if (userProjMap) {
                return userProjMap;
            } else {
                return await prisma.userProjMap.create({ data: input });
            }
        },
        deleteProjectRole: async (_: any, { id }: { id: number }) => {
            return await prisma.projectRole.delete({ where: { id: id } });
        },
        updateProjectRole: async (_: any, { input }: { input: UpdateProjectRoleInput }) => {
            return await prisma.projectRole.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    admin: input.admin,
                    canEditAllStates: input.canEditAllStates,
                    canEditAllTasks: input.canEditAllTasks,
                    projectId: input.projectId
                }
            });
        }
    }
}