export type Organization = {
    id: number;
    name?: string;
    description?: string;
}

export type Project = {
    id: number;
    title?: string;
    description?: string;
    orgId?: number;
}

export type TaskState = {
    id: number;
    name?: string;
    complete?: boolean;
    order?: number;
}