import ballerina/http;

# Query Operations for Archived Tasks API
public isolated client class ArchiveClient {
    final http:Client clientEp;

    # Get invoked to initialize the `connector`.
    #
    # + clientConfig - The configurations to be used when initializing the `connector` 
    # + serviceUrl - URL of the target service 
    # + return - An error if connector initialization failed 
    public isolated function init(http:ClientConfiguration clientConfig =  {}, string serviceUrl = "http://localhost:8080/archivedtask") returns error? {
        http:Client httpEp = check new (serviceUrl, clientConfig);
        self.clientEp = httpEp;
        return;
    }

    # Retrieve archived tasks for a given task group.
    #
    # + taskGroupId - Task Group Id 
    # + return - The list of archived tasks belonging to the given task group 
    remote isolated function getArchivedTasksByTaskGroupId(string taskGroupId) returns ArchivedTask[]|error {
        string resourcePath = string `/archivedtask`;
        map<anydata> queryParam = {"taskGroupId": taskGroupId};
        resourcePath = resourcePath + check getPathForQueryParam(queryParam);
        ArchivedTask[] response = check self.clientEp->get(resourcePath);
        return response;
    }

    # Retrieve a archived task by id.
    #
    # + id - Archived Task Id 
    # + return - The archived task with Id 
    remote isolated function getArchivedTaskById(int id) returns ArchivedTask|error {
        string resourcePath = string `/archivedtask/${getEncodedUri(id)}`;
        ArchivedTask response = check self.clientEp->get(resourcePath);
        return response;
    }
}
