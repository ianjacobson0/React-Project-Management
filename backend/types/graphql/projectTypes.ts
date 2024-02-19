export type CreateProjectInput = {
    userId: number;
    title: string;
    description?: string;
    orgId: number;
}

export type CreateTaskInput = {
    name?: string;
    description?: string;
    taskStateId: number;
}

export type CreateProjectRoleInput = {
    name: string;
    admin: boolean;
    canEditAllTasks: boolean;
    canEditAllStates: boolean;
    projectId: number;
}

export type UpdateProjectRoleInput = {
    id: number;
    name?: string;
    admin?: boolean;
    canEditAllTasks?: boolean;
    canEditAllStates?: boolean;
    projectId?: number;
}

export type CreateTaskPermissionInput = {
    access: boolean;
    taskId: number;
    projectRoleId: number;
}

export type CreateUserProjMapInput = {
    userId: number;
    roleId: number;
    projectId: number;
}

export type CreateTaskStateInput = {
    projectId: number;
    name: string;
    complete: boolean;
}

export type UpdateTaskStateInput = {
    id: number;
    name: string;
    complete: boolean;
}

export type ChangeTaskStateOrderInput = {
    id: number;
    newOrder: number;
}

export type ChangeTaskOrderInput = {
    id: number;
    newOrder: number;
}

export type ChangeTaskStateInput = {
    id: number;
    taskStateId: number;
}

export type UpdateTaskInput = {
    id: number;
    name?: string;
    description?: string;
}

export type UpdateProjectInput = {
    id: number;
    title: string;
    description: string;
    orgId: number;
}