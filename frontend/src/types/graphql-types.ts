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