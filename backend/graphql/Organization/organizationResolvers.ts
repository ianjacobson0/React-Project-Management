import { Organization, PrismaClient, User } from "@prisma/client"
import { CreateOrgInput, CreateOrgRoleInput, UpdateOrgInput, UpdateOrgRoleInput, UserOrgMappingInput } from "../../types/graphql/organizationTypes";
import { GraphQLScalarType, Kind } from "graphql";
import { addResolversToSchema } from "@graphql-tools/schema";

const prisma = new PrismaClient();

export const resolvers = {
    Date: new GraphQLScalarType({
        name: "Date",
        description: "Custom date scalar",
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.getTime();
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10);
            }
        }
    }),
    Query: {
        organization: (_: any, { id }: { id: number }) => {
            return prisma.organization.findFirst({ where: { id: id } });
        },
        organizationByUserId: async (_: any, { id }: { id: number }) => {
            const user = await prisma.user.findFirst({ where: { id: id }, include: { userOrgMap: true } })
            if (user) {
                return prisma.organization.findMany({
                    where: {
                        id: { in: user.userOrgMap.map(map => map.orgId || 0) }
                    }
                });
            } else {
                return [];
            }
        },
        rolesByOrgId: async (_: any, { id }: { id: number }) => {
            return (await prisma.organization.findFirst({ where: { id: id }, include: { roles: true } }))?.roles;
        },
        orgRole: async (_: any, { id }: { id: number }) => {
            return await prisma.orgRole.findFirst({ where: { id: id } });
        }
    },
    Mutation: {
        createOrganization: async (_: any, { input }: { input: CreateOrgInput }) => {
            const org = await prisma.organization.create({ data: input, include: { owner: true } });
            const ownerRole = await prisma.orgRole.create({
                data: {
                    name: "owner",
                    orgId: org.id,
                    admin: true,
                    canViewAll: true,
                    canCreateProject: true
                }
            });
            const userOrgMap = await prisma.userOrgMap.create({
                data: {
                    orgId: org.id,
                    userId: org.ownerId,
                    roleId: ownerRole.id
                }
            });
            return org;
        },
        updateOrg: async (_: any, { input }: { input: UpdateOrgInput }) => {
            const data = {
                name: input.name,
                description: input.description
            }
            return await prisma.organization.update({
                where: { id: input.id },
                data: data
            });
        },
        createOrgRole: async (_: any, { input }: { input: CreateOrgRoleInput }) => {
            return await prisma.orgRole.create({ data: input, include: { org: true } });
        },
        updateOrgRole: async (_: any, { input }: { input: UpdateOrgRoleInput }) => {
            return await prisma.orgRole.update({
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
        },
        deleteOrgRole: async (_: any, { id }: { id: number }) => {
            const res = await prisma.orgRole.delete({ where: { id: id } });
            return true;
        },
        mapUserToOrg: async (_: any, { input }: { input: UserOrgMappingInput }) => {
            return await prisma.userOrgMap.create({ data: input });
        }
    }
}