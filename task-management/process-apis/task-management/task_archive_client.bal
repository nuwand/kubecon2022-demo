import ballerina/http;

# CRUD Operations for Archived Tasks
public isolated client class ArchiveClient {
    final http:Client clientEp;
    # Gets invoked to initialize the `connector`.
    #
    # + clientConfig - The configurations to be used when initializing the `connector` 
    # + serviceUrl - URL of the target service 
    # + return - An error if connector initialization failed 
    public isolated function init(http:ClientConfiguration clientConfig =  {}, string serviceUrl = "http://localhost:8080/archivedtask") returns error? {
        http:Client httpEp = check new (serviceUrl, clientConfig);
        self.clientEp = httpEp;
        return;
    }
    # returns archived tasks for a given task group
    #
    # + taskGroupId - Task Group Id 
    # + return - list of archived tasks belonging to the given task group 
    remote isolated function getArchivedTasksByTaskGroupId(string taskGroupId) returns ArchivedTask[]|error {
        string resourcePath = string `/archivedtask`;
        map<anydata> queryParam = {"taskGroupId": taskGroupId};
        resourcePath = resourcePath + check getPathForQueryParam(queryParam);
        ArchivedTask[] response = check self.clientEp->get(resourcePath);
        return response;
    }
    # Create a Archived Task
    #
    # + payload - An example in progress task 
    # + return - item created 
    remote isolated function createArchivedTask(ArchivedtaskBody payload) returns ArchivedTask|error {
        string resourcePath = string `/archivedtask`;
        http:Request request = new;
        json jsonBody = check payload.cloneWithType(json);
        request.setPayload(jsonBody, "application/json");
        ArchivedTask response = check self.clientEp->post(resourcePath, request);
        return response;
    }
    # Retrieve a archived task by id
    #
    # + id - Archived Task Id 
    # + return - The archived task with Id 
    remote isolated function getArchivedTaskById(int id) returns ArchivedTask|error {
        string resourcePath = string `/archivedtask/${getEncodedUri(id)}`;
        ArchivedTask response = check self.clientEp->get(resourcePath);
        return response;
    }
    # Delete an archived task by id
    #
    # + id - Archived task Id 
    # + return - The archived task with Id 
    remote isolated function deleteArchivedTaskById(int id) returns ArchivedTask|error {
        string resourcePath = string `/archivedtask/${getEncodedUri(id)}`;
        ArchivedTask response = check self.clientEp-> delete(resourcePath);
        return response;
    }
}
