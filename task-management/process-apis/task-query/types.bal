public type Task record {|
    readonly int id;
    string title;
    string status;
|};

public type GroupWithTasks record {|
    int id;
    string name;
    Task[] tasks;
|};

public type ArchivedTask record {
    int id;
    int taskId;
    int groupId;
    string title;
    string status;
    string archivedAt;
};
