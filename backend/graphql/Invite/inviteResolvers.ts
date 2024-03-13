import { PrismaClient } from "@prisma/client";
import { InviteInput } from "../../types/graphql/inviteTypes";
import { JoinInput } from "../../types/graphql/organizationTypes";

const prisma = new PrismaClient();

const inviteCodeLength = 10;

export const resolvers = {
    Mutation: {
        invite: async (_: any, { input }: { input: InviteInput }) => {
            const inviteCode = generateInviteCode(inviteCodeLength);
            return await prisma.invite.create({
                data: {
                    orgId: input.orgId,
                    orgRoleId: input.orgRoleId,
                    joinExpireMinutes: input.expireMinutes,
                    joinCode: inviteCode,
                    joinCreated: new Date()
                }
            });
        },
        join: async (_: any, { input }: { input: JoinInput }) => {
            const user = await prisma.user.findFirst({
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

            const invite = await prisma.invite.findFirst({
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
            const now = new Date()
            const milliseconds = invite.joinExpireMinutes * 60000;
            const compare = new Date(invite.joinCreated.getTime() + milliseconds);
            if (now.getTime() > compare.getTime()) {
                return {
                    success: false,
                    errorReason: "code expired"
                };
            }

            const map = await prisma.userOrgMap.create({
                data: {
                    orgId: invite.orgId,
                    userId: user.id,
                    roleId: invite.orgRoleId
                }
            });

            const role = await prisma.orgRole.findFirst({ where: { id: invite.orgRoleId ?? 0 } });

            if (role && role.canViewAll) {
                const projects = (await prisma.organization.findFirst({
                    where: {
                        id: invite.orgId ?? 0
                    }, select: {
                        projects: {
                            select: {
                                id: true
                            }
                        }
                    }
                }))?.projects;

                if (projects) {
                    projects.map(async proj => {
                        const roles = (await prisma.project.findFirst({
                            where: {
                                id: proj.id
                            },
                            select: {
                                roles: true
                            }
                        }))?.roles;
                        const ownerRole = roles?.find(role => role.admin = true);
                        await prisma.userProjMap.create({
                            data: {
                                projectId: proj.id,
                                userId: input.userId,
                                roleId: ownerRole?.id
                            }
                        })
                    });
                }
            }

            return (map) ?
                {
                    success: true
                }
                :
                {
                    success: false,
                    errorReason: "error mapping to organization"
                };
        }
    }
}

const generateInviteCode = (len: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = "";
    const charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
        res += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return res;
}