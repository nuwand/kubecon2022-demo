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
