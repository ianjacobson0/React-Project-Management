import { gql } from "@apollo/client";

export const CHECK_PROJ_BY_USER_ID = gql`
    query CheckProjByUserid($id: Int!) {
        checkProjectByUserId(id: $id) {
            id
        }
    }
`;

export const CREATE_PROJECT = gql`
    mutation CreateProject($input: CreateProjectInput!) {
        createProject(input: $input) {
            id
        }
    }
`;

export const QUERY_PROJECT_ROLES = gql`
    query ProjectRolesByProjectId($id: Int!) {
        projectRolesByProjectId(id: $id) {
            id
            name
            admin
            canEditAllStates
            canEditAllTasks
        }
    }
`;

export const CREATE_PROJECT_ROLE = gql`
    mutation CreateProjectRole($input: CreateProjectRoleInput!) {
        createProjectRole(input: $input) {
            id
        }
    }
`;

export const QUERY_PROJECT_ROLE_BY_ID = gql`
    query ProjectRoleById($id: Int!) {
        projectRole(id: $id) {
            id
            name
            admin
            canEditAllTasks
            canEditAllStates
        }
    }
`;

export const DELETE_PROJECT_ROLE = gql`
    mutation DeleteProjectRole($id: Int!) {
        deleteProjectRole(id: $id) {
            id
        }
    }
`;

export const UPDATE_PROJECT_ROLE = gql`
    mutation UpdateProjectRole($input: UpdateProjectRoleInput!) {
        updateProjectRole(input: $input) {
            id
        }
    }
`;