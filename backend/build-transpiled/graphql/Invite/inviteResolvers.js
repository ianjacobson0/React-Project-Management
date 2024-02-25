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
const inviteCodeLength = 10;
exports.resolvers = {
    Mutation: {
        invite: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const inviteCode = generateInviteCode(inviteCodeLength);
            return yield prisma.invite.create({
                data: {
                    orgId: input.orgId,
                    orgRoleId: input.orgRoleId,
                    joinExpireMinutes: input.expireMinutes,
                    joinCode: inviteCode,
                    joinCreated: new Date()
                }
            });
        }),
        join: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
                where: {
                    id: input.userId
                }
            });
            if (!user) {
                return {
                    success: false,
                    errorReason: "user not found"
                };
            }
            const invite = yield prisma.invite.findFirst({
                where: {
                    joinCode: {
                        equals: input.joinCode.toString()
                    }
                }
            });
            if (!invite) {
                return {
                    success: false,
                    errorReason: "code incorrect"
                };
            }
            const now = new Date();
            const milliseconds = invite.joinExpireMinutes * 60000;
            const compare = new Date(invite.joinCreated.getTime() + milliseconds);
            if (now.getTime() > compare.getTime()) {
                return {
                    success: false,
                    errorReason: "code expired"
                };
            }
            const map = yield prisma.userOrgMap.create({
                data: {
                    orgId: invite.orgId,
                    userId: user.id,
                    roleId: invite.orgRoleId
                }
            });
            return map ? {
                success: true
            } : {
                success: false,
                errorReason: "error mapping to organization"
            };
        })
    }
};
const generateInviteCode = len => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = "";
    const charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
        res += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return res;
};