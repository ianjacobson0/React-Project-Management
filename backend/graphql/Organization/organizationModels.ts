export const models = `
    scalar Date 

    type Organization {
        id: Int!
        name: String!
        description: String
        createdAt: Date!
        joinExpireMinutes: Int
        joinCreated: Date
        joinCode: String
        joinRoleId: Int
        roles: [OrgRole]
        projects: [Project]
        userMap: [UserOrgMap]
        owner: User
        ownerId: Int
    }

    type UserOrgMap {
        id: Int!
        org: Organization
        orgId: Int
        user: User
        userId: Int
        role: OrgRole
        roleId: Int
    }

    type OrgRole {
        id: Int!
        name: String!
        admin: Boolean!
        canViewAll: Boolean!
        canCreateProject: Boolean!
        userMap: [UserOrgMap]
        orgId: Int
        org: Organization
    }

    input CreateOrgInput {
        ownerId: Int!
        name: String!
        description: String
    }

    input UpdateOrgInput {
        id: Int!
        name: String!
        description: String!
    }

    input CreateOrgRoleInput {
        orgId: Int!
        name: String!
        admin: Boolean!
        canViewAll: Boolean!
        canCreateProject: Boolean!
    }

    input UpdateOrgRoleInput {
        id: Int!
        orgId: Int
        name: String
        admin: Boolean
        canViewAll: Boolean
        canCreateProject: Boolean
    }

    input UserOrgMappingInput {
        orgId: Int!
        userId: Int!
        roleId: Int!
    }

    type Query {
        organization(id: Int!): Organization
        organizationByUserId(id: Int!): [Organization]
        rolesByOrgId(id: Int!): [OrgRole]
        orgRole(id: Int!): OrgRole!
    }

    type Mutation {
        createOrganization(input: CreateOrgInput!): Organization
        createOrgRole(input: CreateOrgRoleInput!): OrgRole
        updateOrg(input: UpdateOrgInput!): Organization
        mapUserToOrg(input: UserOrgMappingInput!): UserOrgMap
        updateOrgRole(input: UpdateOrgRoleInput!): OrgRole!
        deleteOrgRole(id: Int!): Boolean!
    }
`