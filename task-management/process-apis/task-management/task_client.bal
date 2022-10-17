import ballerina/http;

# CRUD Operations for Tasks
public isolated client class TaskClient {
    final http:Client clientEp;
    # Gets invoked to initialize the `connector`.
    #
    # + clientConfig - The configurations to be used when initializing the `connector` 
    # + serviceUrl - URL of the target service 
    # + return - An error if connector initialization failed 
    public isolated function init(http:ClientConfiguration clientConfig = {}, string serviceUrl = "https://virtserver.swaggerhub.com/RAMITHJ/TaskAPI/1.0.0") returns error? {
        http:Client httpEp = check new (serviceUrl, clientConfig);
        self.clientEp = httpEp;
        return;
    }
    # returns tasks for a given task group
    #
    # + taskGroupId - Task Group Id 
    # + return - list of tasks belonging to the given task group 
    remote isolated function getTasksByTaskGroupId(string taskGroupId) returns Task[]|error {
        string resourcePath = string `/task`;
        map<anydata> queryParam = {"taskGroupId": taskGroupId};
        resourcePath = resourcePath + check getPathForQueryParam(queryParam);
        Task[] response = check self.clientEp->get(resourcePath);
        return response;
    }
    # Create a Task
    #
    # + payload - An example in progress task 
    # + return - item created 
    remote isolated function createTask(TaskBody payload) returns Task|error {
        string resourcePath = string `/task`;
        http:Request request = new;
        json jsonBody = check payload.cloneWithType(json);
        request.setPayload(jsonBody, "application/json");
        Task response = check self.clientEp->post(resourcePath, request);
        return response;
    }
    # Retrieve a task by id
    #
    # + id - Task Id 
    # + return - The task with Id 
    remote isolated function getTaskById(int id) returns Task|error {
        string resourcePath = string `/task/${getEncodedUri(id)}`;
        Task response = check self.clientEp->get(resourcePath);
        return response;
    }
    # Update a task by id
    #
    # + id - Task Id 
    # + payload - An example in progress task 
    # + return - The task with Id 
    remote isolated function updateTaskById(int id, TaskIdBody payload) returns Task|error {
        string resourcePath = string `/task/${getEncodedUri(id)}`;
        http:Request request = new;
        json jsonBody = check payload.cloneWithType(json);
        request.setPayload(jsonBody, "application/json");
        Task response = check self.clientEp->put(resourcePath, request);
        return response;
    }
    # Delete a task by id
    #
    # + id - Task Id 
    # + return - The task with Id 
    remote isolated function deleteTaskById(int id) returns Task|error {
        string resourcePath = string `/task/${getEncodedUri(id)}`;
        Task response = check self.clientEp->delete(resourcePath);
        return response;
    }
    # Change a status of a task by Id
    #
    # + id - Task Id 
    # + taskStatus - New status of the task 
    # + return - changed task 
    remote isolated function changeTaskStatusByTaskId(int id, string taskStatus) returns Task|error {
        string resourcePath = string `/task/${getEncodedUri(id)}/status/${getEncodedUri(taskStatus)}`;
        http:Request request = new;
        //TODO: Update the request as needed;
        Task response = check self.clientEp->post(resourcePath, request);
        return response;
    }
    # Change a group of a task by Id
    #
    # + id - Task Id 
    # + taskGroupId - New group id of the task 
    # + return - changed task 
    remote isolated function changeTaskGroupByTaskId(int id, int taskGroupId) returns Task|error {
        string resourcePath = string `/task/${getEncodedUri(id)}/group/${getEncodedUri(taskGroupId)}`;
        http:Request request = new;
        //TODO: Update the request as needed;
        Task response = check self.clientEp->post(resourcePath, request);
        return response;
    }
}