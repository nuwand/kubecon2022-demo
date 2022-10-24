import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import {
    TASK_STATUS,
    useDeleteTask,
    useUpdateTask,
} from '../../data/hooks/tasks';
import deleteIcon from '../../images/Delete.svg';

import '../../styles/Tasks/TaskItem.css';
import Dropdown from '../Dropdown';
import { IconButton } from '../IconButton';

const getItemStyle = (isDragging, draggableStyle, status) => ({
    // change background colour if dragging
    background: isDragging
        ? '#CCD1F2'
        : status === TASK_STATUS.COMPLETED
        ? '#EFFDF2'
        : status === TASK_STATUS.INPROGRSS
        ? '#FFF5EB'
        : status === TASK_STATUS.OPEN && '#FCEDED',
    border: isDragging
        ? '1px solid #5567D5'
        : `1px solid ${
              status === TASK_STATUS.COMPLETED
                  ? '#BDE9D3'
                  : status === TASK_STATUS.INPROGRSS
                  ? '#FFCC8C'
                  : status === TASK_STATUS.OPEN && '#F8C2C2'
          }`,

    // styles we need to apply on draggables
    ...draggableStyle,
});

export function TaskItem(props) {
    const { task, onDelete, onUpdate, index, isMoving } = props;
    const status = task.status.toLocaleLowerCase();
    const { deleteTask, isLoading: isDeleting } = useDeleteTask();
    const { updateTask, isLoading: isUpdating } = useUpdateTask();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isPendingOperation = isMoving || isDeleting || isUpdating;
    const transitionalStates = Object.values(TASK_STATUS).filter((state) => {
        if (state === TASK_STATUS.ALL || state === status) {
            return false;
        } else {
            return true;
        }
    });
    return (
        <Draggable draggableId={`${task.id}`} index={index}>
            {(provided, snapshot) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        status
                    )}
                    className={`todo-item-li ${
                        isDrawerOpen && 'drawer-opened'
                    }`}
                >
                    {isPendingOperation && (
                        <div className="todo-item-overlay">
                            {isUpdating && `Updating . . .`}
                            {isDeleting && `Deleting . . .`}
                            {isMoving && `Moving . . .`}
                        </div>
                    )}
                    <div className="todo-item">
                        <div className="todo-item-text">
                            {status.toLocaleLowerCase() ===
                            TASK_STATUS.COMPLETED ? (
                                <s style={{ color: '#838282' }}>{task.title}</s>
                            ) : (
                                task.title
                            )}
                        </div>

                        <div className="todo-item-actions">
                            <IconButton
                                disabled={isDeleting}
                                onClick={() => {
                                    deleteTask(task, { onSuccess: onDelete });
                                }}
                                iconImage={deleteIcon}
                                alt="Delete Icon"
                            />
                            <Dropdown
                                onChange={(newState) =>
                                    updateTask(
                                        { ...task, status: newState },
                                        { onSuccess: onUpdate }
                                    )
                                }
                                values={transitionalStates}
                                onOpen={(state) => setIsDrawerOpen(state)}
                            />
                        </div>
                    </div>
                </li>
            )}
        </Draggable>
    );
}
