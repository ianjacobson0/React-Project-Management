"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
exports.models = `
    type User {
        id: ID
        email: String!
        hashedPassword: String!
        fullName: String
        orgs: [Organization]
        userOrgMap: [UserOrgMap]
        userProjMap: [UserProjMap]
        userTaskMap: [UserTaskMap]
    }

    type SignInResponse {
        success: Boolean!
        token: String
        user: User
        error: String
    }

    type SignUpResponse {
        success: Boolean!
        token: String
        user: User
        error: String
    }

    input SignUpInput {
        email: String!
        password: String!
        fullName: String
    }

    input DeleteUserInput {
        id: Int!
    }

    input SignInInput {
        email: String!
        password: String!
    }

    type Query {
        users: [User!]!
    }

    type Mutation {
        signUp(input: SignUpInput!): SignUpResponse!
        deleteUser(input: DeleteUserInput!): Int!
        signIn(input: SignInInput!): SignInResponse!
    }
`;