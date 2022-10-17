import ballerina/http;

# CRUD Operations for Tasks
public isolated client class TaskClient {
    final http:Client clientEp;

    # Gets invoked to initialize the `connector`.
    #
    # + clientConfig - The configurations to be used when initializing the `connector` 
    # + serviceUrl - URL of the target service 
    # + return - An error if connector initialization failed 
    public isolated function init(http:ClientConfiguration clientConfig = {}, string serviceUrl = "http://localhost:8080/task") returns error? {
        http:Client httpEp = check new (serviceUrl, clientConfig);
        self.clientEp = httpEp;
        return;
    }

    # Retrieve tasks for a given group.
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

    # Retrieve a task by id.
    #
    # + id - Task Id 
    # + return - The task with Id 
    remote isolated function getTaskById(int id) returns Task|error {
        string resourcePath = string `/task/${getEncodedUri(id)}`;
        Task response = check self.clientEp->get(resourcePath);
        return response;
    }
}
