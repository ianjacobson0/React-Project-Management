export type CreateOrgInput = {
    ownerId: number;
    name: string;
    description?: string;
}

export type CreateOrgRoleInput = {
    orgId: number;
    name: string;
    admin: boolean;
    canViewAll: boolean;
    canCreateProject: boolean;
}

export type UpdateOrgRoleInput = {
    id: number;
    orgId?: number;
    name?: string;
    admin?: boolean;
    canViewAll?: boolean;
    canCreateProject?: boolean;
}

export type UserOrgMappingInput = {
    orgId: number;
    userId: number;
    orgRoleId: number;
}

export type JoinInput = {
    userId: number;
    joinCode: String;
}