import ballerina/graphql;
import task_query.entity; // Use package name as given in Ballerina.toml

configurable string groupApiUrl = ?;
configurable string taskApiUrl = ?;
configurable string accessToken = ?;

final entity:GroupClient groupClient = check new ({auth: {token: accessToken}}, groupApiUrl);
final entity:TaskClient taskClient = check new ({auth: {token: accessToken}}, taskApiUrl);

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
    resource isolated function get groups() returns Group[]|error {
        string extractUserResult = extractUser("jwt");
        entity:GroupReturned[] groupsByUserId = check groupClient->getGroupsByUserId(extractUserResult);

        Group[] groupArray = [];
        foreach entity:GroupReturned group in groupsByUserId {

            Group groupWithTasks = new (group.id, group.title);

            groupArray.push(groupWithTasks);
        }
        return groupArray;
    }
}

isolated function extractUser(string taskAppUserToken) returns string {
    return "user@gmail.com";
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
