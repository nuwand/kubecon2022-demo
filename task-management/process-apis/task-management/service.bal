import ballerina/http;

configurable string groupApiUrl = ?;
configurable string taskApiUrl = ?;
configurable string accessToken = ?;

final GroupClient groupClient = check new ({ auth: { token: accessToken }}, groupApiUrl);
final TaskClient taskClient = check new ({ auth: { token: accessToken }}, taskApiUrl);

service / on new http:Listener(9090) {

    # Create new task
    # 
    # + payload - Title and the group of the task to be created
    # + return  - Created task
    resource function post tasks(@http:Payload TasksBody payload) returns CreatedTask|error {
        TaskBody taskBody = {
            title: payload.title,
            taskGroupId: payload.groupId
        };
        Task task = check taskClient->createTask(taskBody);
        return {
            body: {
                id: task.id,
                title: task.title,
                groupId: task.taskGroupId,
                status: task.taskStatus
            }
        };
    }

    # Update task
    # 
    # + payload - Task title to be updated into 
    # + return  - Updated task
    resource function patch tasks/[string taskId](@http:Payload TasksTaskidBody payload) returns TaskModel|error {
        int id = check int:fromString(taskId);
        Task taskById = check taskClient->getTaskById(id);

        TaskIdBody taskIdBody = {
            title: payload.title,
            taskGroupId: taskById.taskGroupId,
            taskStatus: taskById.taskStatus
        };
        Task taskByIdResult = check taskClient->updateTaskById(id, taskIdBody);
        return {
            id: taskByIdResult.id,
            title: taskByIdResult.title,
            groupId: taskByIdResult.taskGroupId,
            status: taskByIdResult.taskStatus
        };
    }

    # Delete task
    # 
    # + return - Deleted task
    resource function delete tasks/[string taskId]() returns TaskModel|error {
        int id = check int:fromString(taskId);
        Task taskById = check taskClient->deleteTaskById(id);
        return {
            id: taskById.id,
            title: taskById.title,
            groupId: taskById.taskGroupId,
            status: taskById.taskStatus
        };
    }

    # Change group
    # 
    # + payload - Current group id (for validation) and the new group id
    # + return - Content of the task after changing the group
    resource function post tasks/[string taskId]/'change\-group(@http:Payload TaskidChangegroupBody payload)
    returns InlineResponse200|ConflictMessage|error {

        int id = check int:fromString(taskId);
        Task taskById = check taskClient->getTaskById(id);
        if (payload.groupId != taskById.taskGroupId) {
            ConflictMessage errorMsg = {
                body: {
                    message: "The task to be updated does not belong to the group provided"
                }
            };
            return errorMsg;
        }

        TaskIdBody taskIdBody = {
            title: taskById.title,
            taskGroupId: payload.newGroupId,
            taskStatus: taskById.taskStatus
        };
        Task taskByIdResult = check taskClient->updateTaskById(id, taskIdBody);
        return {
            groupId: taskByIdResult.taskGroupId
        };
    }

    # Change status
    # 
    # + payload - New status of the task
    # + return - Content of the task after updating the task status
    resource function post tasks/[string taskId]/'change\-status(@http:Payload TaskidChangestatusBody payload)
    returns InlineResponse2001|ConflictMessage|error {
        int id = check int:fromString(taskId);
        Task taskById = check taskClient->getTaskById(id);
        if (payload.status == taskById.taskStatus) {
            ConflictMessage errorMsg = {
                body: {
                    message: "The task is already in the provided status"
                }
            };
            return errorMsg;
        }

        TaskIdBody taskIdBody = {
            title: taskById.title,
            taskGroupId: taskById.taskGroupId,
            taskStatus: payload.status
        };
        Task taskByIdResult = check taskClient->updateTaskById(id, taskIdBody);
        return {
            status: taskByIdResult.taskStatus
        };
    }

    # Create group
    # 
    # + payload - Title of the group to be created
    # + return  - Created group
    resource function post groups(@http:Payload GroupName payload) returns CreatedGroup|error {
        TaskgroupBody taskgroupBody = {
            title: payload.name,
            userId: extractUser("")
        };
        TaskGroup taskGroup = check groupClient->createTaskGroup(taskgroupBody);
        return {
            body: {
                id: taskGroup.id,
                name: <string>taskGroup.title
            }
        };
    }

    # Update group
    # 
    # + payload - Title of the group to be updated
    # + return  - Updated group
    resource function put groups/[string groupId](@http:Payload GroupName payload) returns Group|error {
        int id = check int:fromString(groupId);
        TaskgroupIdBody taskgroupIdBody = {
            title: payload.name
        };
        TaskGroup taskGroupById = check groupClient->updateTaskGroupById(id, taskgroupIdBody);
        return {
            id: taskGroupById.id,
            name: <string>taskGroupById.title
        };
    }

    # Delete group
    # 
    # + return - Deleted task
    resource function delete groups/[string groupId]() returns Group|error {
        int id = check int:fromString(groupId);
        TaskGroup taskGroup = check groupClient->deleteTaskGroupById(id);
        return {
            id: taskGroup.id,
            name: <string>taskGroup.title
        };
    }

    # Archive task
    # 
    # + payload - Task id and group id of the task to be archived
    # + return  - Ok 200
    resource function post archive/tasks(@http:Payload ArchiveTasksBody payload) returns http:Ok {
        return http:OK;
    }

    # Archive task
    # 
    # + payload - Id of the group to be archived
    # + return  - Ok 200
    resource function post archive/groups(@http:Payload ArchiveGroupsBody payload) returns http:Ok {
        return http:OK;
    }
}

isolated function extractUser(string taskAppUserToken) returns string {
    return "user@gmail.com";
}

