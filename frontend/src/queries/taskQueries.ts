import { gql } from "@apollo/client";

export const QUERY_TASKS = gql`
    query QueryTasks($stateId: Int!) {
        tasks(stateId: $stateId) {
            id
            name
            description
            order
            taskStateId
        }
    }
`;

export const CREATE_TASK = gql`
    mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            id
        }
    }
`;

export const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
        deleteTask(id: $id) {
            id
        }
    }
`;

export const UPDATE_TASK = gql`
    mutation UpdateTask($input: UpdateTaskInput!) {
        updateTask(input: $input) {
            id
        }
    }
`;

export const CHANGE_TASK_ORDER = gql`
    mutation ChangeTaskOrder($input: ChangeTaskOrderInput!) {
        changeTaskOrder(input: $input) {
            id
        }
    }
`;

export const CHANGE_TASK_STATE = gql`
    mutation ChangeTaskState($input: ChangeTaskStateInput!) {
        changeTaskState(input: $input) {
            id
        }
    }
`;