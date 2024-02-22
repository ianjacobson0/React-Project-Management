import { gql } from "@apollo/client";

export const QUERY_PROJECT = gql`
    query QueryProject($id: Int!) {
        project(id: $id) {
            id
            title
            description
            orgId
        }
    }
`;

export const CHECK_PROJ_BY_USER_ID = gql`
    query CheckProjByUserid($id: Int!) {
        checkProjectByUserId(id: $id) {
            id
            title
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

export const UPDATE_PROJECT = gql`
    mutation UpdateProject($input: UpdateProjectInput!) {
        updateProject(input: $input) {
            id
        }
    }
`;

export const PROJECT_BY_ORG_USER_ID = gql`
    query ProjectByOrgUserId($userId: Int!, $orgId: Int!) {
        projectsByOrgIdAndUserId(userId: $userId, orgId: $orgId) {
            id
            title
        }
    }
`;

export const QUERY_TASK_STATES = gql`
    query QueryTaskStates($projectId: Int!) {
        taskStates(projectId: $projectId) {
            id
            name
            complete
            order
        }
    }
`;

export const CREATE_TASK_STATE = gql`
    mutation CreateTaskState($input: CreateTaskStateInput!) {
        createTaskState(input: $input) {
            id
        }
    }
`;

export const QUERY_STATE_BY_ID = gql`
    query QueryTaskStateById($id: Int!) {
        taskState(id: $id) {
            id
            name
            complete
        }
    }
`;

export const UPDATE_TASK_STATE = gql`
    mutation UpdateTaskState($input: UpdateTaskStateInput!) {
        updateTaskState(input: $input) {
            id
        }
    }
`;

export const DELETE_TASK_STATE = gql`
    mutation DeleteTaskState($id: Int!) {
        deleteTaskState(id: $id) {
            id
        }
    }
`;

export const CHANGE_STATE_ORDER = gql`
    mutation ChangeTaskStateOrder($input: ChangeTaskStateOrderInput!) {
        changeTaskStateOrder(input: $input) {
            id
            name
            order
        }
    }
`;