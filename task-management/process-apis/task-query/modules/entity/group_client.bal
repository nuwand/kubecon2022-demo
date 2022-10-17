import ballerina/http;

# Query Operations for Group API
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

    # Retrieve groups for a given user id
    #
    # + userId - User Id 
    # + return - list of groups belonging to the given user 
    remote isolated function getGroupsByUserId(string userId) returns GroupReturned[]|error {
        string resourcePath = string `/taskgroup`;
        map<anydata> queryParam = {"userId": userId};
        resourcePath = resourcePath + check getPathForQueryParam(queryParam);
        GroupReturned[] response = check self.clientEp->get(resourcePath);
        return response;
    }

    # Retrieve a group by id
    #
    # + id - Task Group Id 
    # + return - The task group with Id 
    remote isolated function getGroupByGroupId(int id) returns GroupReturned|error {
        string resourcePath = string `/taskgroup/${getEncodedUri(id)}`;
        GroupReturned response = check self.clientEp->get(resourcePath);
        return response;
    }

}
