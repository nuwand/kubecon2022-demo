import ballerina/http;

// -------------------------- Used by the Task Management service
public type GroupName record {
    string name;
};

public type Group record {|
    int id;
    string name;
|};

public type CreatedGroup record {|
    *http:Created;
    Group body;
|};

public type TaskModel record {|
    int groupId;
    readonly int id;
    string title;
    string status;
|};

public type TasksBody record {
    int groupId;
    string title;
};

public type CreatedTask record {|
    *http:Created;
    TaskModel body;
|};

public type TasksTaskidBody record {
    string title;
};

public type InlineResponse2001 record {
    string status?;
};

public type InlineResponse200 record {
    int groupId?;
};

public type InlineResponse2002 record {
    int id?;
    int taskId?;
    int groupId?;
    string archivedAt?;
};

public type TaskidChangegroupBody record {
    int groupId;
    int newGroupId;
};

public type TaskidChangestatusBody record {
    string status;
};

public type ConflictMessage record {|
    *http:Conflict;
    Message body;
|};

public type Message record {
    string message?;
};

public type ArchiveTasksBody record {
    int taskId;
};

public type ArchiveGroupsBody record {
    int groupId;
};

// -------------------------- Common to all the clients
public type Task record {
    int id;
    string title;
    int taskGroupId;
    string taskStatus;
    string createdAt;
    string updatedAt;
};

public type TaskStatus record {
    int id;
    string name;
    string userId;
    string createdAt;
    string updatedAt;
};

public type TaskGroup record {
    int id;
    string title;
    string userId;
    string createdAt;
    string updatedAt;
};

// -------------------------- Used by the Task client
public type TaskArr Task[];

public type TaskBody record {
    string title?;
    string taskStatus?;
    int taskGroupId?;
};

public type TaskIdBody record {
    string title?;
    string taskStatus?;
    int taskGroupId?;
};

//-- Group client

public type TaskGroupArr TaskGroup[];

public type TaskgroupBody record {
    string title?;
    string userId?;
};

public type TaskgroupIdBody record {
    string title?;
};

// -------------------------- Used by the Notification client

public type ServicesNotificationcreateresponse record {
    string _id?;
    string message?;
    boolean read?;
    string 'type?;
    string userEmail?;
};

public type MainNotificationrequest record {
    string message;
    boolean sendEmail?;
    string 'type?;
    string userEmail;
};

// -------------------------- Used by the Archive client

public type ArchivedTaskArr ArchivedTask[];

public type ArchivedTask record {
    int id;
    string userId;
    string title;
    int taskId;
    int taskGroupId;
    string taskStatus;
    string createdAt;
    string updatedAt;
};

public type ArchivedtaskBody record {
    string userId?;
    int taskId?;
    string title?;
    string taskStatus?;
    int taskGroupId?;
};
