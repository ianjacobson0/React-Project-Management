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
const graphql_1 = require("graphql");
const prisma = new client_1.PrismaClient();
exports.resolvers = {
    Date: new graphql_1.GraphQLScalarType({
        name: "Date",
        description: "Custom date scalar",
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.getTime();
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.INT) {
                return parseInt(ast.value, 10);
            }
        }
    }),
    Query: {
        organization: (_, { id }) => {
            return prisma.organization.findFirst({ where: { id: id } });
        },
        organizationByUserId: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({ where: { id: id }, include: { userOrgMap: true } });
            if (user) {
                return prisma.organization.findMany({
                    where: {
                        id: { in: user.userOrgMap.map(map => map.orgId || 0) }
                    }
                });
            } else {
                return [];
            }
        }),
        rolesByOrgId: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            return (_a = yield prisma.organization.findFirst({ where: { id: id }, include: { roles: true } })) === null || _a === void 0 ? void 0 : _a.roles;
        }),
        orgRole: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.orgRole.findFirst({ where: { id: id } });
        })
    },
    Mutation: {
        createOrganization: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const org = yield prisma.organization.create({ data: input, include: { owner: true } });
            const ownerRole = yield prisma.orgRole.create({
                data: {
                    name: "owner",
                    orgId: org.id,
                    admin: true,
                    canViewAll: true,
                    canCreateProject: true
                }
            });
            const userOrgMap = yield prisma.userOrgMap.create({
                data: {
                    orgId: org.id,
                    userId: org.ownerId,
                    roleId: ownerRole.id
                }
            });
            return org;
        }),
        createOrgRole: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.orgRole.create({ data: input, include: { org: true } });
        }),
        updateOrgRole: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.orgRole.update({
                where: {
                    id: input.id
                },
                data: {
                    orgId: input.orgId,
                    name: input.name,
                    admin: input.admin,
                    canViewAll: input.canViewAll,
                    canCreateProject: input.canCreateProject
                }
            });
        }),
        deleteOrgRole: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield prisma.orgRole.delete({ where: { id: id } });
            return true;
        }),
        mapUserToOrg: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.userOrgMap.create({ data: input });
        })
    }
};