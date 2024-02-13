import { PrismaClient, User } from "@prisma/client";
import { SignUpInput, DeleteUserInput, SignInInput, SignInResponse, SignUpResponse } from "../../types/graphql/userTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        users: () => {
            return prisma.user.findMany();
        }
    },
    Mutation: {
        signUp: async (_: any, { input }: { input: SignUpInput }): Promise<SignUpResponse> => {
            input.email = input.email.trim().toLowerCase();
            const duplicateUser = await prisma.user.findFirst({ where: { email: input.email } });
            if (duplicateUser) {
                return { success: false, error: "duplicate_email" };
            }
            const hashedPassword = await bcrypt.hash(input.password, 10);
            const data = {
                email: input.email,
                hashedPassword: hashedPassword,
                fullName: input.fullName || null
            }
            const user = await prisma.user.create({ data: data });
            const secret = process.env.JWT_SECRET;
            let expires = new Date();
            expires.setDate(expires.getDate() + 1);
            const response = {
                success: true,
                token: jwt.sign({ id: user.id, expires: expires }, secret!),
                user: user
            }
            return response;
        },
        signIn: async (_: any, { input }: { input: SignInInput }): Promise<SignInResponse> => {
            if (input.email) {
                input.email = input.email.trim().toLowerCase();
            }
            const user = await prisma.user.findFirst({ where: { email: input.email } });
            if (!user) {
                return { success: false, error: "email_not_found" }
            }
            if (!await bcrypt.compare(input.password, user.hashedPassword)) {
                return { success: false, error: "password_incorrect" }
            }
            let expires = new Date();
            expires.setDate(expires.getDate() + 1);
            const response = {
                success: true,
                token: jwt.sign({ id: user.id, expires: expires }, process.env.JWT_SECRET!),
                user: user
            }
            return response;
        },
        deleteUser: async (_: any, { input }: { input: DeleteUserInput }) => {
            await prisma.user.delete({ where: { id: input.id } });
            return input.id;
        }
    }
}