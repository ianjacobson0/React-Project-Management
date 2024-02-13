export type CreateProjectInput = {
    userId: number;
    title: string;
    description?: string;
    orgId: number;
}

export type CreateTaskInput = {
    name: string;
    description: string;
    projectId: number;
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