import { User } from "@prisma/client";

export type SignUpInput = {
    email: string;
    password: string;
    fullName?: string | null | undefined;
}

export type DeleteUserInput = {
    id: number;
}

export type SignInInput = {
    email: string;
    password: string;
}

export type SignInResponse = {
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
}

export type SignUpResponse = {
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
}