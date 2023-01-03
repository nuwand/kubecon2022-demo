// Types used by clients
public type GroupReturned record {
    int id;
    string title;
    string userId;
    string createdAt;
    string updatedAt;
};

public type Task record {
    int id;
    string title;
    int taskGroupId;
    string taskStatus;
    string createdAt;
    string updatedAt;
};

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
