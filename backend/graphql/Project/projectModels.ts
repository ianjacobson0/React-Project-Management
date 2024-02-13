export const models = `
    type Project {
        id: ID
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
        id: ID
        project: Project
        projectId: Int
        user: User
        userId: Int
        role: ProjectRole
        roleId: Int
    }

    type ProjectRole {
        id: ID
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
        id: ID
        access: Boolean!
        task: Task
        taskId: Int
        projectRole: ProjectRole
        projectRoleId: Int
    }

    type StatePermission {
        id: ID
        access: Boolean!
        taskState: TaskState
        taskStateId: Int
        projectRole: ProjectRole
        projectRoleId: Int
    }

    type Task {
        id: ID
        name: String!
        description: String!
        userTaskMap: [UserTaskMap]!
        taskPermissions: [TaskPermission]!
        project: Project
        projectId: Int
        taskState: TaskState
        taskStateId: Int
    }

    type TaskState {
        id: ID
        name: String!
        complete: Boolean!
        tasks: [Task]
        statePermissions: [StatePermission]
        project: Project
        projectId: Int
    }

    type UserTaskMap {
        id: ID!
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
        name: String!
        description: String!
        projectId: Int!
    }

    input CreateProjectRoleInput {
        name: String!
        admin: Boolean!
        canEditAllTasks: Boolean!
        canEditAllStates: Boolean!
        projectId: Int!
    }

    input UpdateProjectRoleInput {
        id: Int!
        name: String
        admin: Boolean
        canEditAllTasks: Boolean
        canEditAllStates: Boolean
        projectId: Int
    }

    input CreateTaskPermissionInput {
        access: Boolean!
        taskId: Int!
        projectRoleId: Int!
    }

    input CreateUserProjMapInput {
        projectId: Int
        userId: Int
        roleId: Int
    }

    type Query {
        checkProjectByUserId(id: Int!): [Project]
        projectRolesByProjectId(id: Int!): [ProjectRole]
        projectRole(id: Int!): ProjectRole
    }

    type Mutation {
        createProject(input: CreateProjectInput!): Project
        createTask(input: CreateTaskInput!): Task
        createProjectRole(input: CreateProjectRoleInput!): ProjectRole
        createTaskPermission(input: CreateTaskPermissionInput!): TaskPermission
        createUserProjMap(input: CreateUserProjMapInput!): UserProjMap!
        deleteProjectRole(id: Int!): ProjectRole
        updateProjectRole(input: UpdateProjectRoleInput!): ProjectRole
    }
`