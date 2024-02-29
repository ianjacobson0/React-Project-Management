import { gql } from "@apollo/client";

export const QUERY_ORG_BY_ID = gql`
    query QueryOrgById($id: Int!) {
        organization(id: $id) {
            id
            name
            description
        }
    }
`

export const CHECK_ORG_BY_USER_ID = gql`
    query CheckOrgByUserId($id: Int!) {
        organizationByUserId(id: $id) {
            id
            name
        }
    }
`;

export const CREATE_ORG = gql`
    mutation CreateOrganization($input: CreateOrgInput!) {
        createOrganization(input: $input) {
            id
        }
    }
`;

export const ROLES_BY_ORG_ID = gql`
    query RolesByOrgId ($id: Int!) {
        rolesByOrgId(id: $id) {
            id
            name
            admin
            canViewAll
            canCreateProject
        }
    }
`;

export const CREATE_ORG_ROLE = gql`
    mutation CreateOrgRole($input: CreateOrgRoleInput!) {
        createOrgRole(input: $input) {
            id
        }
    }
`;

export const DELETE_ORG_ROLE = gql`
    mutation DeleteOrgRole($id: Int!) {
        deleteOrgRole(id: $id)
    }
`;

export const ORG_ROLE_BY_ID = gql`
    query OrgRoleById($id: Int!) {
        orgRole(id: $id) {
            id
            name
            admin
            canViewAll
            canCreateProject
        }
    }
`;

export const UPDATE_ORG_ROLE = gql`
    mutation UpdateOrgRole($input: UpdateOrgRoleInput!) {
        updateOrgRole(input: $input) {
            id
        }
    }
`