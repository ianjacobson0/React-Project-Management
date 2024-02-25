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
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
exports.resolvers = {
    Query: {
        users: () => {
            return prisma.user.findMany();
        }
    },
    Mutation: {
        signUp: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            input.email = input.email.trim().toLowerCase();
            const duplicateUser = yield prisma.user.findFirst({ where: { email: input.email } });
            if (duplicateUser) {
                return { success: false, error: "duplicate_email" };
            }
            const hashedPassword = yield bcrypt_1.default.hash(input.password, 10);
            const data = {
                email: input.email,
                hashedPassword: hashedPassword,
                fullName: input.fullName || null
            };
            const user = yield prisma.user.create({ data: data });
            const secret = process.env.JWT_SECRET;
            let expires = new Date();
            expires.setDate(expires.getDate() + 1);
            const response = {
                success: true,
                token: jsonwebtoken_1.default.sign({ id: user.id, expires: expires }, secret),
                user: user
            };
            return response;
        }),
        signIn: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            if (input.email) {
                input.email = input.email.trim().toLowerCase();
            }
            const user = yield prisma.user.findFirst({ where: { email: input.email } });
            if (!user) {
                return { success: false, error: "email_not_found" };
            }
            if (!(yield bcrypt_1.default.compare(input.password, user.hashedPassword))) {
                return { success: false, error: "password_incorrect" };
            }
            let expires = new Date();
            expires.setDate(expires.getDate() + 1);
            const response = {
                success: true,
                token: jsonwebtoken_1.default.sign({ id: user.id, expires: expires }, process.env.JWT_SECRET),
                user: user
            };
            return response;
        }),
        deleteUser: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.user.delete({ where: { id: input.id } });
            return input.id;
        })
    }
};