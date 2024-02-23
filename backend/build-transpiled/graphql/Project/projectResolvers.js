"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.resolvers = {
    Query: {
        project: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.project.findFirst({ where: { id: id } });
        }),
        checkProjectByUserId: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
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
                return yield user.userProjMap.map(u => u.project);
            }
        }),
        projectRolesByProjectId: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const project = yield prisma.project.findFirst({ where: { id: id }, include: { roles: true } });
            return project === null || project === void 0 ? void 0 : project.roles;
        }),
        projectRole: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.projectRole.findFirst({ where: { id: id } });
        }),
        projectsByOrgIdAndUserId: (_, { userId, orgId }) => __awaiter(void 0, void 0, void 0, function* () {
            const projectIds = (yield prisma.userProjMap.findMany({ where: { userId: userId } })).map(mp => mp.projectId || 0);
            const org = yield prisma.organization.findFirst({
                where: {
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
            return org === null || org === void 0 ? void 0 : org.projects;
        }),
        taskStates: (_, { projectId }) => __awaiter(void 0, void 0, void 0, function* () {
            const project = yield prisma.project.findFirst({
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
            const states = project === null || project === void 0 ? void 0 : project.taskStates;
            if (!states) {
                return [];
            } else {
                states.sort((a, b) => {
                    if (a.order == null || b.order == null) {
                        return 1;
                    }
                    return a.order < b.order ? -1 : 1;
                });
                return states;
            }
        }),
        taskState: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.taskState.findFirst({ where: { id: id } });
        }),
        tasks: (_, { stateId }) => __awaiter(void 0, void 0, void 0, function* () {
            const state = yield prisma.taskState.findFirst({
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
            const tasks = state === null || state === void 0 ? void 0 : state.tasks;
            tasks === null || tasks === void 0 ? void 0 : tasks.sort((a, b) => {
                return a.order < b.order ? -1 : 1;
            });
            return tasks;
        })
    },
    Mutation: {
        createProject: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const createProjectInput = {
                title: input.title,
                description: input.description,
                orgId: input.orgId
            };
            const project = yield prisma.project.create({ data: createProjectInput });
            const role = yield prisma.projectRole.create({
                data: {
                    name: "owner",
                    admin: true,
                    canEditAllStates: true,
                    canEditAllTasks: true,
                    projectId: project.id
                }
            });
            const userProjMap = yield prisma.userProjMap.create({
                data: {
                    userId: input.userId,
                    roleId: role.id,
                    projectId: project.id
                }
            });
            return project;
        }),
        createTask: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const tasks = (_a = yield prisma.taskState.findFirst({
                where: {
                    id: input.taskStateId
                },
                include: {
                    tasks: true
                }
            })) === null || _a === void 0 ? void 0 : _a.tasks;
            if (!tasks || tasks.length === 0) {
                return yield prisma.task.create({
                    data: {
                        name: input.name,
                        description: input.description,
                        order: 0,
                        taskStateId: input.taskStateId
                    }
                });
            }
            const maximum = Math.max(...tasks.map(o => o.order));
            return yield prisma.task.create({
                data: {
                    name: input.name,
                    description: input.description,
                    order: maximum + 1,
                    taskStateId: input.taskStateId
                }
            });
        }),
        createProjectRole: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.projectRole.create({ data: input });
        }),
        createTaskPermission: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.taskPermission.create({ data: input });
        }),
        createUserProjMap: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const userProjMap = yield prisma.userProjMap.findFirst({
                where: {
                    userId: input.userId,
                    projectId: input.projectId,
                    roleId: input.roleId
                }
            });
            if (userProjMap) {
                return userProjMap;
            } else {
                return yield prisma.userProjMap.create({ data: input });
            }
        }),
        createTaskState: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const project = yield prisma.project.findFirst({
                where: {
                    id: input.projectId
                },
                include: {
                    taskStates: true
                }
            });
            const states = project === null || project === void 0 ? void 0 : project.taskStates;
            if (!states || (states === null || states === void 0 ? void 0 : states.length) == 0) {
                return yield prisma.taskState.create({
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
                return yield prisma.taskState.create({
                    data: {
                        projectId: input.projectId,
                        name: input.name,
                        complete: input.complete,
                        order: order
                    }
                });
            }
        }),
        deleteProjectRole: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.projectRole.delete({ where: { id: id } });
        }),
        updateProjectRole: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.projectRole.update({
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
        }),
        updateProject: (__, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.project.update({
                where: {
                    id: input.id
                },
                data: {
                    title: input.title,
                    description: input.description,
                    orgId: input.orgId
                }
            });
        }),
        updateTaskState: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.taskState.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    complete: input.complete
                }
            });
        }),
        updateTask: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.task.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    description: input.description
                }
            });
        }),
        changeTaskStateOrder: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const taskState = yield prisma.taskState.findFirst({
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
            const project = taskState === null || taskState === void 0 ? void 0 : taskState.project;
            const states = project === null || project === void 0 ? void 0 : project.taskStates;
            if (!states || !taskState || !project) {
                return taskState;
            }
            states.sort((a, b) => {
                if (a.order == null || b.order == null) {
                    return 1;
                }
                return a.order < b.order ? -1 : 1;
            });
            const newState = states.find(state => state.id === taskState.id);
            const stateIdx = states.findIndex(state => state.id === taskState.id);
            states.splice(stateIdx, 1);
            if (!newState) {
                return taskState;
            }
            input.newOrder < states.length ? states.splice(input.newOrder, 0, newState) : states.push(newState);
            for (let i = 0; i < states.length; i++) {
                yield prisma.taskState.update({
                    where: {
                        id: states[i].id
                    },
                    data: {
                        order: i
                    }
                });
            }
            return yield prisma.taskState.findFirst({ where: { id: input.id } });
        }),
        changeTaskOrder: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const task = yield prisma.task.findFirst({
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
            const tasks = (_b = task === null || task === void 0 ? void 0 : task.taskState) === null || _b === void 0 ? void 0 : _b.tasks;
            if (!tasks) {
                return task;
            }
            tasks.sort((a, b) => {
                if (a.order == null || b.order == null) {
                    return 1;
                }
                return a.order < b.order ? -1 : 1;
            });
            const newTask = tasks.find(t => t.id === task.id);
            const taskIdx = tasks.findIndex(t => t.id === task.id);
            tasks.splice(taskIdx, 1);
            if (!newTask) {
                return task;
            }
            input.newOrder < tasks.length ? tasks.splice(input.newOrder, 0, newTask) : tasks.push(newTask);
            for (let i = 0; i < tasks.length; i++) {
                yield prisma.task.update({
                    where: {
                        id: tasks[i].id
                    },
                    data: {
                        order: i
                    }
                });
            }
            return yield prisma.task.findFirst({ where: { id: input.id } });
        }),
        changeTaskState: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const task = yield prisma.task.findFirst({
                where: {
                    id: input.id
                },
                include: {
                    taskState: true
                }
            });
            if (!(task === null || task === void 0 ? void 0 : task.taskState)) {
                return task;
            }
            const oldTaskStateId = task.taskState.id;
            const newTaskState = yield prisma.taskState.findFirst({
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
            const newOrder = Math.max(...(newTaskState === null || newTaskState === void 0 ? void 0 : newTaskState.tasks.map(o => o.order))) + 1;
            const newTask = yield prisma.task.update({
                where: {
                    id: task.id
                },
                data: {
                    taskStateId: newTaskState.id,
                    order: newOrder
                }
            });
            const oldTasks = (_c = yield prisma.taskState.findFirst({
                where: {
                    id: oldTaskStateId
                },
                include: {
                    tasks: true
                }
            })) === null || _c === void 0 ? void 0 : _c.tasks;
            if (oldTasks) {
                oldTasks.sort((a, b) => a.order < b.order ? -1 : 1);
                for (let i = 0; i < oldTasks.length; i++) {
                    yield prisma.task.update({
                        where: {
                            id: oldTasks[i].id
                        },
                        data: {
                            order: i
                        }
                    });
                }
            }
            return newTask;
        }),
        deleteTaskState: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.taskState.delete({ where: { id: id } });
        }),
        deleteTask: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.task.delete({ where: { id: id } });
        })
    }
};