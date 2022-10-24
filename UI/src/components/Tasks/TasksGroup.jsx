import React, { useMemo, useState } from 'react';
import NewTask from './NewTask';
import TasksList from './TasksList';

import '../../styles/Tasks/TasksGroup.css';
import EditGroupIcon from '../../images/edit-group.svg';
import DeleteGroupIcon from '../../images/delete-group.svg';

import Dropdown from '../Dropdown';
import { useDeleteGroup } from '../../data/hooks/groups';

export const GROUP_ACTIONS = {
    EDIT: 'edit',
    DELETE: 'delete',
};

function TasksGroup(props) {
    const { group, onGroupUpdate, movingTasks } = props;
    const { id, name } = group;
    const { tasks } = group;
    const { deleteGroup } = useDeleteGroup();
    const [isEditing, setIsEditing] = useState(false);
    const [groupError, setGroupError] = useState(null);
    const onDelete = (deletedTask) => {
        onGroupUpdate((currentGroups) => {
            const currentTasks = currentGroups.find(
                (group) => group.id === id
            ).tasks;
            const updatedTasks = currentTasks.filter(
                (task) => task.id !== deletedTask.id
            );
            return [id, updatedTasks];
        });
    };
    const onUpdate = (updatedTask) => {
        onGroupUpdate((currentGroups) => {
            const currentTasks = currentGroups.find(
                (group) => group.id === id
            ).tasks;
            const updatedTasks = currentTasks.map((task) => {
                if (task.id === updatedTask.id) {
                    return updatedTask;
                } else {
                    return { ...task };
                }
            });
            return [id, updatedTasks];
        });
    };
    const onAdd = (newTask) => {
        onGroupUpdate((currentGroups) => {
            const currentTasks = currentGroups.find(
                (group) => group.id === id
            ).tasks;
            return [id, [...currentTasks, newTask]];
        });
    };

    const onGroupDelete = (deletedGroupId) => {
        onGroupUpdate(() => [deletedGroupId]);
    };

    const handleGroupUpdate = (selection) => {
        setIsEditing(true);
        if (selection === GROUP_ACTIONS.DELETE) {
            const numberOfTask = tasks.length;
            if (numberOfTask > 0) {
                setGroupError("Can't delete a group with tasks");
                setIsEditing(false);
            } else {
                deleteGroup(group.id, { onSuccess: onGroupDelete });
            }
        }
        if (selection === GROUP_ACTIONS.EDIT) {
        }
    };
    const isMutable = useMemo(() => {
        return ![
            'urgent and important',
            'urgent, not important',
            'important, not urgent',
            'not urgent and not important',
        ].includes(name.toLocaleLowerCase());
    }, []);
    return (
        <div className="task-group-container">
            {isEditing && (
                <div className="group-deleting-overlay">Deleting . . .</div>
            )}
            {groupError && (
                <div className="group-deleting-overlay">
                    {groupError}{' '}
                    <button onClick={() => setGroupError(null)}>ok</button>
                </div>
            )}
            <div className="group-header">
                <div className="group-header-content">
                    <h5 className="task-group-name">{name}</h5>
                </div>
                {isMutable && (
                    <Dropdown horizontal>
                        <a
                            onClick={() =>
                                handleGroupUpdate(GROUP_ACTIONS.EDIT)
                            }
                        >
                            <img
                                src={EditGroupIcon}
                                alt="Edit group"
                                width={16}
                            />
                            <span>Edit</span>
                        </a>
                        <a
                            onClick={() =>
                                handleGroupUpdate(GROUP_ACTIONS.DELETE)
                            }
                        >
                            <img
                                src={DeleteGroupIcon}
                                alt="Delete group"
                                width={16}
                            />
                            <span className="delete-action">Delete</span>
                        </a>
                    </Dropdown>
                )}
            </div>
            <div className="new-todo-layout">
                <NewTask groupId={id} onAdd={onAdd} />
            </div>
            <TasksList
                movingTasks={movingTasks}
                groupId={id}
                onUpdate={onUpdate}
                onDelete={onDelete}
                tasks={tasks}
            />
        </div>
    );
}

export default React.memo(TasksGroup);
