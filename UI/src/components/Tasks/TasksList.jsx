import React, { useState } from 'react';

import { TaskItem } from './TaskItem';
import refreshButton from '../../images/no-task.svg';
import { IconButton } from '../IconButton';
import { Droppable } from 'react-beautiful-dnd';
import '../../styles/Tasks/TasksList.css';
import { getActiveTasks } from '../../data/utils/tasks';

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? '#e5e5e5a1' : 'white',
    borderRadius: '0.25rem',
    paddingBottom: '2rem',
});

const TasksList = (props) => {
    const { tasks, onDelete, onUpdate, groupId, movingTasks } = props;
    const [showActive, setShowActive] = useState(false);
    const sortedByStatus = tasks.sort((a, b) =>
        b.status.localeCompare(a.status)
    );
    const visibleTasks = getActiveTasks(sortedByStatus, showActive);
    const inputID = `show-only-active-todos-${groupId}`;
    return (
        <div className="todo-list">
            <div className="todo-list-container">
                <Droppable droppableId={`${groupId}`}>
                    {(provided, snapshot) => (
                        <>
                            {visibleTasks.length === 0 ? (
                                <div
                                    style={getListStyle(
                                        snapshot.isDraggingOver
                                    )}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="no-tasks"
                                >
                                    <img
                                        width={301}
                                        height={201}
                                        alt="No tasks"
                                        src={refreshButton}
                                    />
                                    <span>No tasks available.</span>
                                </div>
                            ) : (
                                <ul
                                    ref={provided.innerRef}
                                    style={getListStyle(
                                        snapshot.isDraggingOver
                                    )}
                                    {...provided.droppableProps}
                                    className="task-list-ul"
                                >
                                    {visibleTasks.map((task, index) => (
                                        <TaskItem
                                            isMoving={movingTasks[task.id]}
                                            index={index}
                                            onUpdate={onUpdate}
                                            groupId={groupId}
                                            onDelete={onDelete}
                                            key={task.id}
                                            task={task}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </>
                    )}
                </Droppable>
            </div>
            {tasks.length !== 0 && (
                <div className="todo-actions">
                    <div className="active-selector">
                        <input
                            id={inputID}
                            type="checkbox"
                            className="show-only-active"
                            checked={showActive}
                            onChange={(e) => setShowActive(e.target.checked)}
                        />
                        <label htmlFor={inputID}>Show only active tasks</label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksList;
