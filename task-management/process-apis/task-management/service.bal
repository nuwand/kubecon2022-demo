import ballerina/log;
import ballerina/http;
import ballerina/jwt;

const string BACKEND_JWT_HEADER_KEY = "x-jwt-assertion";
const string OPEN_STATE = "open";

// Asgardeo user attributes. 
// More info: https://wso2.com/asgardeo/docs/guides/users/attributes/manage-attributes
const string USER_ATTRIBUTE_EMAIL = "http://wso2.org/claims/emailaddress";
const string USER_ATTRIBUTE_GIVEN_NAME = "http://wso2.org/claims/givenname";

configurable string groupApiUrl = ?;
configurable string taskApiUrl = ?;
configurable string archiveApiUrl = ?;
configurable string notificationUrl = ?;
configurable string accessToken = ?;

// Accessed via internal URLs given in Choreo DevOps Portal.
final GroupClient groupClient = check new ({}, groupApiUrl);
final TaskClient taskClient = check new ({}, taskApiUrl);
final ArchiveClient archiveClient = check new ({}, archiveApiUrl);

// Accessed via public URLs using an access token generated from Choreo Developer Portal.
final NotificationClient notificationClient = check new ({auth: {token: accessToken}}, notificationUrl);

service / on new http:Listener(9090) {

    # Create new task.
    #
    # + payload - Title and the group of the task to be created
    # + return - Created task
    resource function post tasks(@http:Payload TasksBody payload) returns CreatedTask|error {
        TaskBody taskBody = {
            title: payload.title,
            taskStatus: OPEN_STATE,
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

    # Update task.
    #
    # + payload - Task title to be updated into 
    # + return - Updated task
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

    # Delete task.
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

    # Change group.
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

    # Change status.
    #
    # + payload - New status of the task. Ex: { "status" : "in-progress" }
    # + return - Content of the task after updating the task status
    resource function post tasks/[string taskId]/'change\-status(@http:Payload TaskidChangestatusBody payload,
    http:Request request) returns InlineResponse2001|ConflictMessage|error {

        string newStatus = payload.status;
        int id = check int:fromString(taskId);

        Task taskById = check taskClient->getTaskById(id);
        string taskTitle = taskById.title;
        int taskGroupId = taskById.taskGroupId;
        string originalStatus = taskById.taskStatus;

        if (newStatus == originalStatus) {
            ConflictMessage errorMsg = {
                body: {
                    message: string `The task ${taskTitle} in group ID ${taskGroupId} is already in the provided status`
                }
            };
            return errorMsg;
        }

        TaskIdBody taskIdBody = {
            title: taskTitle,
            taskGroupId: taskGroupId,
            taskStatus: newStatus
        };
        Task taskByIdResult = check taskClient->updateTaskById(id, taskIdBody);

        // Send an email notification only if the task was re-opened.
        if newStatus == OPEN_STATE {
            [string, string]|error extractedEmailAndGivenName = extractEmailAndGivenName(request);
            if extractedEmailAndGivenName is string[] {
                [string, string] [email, name] = extractedEmailAndGivenName;

                string msg = string `Hi ${name}, The task "${taskTitle}" that was in "${originalStatus}" status has been reopened.`;
                MainNotificationrequest notification = {
                    sendEmail: true,
                    userEmail: email,
                    'type: "info",
                    message: msg
                };
                ServicesNotificationcreateresponse|error postApiV1Notification =
                notificationClient->postApiV1Notification(notification);

                if postApiV1Notification is ServicesNotificationcreateresponse {
                    string successLogMsg = string `Email notification sent to ${email} for task ${taskTitle}`;
                    log:printInfo(successLogMsg);
                } else {
                    log:printError("Could not send a notification for the reopened task. Error while invoking" +
                    " the notification API.", postApiV1Notification, taskId = id, taskTitle = taskTitle);
                }
            } else {
                log:printError("Error while extracting user info from the backend JWT. Will not be sending an email" +
                " notification for the reopened task.", extractedEmailAndGivenName, taskId = id, taskTitle = taskTitle);
            }
        }

        return {
            status: taskByIdResult.taskStatus
        };
    }

    # Create group.
    #
    # + payload - Title of the group to be created. Ex: { "name" : "Urgent and Important" }
    # + return - Created group
    resource function post groups(@http:Payload GroupName payload, http:Request request) returns CreatedGroup|error {
        string userId = check extractUser(request);
        TaskgroupBody taskgroupBody = {
            title: payload.name,
            userId: userId
        };
        TaskGroup taskGroup = check groupClient->createTaskGroup(taskgroupBody);
        return {
            body: {
                id: taskGroup.id,
                name: <string>taskGroup.title
            }
        };
    }

    # Update group.
    #
    # + payload - Title of the group to be updated
    # + return - Updated group
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

    # Delete group.
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

    # Archive task.
    #
    # + payload - Task id of the task to be archived. Ex: { "taskId" : 123 }
    # + return - Info about the archived task after archiving. 
    resource function post archive/tasks(@http:Payload ArchiveTasksBody payload, http:Request request) returns InlineResponse2002|error {
        string userId = check extractUser(request);
        int taskId = payload.taskId;

        Task taskById = check taskClient->getTaskById(taskId);

        ArchivedtaskBody taskToArchive = {
          userId,
          taskId,
          taskGroupId: taskById.taskGroupId,
          title: taskById.title,
          taskStatus: taskById.taskStatus
        };
        ArchivedTask archivedTask = check archiveClient->createArchivedTask(taskToArchive);

        do {
          _ = check taskClient->deleteTaskById(taskId);
        }
        on fail {
          log:printError("An error occured while archiving the task. Unable to delete the archived task from"+
          " the unarchived collection. Rolling back the archive operation");

          ArchivedTask|error archivedTaskById = archiveClient->deleteArchivedTaskById(archivedTask.id);
          if archivedTaskById is ArchivedTask {
            log:printInfo("Successfully rolled back the archive operation");
            return error("Error while deleting the archived task from the unarchived task collection. "+
              "The archive operation has been rolled back");
          } else {
            log:printError("Error while rolling back the archive operation");
            return error("An error occured while archiving the task. Although the task has been archived,"+
            " unable to delete from the unarchived task collection. Please delete the duplicate task that"+
            " is present in the Unarchived section.");
          }
        }
        InlineResponse2002 archivedTaskResponse = {
          id: archivedTask.id,
          taskId: archivedTask.taskId,
          groupId: archivedTask.taskGroupId,
          archivedAt: archivedTask.createdAt
        };
        return archivedTaskResponse;
    }

    # Archive group.
    #
    # + payload - Id of the group to be archived
    # + return - Ok 200
    resource function post archive/groups(@http:Payload ArchiveGroupsBody payload) returns http:Ok {
        return http:OK;
    }
}

isolated function extractUser(http:Request request) returns string|error {
    string jwtHeader = check request.getHeader(BACKEND_JWT_HEADER_KEY);
    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwtHeader);
    string? userId = payload.sub;
    if userId == () {
        return error("Unable to read the user ID. Backend JWT did not include the claim sub");
    }
    return userId;
}

isolated function extractEmailAndGivenName(http:Request request) returns [string, string]|error {
    string jwtHeader = check request.getHeader(BACKEND_JWT_HEADER_KEY);
    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwtHeader);
    var emailVar = payload[USER_ATTRIBUTE_EMAIL];
    if emailVar == () {
        return error("Error while extracting the user email from the Backend JWT. " +
    "The claim " + USER_ATTRIBUTE_EMAIL + " is not present.");
    }
    var givenNameVar = payload[USER_ATTRIBUTE_GIVEN_NAME];
    if givenNameVar == () {
        return error("Error while extracting the name of the user from the Backend JWT. " +
    "The claim " + USER_ATTRIBUTE_GIVEN_NAME + " is not present");
    }

    string email = <string>emailVar;
    string givenName = <string>givenNameVar;
    return [email, givenName];
}
