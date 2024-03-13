import { PrismaClient } from "@prisma/client";
import {
    ChangeTaskOrderInput,
    ChangeTaskStateInput,
    ChangeTaskStateOrderInput,
    CreateProjectInput,
    CreateProjectRoleInput,
    CreateTaskInput,
    CreateTaskPermissionInput,
    CreateTaskStateInput,
    CreateUserProjMapInput,
    UpdateProjectInput,
    UpdateProjectRoleInput,
    UpdateTaskInput,
    UpdateTaskStateInput
} from "../../types/graphql/projectTypes";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        project: async (_: any, { id }: { id: number }) => {
            return await prisma.project.findFirst({ where: { id: id } });
        },
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
        },
        projectsByOrgIdAndUserId: async (_: any, { userId, orgId }: { userId: number, orgId: number }) => {
            const projectIds = (await prisma.userProjMap.findMany({ where: { userId: userId } })).map(mp => mp.projectId || 0);
            const org = await prisma.organization.findFirst({
                where:
                {
                    id: orgId
                },
                include: {
                    projects: {
                        where: {
                            id: {
                                in: projectIds
                            }
                        }
                    }
                }
            });
            return org?.projects;

        },
        taskStates: async (_: any, { projectId }: { projectId: number }) => {
            const project = await prisma.project.findFirst({
                where: {
                    id: projectId
                },
                include: {
                    taskStates: {
                        select: {
                            id: true,
                            name: true,
                            order: true,
                            complete: true
                        }
                    }
                }
            });
            const states = project?.taskStates;
            if (!states) {
                return [];
            } else {
                states.sort((a, b) => {
                    if (a.order == null || b.order == null) {
                        return 1
                    }
                    return (a.order < b.order) ? -1 : 1
                });
                return states;
            }
        },
        taskState: async (_: any, { id }: { id: number }) => {
            return await prisma.taskState.findFirst({ where: { id: id } });
        },
        tasks: async (_: any, { stateId }: { stateId: number }) => {
            const state = await prisma.taskState.findFirst({
                where: {
                    id: stateId
                },
                include: {
                    tasks: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            order: true,
                            taskStateId: true
                        }
                    }
                }
            });
            const tasks = state?.tasks;
            tasks?.sort((a, b) => {
                return (a.order < b.order) ? -1 : 1
            });
            return tasks;
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
            const tasks = (await prisma.taskState.findFirst({
                where: {
                    id: input.taskStateId
                },
                include: {
                    tasks: true
                }
            }))?.tasks;
            if (!tasks || tasks.length === 0) {
                return await prisma.task.create({
                    data: {
                        name: input.name,
                        description: input.description,
                        order: 0,
                        taskStateId: input.taskStateId
                    }
                });
            }
            const maximum = Math.max(...tasks.map(o => o.order));
            return await prisma.task.create({
                data: {
                    name: input.name,
                    description: input.description,
                    order: maximum + 1,
                    taskStateId: input.taskStateId
                }
            });
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
        createTaskState: async (_: any, { input }: { input: CreateTaskStateInput }) => {
            const project = await prisma.project.findFirst({
                where: {
                    id: input.projectId
                },
                include: {
                    taskStates: true
                }
            });
            const states = project?.taskStates;
            if (!states || states?.length == 0) {
                return await prisma.taskState.create({
                    data: {
                        projectId: input.projectId,
                        name: input.name,
                        complete: input.complete,
                        order: 0
                    }
                });
            } else {
                const orders = states.map(o => o.order || 0);
                const order = Math.max(...orders) + 1;
                return await prisma.taskState.create({
                    data: {
                        projectId: input.projectId,
                        name: input.name,
                        complete: input.complete,
                        order: order
                    }
                });
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
        },
        updateProject: async (__: any, { input }: { input: UpdateProjectInput }) => {
            return await prisma.project.update({
                where: {
                    id: input.id
                },
                data: {
                    title: input.title,
                    description: input.description,
                    orgId: input.orgId
                }
            })
        },
        updateTaskState: async (_: any, { input }: { input: UpdateTaskStateInput }) => {
            return await prisma.taskState.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    complete: input.complete
                }
            });
        },
        updateTask: async (_: any, { input }: { input: UpdateTaskInput }) => {
            return await prisma.task.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    description: input.description
                }
            })
        },
        changeTaskStateOrder: async (_: any, { input }: { input: ChangeTaskStateOrderInput }) => {
            const taskState = await prisma.taskState.findFirst({
                where: {
                    id: input.id
                }, select: {
                    id: true,
                    project: {
                        select: {
                            taskStates: true
                        }
                    },
                    order: true
                }
            });
            const project = taskState?.project;
            const states = project?.taskStates;
            if (!states || !taskState || !project) {
                return taskState;
            }
            states.sort((a, b) => {
                if (a.order == null || b.order == null) {
                    return 1
                }
                return (a.order < b.order) ? -1 : 1
            });
            const newState = states.find(state => state.id === taskState.id);
            const stateIdx = states.findIndex(state => state.id === taskState.id);
            states.splice(stateIdx, 1);
            if (!newState) {
                return taskState;
            }
            (input.newOrder < states.length) ?
                states.splice(input.newOrder, 0, newState)
                :
                states.push(newState);
            for (let i = 0; i < states.length; i++) {
                await prisma.taskState.update({
                    where: {
                        id: states[i].id
                    },
                    data: {
                        order: i
                    }
                });
            }
            return await prisma.taskState.findFirst({ where: { id: input.id } });
        },
        changeTaskOrder: async (_: any, { input }: { input: ChangeTaskOrderInput }) => {
            const task = await prisma.task.findFirst({
                where: {
                    id: input.id
                }, select: {
                    id: true,
                    taskState: {
                        select: {
                            tasks: true
                        }
                    },
                    order: true
                }
            });
            const tasks = task?.taskState?.tasks;
            if (!tasks) {
                return task;
            }
            tasks.sort((a, b) => {
                if (a.order == null || b.order == null) {
                    return 1
                }
                return (a.order < b.order) ? -1 : 1
            });
            const newTask = tasks.find(t => t.id === task.id);
            const taskIdx = tasks.findIndex(t => t.id === task.id);
            tasks.splice(taskIdx, 1);
            if (!newTask) {
                return task;
            }
            (input.newOrder < tasks.length) ?
                tasks.splice(input.newOrder, 0, newTask)
                :
                tasks.push(newTask);
            for (let i = 0; i < tasks.length; i++) {
                await prisma.task.update({
                    where: {
                        id: tasks[i].id
                    },
                    data: {
                        order: i
                    }
                });
            }
            return await prisma.task.findFirst({ where: { id: input.id } });
        },
        changeTaskState: async (_: any, { input }: { input: ChangeTaskStateInput }) => {
            const task = await prisma.task.findFirst({
                where: {
                    id: input.id
                },
                include: {
                    taskState: true
                }
            });
            if (!task?.taskState) {
                return task;
            }
            const oldTaskStateId = task.taskState.id;
            const newTaskState = await prisma.taskState.findFirst({
                where: {
                    id: input.taskStateId
                },
                include: {
                    tasks: true
                }
            });
            if (!newTaskState) {
                return task;
            }
            let newOrder = 0
            if (newTaskState.tasks && newTaskState.tasks.length > 0) {
                newOrder = Math.max(...newTaskState?.tasks.map(o => o.order)) + 1
            }
            const newTask = await prisma.task.update({
                where: {
                    id: task.id
                },
                data: {
                    taskStateId: newTaskState.id,
                    order: newOrder
                }
            });
            const oldTasks = (await prisma.taskState.findFirst({
                where: {
                    id: oldTaskStateId
                },
                include: {
                    tasks: true
                }
            }))?.tasks;
            if (oldTasks) {
                oldTasks.sort((a, b) => a.order < b.order ? -1 : 1);
                for (let i = 0; i < oldTasks.length; i++) {
                    await prisma.task.update({
                        where: {
                            id: oldTasks[i].id
                        },
                        data: {
                            order: i
                        }
                    })
                }
            }
            return newTask;

        },
        deleteTaskState: async (_: any, { id }: { id: number }) => {
            return await prisma.taskState.delete({ where: { id: id } });
        },
        deleteTask: async (_: any, { id }: { id: number }) => {
            return await prisma.task.delete({ where: { id: id } });
        },
        deleteProject: async (_: any, { id }: { id: number }) => {
            const roles = (await prisma.project.findFirst({
                where: {
                    id: id
                },
                select: {
                    roles: true
                }
            }))?.roles;

            if (roles) {
                await prisma.projectRole.deleteMany({
                    where: {
                        id: { in: roles.map(role => role.id) }
                    }
                })
            }

            await prisma.project.delete({ where: { id: id } });

            return true;
        }
    }
}