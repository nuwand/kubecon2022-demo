import ballerina/http;

// -- Used by service
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
    int groupId;
    int taskId;
};

public type ArchiveGroupsBody record {
    int groupId;
};

//-- Common to both clients
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

//-- Task client
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

