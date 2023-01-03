import ballerina/http;

public isolated client class NotificationClient {
    final http:Client clientEp;
    
    # Gets invoked to initialize the `connector`.
    #
    # + clientConfig - The configurations to be used when initializing the `connector` 
    # + serviceUrl - URL of the target service 
    # + return - An error if connector initialization failed 
    public isolated function init(http:ClientConfiguration clientConfig =  {}, string serviceUrl = "/api/v1") returns error? {
        http:Client httpEp = check new (serviceUrl, clientConfig);
        self.clientEp = httpEp;
        return;
    }

    # Create Notification.
    #
    # + payload - data 
    # + return - Okay 
    remote isolated function postApiV1Notification(MainNotificationrequest payload) returns ServicesNotificationcreateresponse|error {
        string resourcePath = string `/api/v1/notification`;
        http:Request request = new;
        json jsonBody = check payload.cloneWithType(json);
        request.setPayload(jsonBody, "application/json");
        ServicesNotificationcreateresponse response = check self.clientEp->post(resourcePath, request);
        return response;
    }
}
