export function getActiveTasks(tasks, showActive) {
    const activeTasks = tasks.filter((task) => task.status !== 'complete');
    const visibleTasks = showActive ? activeTasks : tasks;
    return visibleTasks;
}
