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
