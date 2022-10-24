import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { useAddTask } from '../../data/hooks/tasks.js';

import '../../styles/Tasks/NewTask.css';

export const NewTask = forwardRef(({ onAdd, groupId }, ref) => {
    const [title, setTitle] = useState('');
    const taskInputRef = useRef();
    const { addTask, isLoading, error, data, isSuccess } = useAddTask();
    useEffect(() => {
        if (isSuccess && data) {
            onAdd(data);
            setTitle('');
            taskInputRef.current.focus();
        }
    }, [isSuccess, data]);
    function handleAddClick() {
        if (title !== '') {
            const newTask = {
                title,
                groupId,
            };
            addTask(newTask);
        }
    }

    return (
        <div ref={ref} className="new-todo">
            <input
                ref={taskInputRef}
                placeholder="Type & press `Enter`"
                disabled={isLoading}
                value={title}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleAddClick();
                    }
                }}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button
                disabled={title === '' || isLoading}
                onClick={handleAddClick}
            >
                {isLoading ? 'Adding' : 'Add'}
            </button>
        </div>
    );
});

export default NewTask;
