import ballerina/graphql;
import ballerina/http;
import ballerina/jwt;
import ballerina/lang.value;
import task_query.entity; // Use package name as given in Ballerina.toml

const USER_ID = "userId";

configurable string groupApiUrl = ?;
configurable string taskApiUrl = ?;
configurable string archiveApiUrl = ?;
configurable string accessToken = ?;

// Accessed via internal URLs given in Choreo DevOps Portal.
final entity:GroupClient groupClient = check new ({}, groupApiUrl);
final entity:TaskClient taskClient = check new ({}, taskApiUrl);
final entity:ArchiveClient archiveClient = check new ({}, archiveApiUrl);

@graphql:ServiceConfig {
    contextInit: isolated function(http:RequestContext requestContext, http:Request request)
                                    returns graphql:Context|error {

        graphql:Context context = new;

        string backendJwt = check request.getHeader("x-jwt-assertion");
        [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(backendJwt);
        string? userId = payload.sub;
        if userId == () {
            return error("Unable to read the user ID. Backend JWT did not include the claim sub");
        }

        context.set(USER_ID, userId);
        return context;
    }
}

// A GraphQL API to query tasks and groups.
service / on new graphql:Listener(4000) {

    // This resource can be queried using a query that starts as `{ group(id:1) }`.
    resource isolated function get tasks(int groupId) returns Task[]|error {
        entity:Task[] tasksByGroupId = check taskClient->getTasksByTaskGroupId(groupId.toString());
        return convertRawToSendingTaskArray(tasksByGroupId);
    }

    // This resource can be queried using a query that starts as `{ group(id:1, status:open) }`.
    resource isolated function get tasksFiltered(int groupId, string status) returns Task[]|error {
        entity:Task[] tasksArr = check taskClient->getTasksByTaskGroupId(groupId.toString());

        Task[] tasks = from entity:Task task in tasksArr
            where task.taskStatus == status
            select convertRawToSendingTask(task);
        return tasks;
    }

    // This resource can be queried using a query that starts as `{ groups { tasks } }`.
    resource isolated function get groups(graphql:Context context) returns Group[]|error {
        string extractUserResult = check extractUser(context);
        entity:GroupReturned[] groupsByUserId = check groupClient->getGroupsByUserId(extractUserResult);

        Group[] groupArray = [];
        foreach entity:GroupReturned group in groupsByUserId {
            Group groupWithTasks = new (group.id, group.title);
            groupArray.push(groupWithTasks);
        }
        return groupArray;
    }

    // This resource can be queried using a query that starts as `{ archived(id:1) }`.
    resource isolated function get archived(int groupId) returns ArchivedTask[]|error {
        entity:ArchivedTask[] tasksByGroupId = check archiveClient->getArchivedTasksByTaskGroupId((groupId.toString()));
        return convertRawToSendingArchivedArray(tasksByGroupId);
    }
}

isolated function extractUser(graphql:Context context) returns string|error {
    value:Cloneable|isolated object {} userId = check context.get(USER_ID);
    if userId is string {
        return userId;
    }
    return error("User ID has not been set to the graphql context");
}

service class Group {
    private final int id;
    private final string name;

    isolated function init(int id, string name) {
        self.id = id;
        self.name = name;
    }

    // Each resource function becomes a field of the `Person` type.
    isolated resource function get id() returns int {
        return self.id;
    }
    isolated resource function get name() returns string {
        return self.name;
    }
    isolated resource function get tasks() returns Task[]|error {
        entity:Task[] tasksRaw = check taskClient->getTasksByTaskGroupId(self.id.toString());
        return convertRawToSendingTaskArray(tasksRaw);
    }
}

isolated function convertRawToSendingTaskArray(entity:Task[] tasksRaw) returns Task[] {
    Task[] tasksToSend = [];
    foreach entity:Task taskRaw in tasksRaw {
        Task task = {
            id: taskRaw.id,
            title: taskRaw.title,
            status: taskRaw.taskStatus
        };
        tasksToSend.push(task);
    }
    return tasksToSend;
}

isolated function convertRawToSendingTask(entity:Task taskRaw) returns Task {
    Task task = {
        id: taskRaw.id,
        title: taskRaw.title,
        status: taskRaw.taskStatus
    };
    return task;
}

isolated function convertRawToSendingArchivedArray(entity:ArchivedTask[] archivedTasksRaw) returns ArchivedTask[] {
    ArchivedTask[] archivedTasksToSend = [];
    foreach entity:Task archivedTaskRaw in archivedTasksRaw {
        ArchivedTask archivedTask = {
            id: archivedTaskRaw.id,
            taskId: archivedTaskRaw.taskId,
            groupId: archivedTaskRaw.taskGroupId,
            title: archivedTaskRaw.title,
            status: archivedTaskRaw.taskStatus,
            archivedAt: archivedTaskRaw.createdAt
        };
        archivedTasksToSend.push(archivedTask);
    }
    return archivedTasksToSend;
}
