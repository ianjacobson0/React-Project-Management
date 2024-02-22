export const models = `
    type Project {
        id: Int!
        title: String!
        description: String
        tasks: [Task]
        taskStates: [TaskState]
        userMap: [UserProjMap]
        roles: [ProjectRole]
        org: Organization
        orgId: Int
    }

    type UserProjMap {
        id: Int!
        project: Project
        projectId: Int
        user: User
        userId: Int
        role: ProjectRole
        roleId: Int
    }

    type ProjectRole {
        id: Int!
        name: String!
        admin: Boolean!
        canEditAllTasks: Boolean!
        canEditAllStates: Boolean!
        userProjMap: [UserProjMap]
        taskPermissions: [TaskPermission]
        statePermissions: [StatePermission]
        project: Project
        projectId: Int
    }

    type TaskPermission {
        id: Int!
        access: Boolean!
        task: Task
        taskId: Int
        projectRole: ProjectRole
        projectRoleId: Int
    }

    type StatePermission {
        id: Int!
        access: Boolean!
        taskState: TaskState
        taskStateId: Int
        projectRole: ProjectRole
        projectRoleId: Int
    }

    type Task {
        id: Int!
        name: String
        description: String
        order: Int
        userTaskMap: [UserTaskMap]
        taskPermissions: [TaskPermission]
        project: Project
        projectId: Int
        taskState: TaskState
        taskStateId: Int
    }

    type TaskState {
        id: Int!
        name: String
        complete: Boolean
        order: Int
        tasks: [Task]
        statePermissions: [StatePermission]
        project: Project
        projectId: Int
    }

    type UserTaskMap {
        id: Int!
        task: Task
        taskId: Int
        user: User
        userId: Int
    }

    input CreateProjectInput {
        userId: Int!
        title: String!
        description: String
        orgId: Int!
    }

    input CreateTaskInput {
        name: String
        description: String
        taskStateId: Int!
    }

    input CreateProjectRoleInput {
        name: String!
        admin: Boolean!
        canEditAllTasks: Boolean!
        canEditAllStates: Boolean!
        projectId: Int!
    }

    input UpdateProjectInput {
        id: Int!
        title: String!
        description: String!
        orgId: Int!
    }

    input UpdateProjectRoleInput {
        id: Int!
        name: String
        admin: Boolean
        canEditAllTasks: Boolean
        canEditAllStates: Boolean
        projectId: Int
    }

    input UpdateTaskStateInput {
        id: Int!
        name: String
        complete: Boolean
    }

    input UpdateTaskInput {
        id: Int!
        name: String
        description: String
    }

    input ChangeTaskStateOrderInput {
        id: Int!
        newOrder: Int!
    }

    input ChangeTaskOrderInput {
        id: Int!
        newOrder: Int!
    }

    input ChangeTaskStateInput {
        id: Int!
        taskStateId: Int!
    }

    input CreateTaskPermissionInput {
        access: Boolean!
        taskId: Int!
        projectRoleId: Int!
    }

    input CreateTaskStateInput {
        projectId: Int!
        name: String!
        complete: Boolean!
    }

    input CreateUserProjMapInput {
        projectId: Int
        userId: Int
        roleId: Int
    }

    type Query {
        project(id: Int!): Project
        checkProjectByUserId(id: Int!): [Project]
        taskStates(projectId: Int!): [TaskState]
        taskState(id: Int!): TaskState
        projectRolesByProjectId(id: Int!): [ProjectRole]
        projectRole(id: Int!): ProjectRole
        projectsByOrgIdAndUserId(userId: Int!, orgId: Int!): [Project]
        tasks(stateId: Int!): [Task]
    }

    type Mutation {
        createProject(input: CreateProjectInput!): Project
        createTask(input: CreateTaskInput!): Task
        createProjectRole(input: CreateProjectRoleInput!): ProjectRole
        createTaskPermission(input: CreateTaskPermissionInput!): TaskPermission
        createTaskState(input: CreateTaskStateInput!): TaskState
        createUserProjMap(input: CreateUserProjMapInput!): UserProjMap!
        updateProject(input: UpdateProjectInput!): Project
        updateProjectRole(input: UpdateProjectRoleInput!): ProjectRole
        updateTaskState(input: UpdateTaskStateInput!): TaskState
        updateTask(input: UpdateTaskInput!): Task
        changeTaskState(input: ChangeTaskStateInput!): Task
        changeTaskStateOrder(input: ChangeTaskStateOrderInput!): TaskState
        changeTaskOrder(input: ChangeTaskOrderInput!): Task
        deleteProjectRole(id: Int!): ProjectRole
        deleteTaskState(id: Int!): TaskState
        deleteTask(id: Int!): Task
    }
`