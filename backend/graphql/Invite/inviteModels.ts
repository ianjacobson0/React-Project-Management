export const models = `
    type Invite {
        id: Int!
        joinExpireMinutes: Int!
        joinCreated: Date!
        joinCode: String!
        Org: Organization
        orgId: Int!
        orgRole: OrgRole
        orgRoleId: Int!
    }

    input InviteInput {
        orgId: Int!
        orgRoleId: Int!
        expireMinutes: Int!
    }

    input JoinInput {
        userId: Int!
        joinCode: String!
    }

    type JoinResponse {
        success: Boolean!
        errorReason: String
    }

    type Mutation {
        invite(input: InviteInput!): Invite!
        join(input: JoinInput!): JoinResponse!
    }
`;