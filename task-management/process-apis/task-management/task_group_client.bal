import ballerina/http;

# CRUD Operations for Tasks Group
public isolated client class GroupClient {
    final http:Client clientEp;
    # Gets invoked to initialize the `connector`.
    #
    # + clientConfig - The configurations to be used when initializing the `connector` 
    # + serviceUrl - URL of the target service 
    # + return - An error if connector initialization failed 
    public isolated function init(http:ClientConfiguration clientConfig = {}, string serviceUrl = "http://localhost:8080/taskgroup") returns error? {
        http:Client httpEp = check new (serviceUrl, clientConfig);
        self.clientEp = httpEp;
        return;
    }
    # returns task groups for a given user id
    #
    # + userId - User Id 
    # + return - list of tasks grousp belonging to the given user 
    remote isolated function getTasksGroupByUserId(string userId) returns TaskGroup[]|error {
        string resourcePath = string `/taskgroup`;
        map<anydata> queryParam = {"userId": userId};
        resourcePath = resourcePath + check getPathForQueryParam(queryParam);
        TaskGroup[] response = check self.clientEp->get(resourcePath);
        return response;
    }
    # Create a Task Group
    #
    # + payload - An example task group 
    # + return - item created 
    remote isolated function createTaskGroup(TaskgroupBody payload) returns TaskGroup|error {
        string resourcePath = string `/taskgroup`;
        http:Request request = new;
        json jsonBody = check payload.cloneWithType(json);
        request.setPayload(jsonBody, "application/json");
        TaskGroup response = check self.clientEp->post(resourcePath, request);
        return response;
    }
    # Retrieve a task group by id
    #
    # + id - Task Group Id 
    # + return - The task group with Id 
    remote isolated function getTaskGroupById(int id) returns TaskGroup|error {
        string resourcePath = string `/taskgroup/${getEncodedUri(id)}`;
        TaskGroup response = check self.clientEp->get(resourcePath);
        return response;
    }
    # Update a task group by id
    #
    # + id - Task Group Id 
    # + payload - An example task group 
    # + return - The task group with Id 
    remote isolated function updateTaskGroupById(int id, TaskgroupIdBody payload) returns TaskGroup|error {
        string resourcePath = string `/taskgroup/${getEncodedUri(id)}`;
        http:Request request = new;
        json jsonBody = check payload.cloneWithType(json);
        request.setPayload(jsonBody, "application/json");
        TaskGroup response = check self.clientEp->put(resourcePath, request);
        return response;
    }
    # Delete a task group by id
    #
    # + id - Task Group Id 
    # + return - The task group with Id 
    remote isolated function deleteTaskGroupById(int id) returns TaskGroup|error {
        string resourcePath = string `/taskgroup/${getEncodedUri(id)}`;
        TaskGroup response = check self.clientEp->delete(resourcePath);
        return response;
    }
}