// import { TokenExchangePlugin } from '@asgardeo/token-exchange-plugin';
import React, { useCallback, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import '../styles/App.css';
import Callback from './oauth/Callback.jsx';
import BaseLayout from '../components/BaseLayout.jsx';
import Header from '../components/Header/Header.jsx';
import Login from './login/index.jsx';
import {
    TASK_STATUS,
    useMoveTask,
    useTaskGroups,
} from '../data/hooks/tasks.js';
import Loading from '../components/Loading';
import Banner from '../components/Banner/Banner';
import TaskListScroll from '../components/Tasks/TaskListScroll';
import SearchInput from '../components/Header/SearchInput';
import FilterTasks from '../components/Header/FilterTasks';
import Protected from '../components/Protected';

function App() {
    const {
        data: groups,
        isLoading,
        error,
        setData,
        refetch,
    } = useTaskGroups();
    const { moveTask, isLoading: isMoving, data } = useMoveTask();
    const [moving, setMoving] = useState({});
    const [searchText, setSearchText] = useState('');
    const [showByStatus, setShowByStatus] = useState(TASK_STATUS.ALL);
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        const movingTaskId = parseInt(draggableId, 10);
        const sourceGroupId = parseInt(source.droppableId, 10);
        if (!destination) {
            // Dropped somewhere outside the dropable zones
            return;
        }
        const destinationGroupId = parseInt(destination.droppableId, 10);
        if (sourceGroupId === destinationGroupId) {
            // Just do nothing
            return;
        }
        const sourceTasksGroup = groups.find(
            (group) => group.id === sourceGroupId
        );
        const destinationTasksGroup = groups.find(
            (group) => group.id === destinationGroupId
        );
        const movingTask = sourceTasksGroup.tasks.find(
            (task) => task.id === movingTaskId
        );
        const onSuccess = () =>
            setMoving((currentlyMoving) => ({
                ...currentlyMoving,
                [movingTaskId]: false,
            }));
        moveTask(movingTask, destinationGroupId, sourceGroupId, { onSuccess });
        const updatedSourceTasks = sourceTasksGroup.tasks.filter(
            (task) => task.id !== movingTaskId
        );
        const updatedDestinationTasks = [
            ...destinationTasksGroup.tasks,
            movingTask,
        ];
        const updatedGroups = groups.map((group) => {
            if (group.id === sourceGroupId) {
                return { ...group, tasks: updatedSourceTasks };
            } else if (group.id === destinationGroupId) {
                return { ...group, tasks: updatedDestinationTasks };
            } else {
                return group;
            }
        });
        setData(updatedGroups);
        setMoving((currentlyMoving) => ({
            ...currentlyMoving,
            [movingTaskId]: true,
        }));
    };
    const onGroupUpdate = useCallback(
        (updater) => {
            setData((currentGroups) => {
                const [groupId, updatedTasks] = updater(currentGroups);
                let updatedGroups;
                if (updatedTasks) {
                    updatedGroups = currentGroups.map((group) => {
                        if (group.id === groupId) {
                            return { ...group, tasks: updatedTasks };
                        } else {
                            return group;
                        }
                    });
                } else {
                    updatedGroups = currentGroups.filter(
                        (group) => group.id !== groupId
                    );
                }
                return updatedGroups;
            });
        },
        [setData]
    );

    const filteredGroups = useMemo(() => {
        let updatedGroups = groups;
        if (searchText) {
            updatedGroups = groups.map((group) => {
                const filteredTasks = group.tasks.filter((task) =>
                    task.title.toLocaleLowerCase().includes(searchText)
                );
                return { ...group, tasks: filteredTasks };
            });
        }
        if (showByStatus !== TASK_STATUS.ALL) {
            updatedGroups = updatedGroups.map((group) => {
                const filteredTasks = group.tasks.filter(
                    (task) => task.status.toLocaleLowerCase() === showByStatus
                );
                return { ...group, tasks: filteredTasks };
            });
        }
        return updatedGroups;
    }, [searchText, groups, showByStatus]);

    const onGroupAdd = (newGroup) => {
        setData((currentGroups) => {
            const alreadyExist = currentGroups.find(
                (group) => group.id === newGroup.id
            );
            if (alreadyExist) {
                console.warn(`Group with ${newGroup.id} already exist!`);
                // throw new Error(`Group with ${newGroup.id} already exist!`);
            }
            return [...currentGroups, { ...newGroup, tasks: [] }];
        });
    };

    return (
        <BaseLayout header={<Header />}>
            {isLoading && (
                <div className="listing-notifications">
                    {' '}
                    <Loading />
                </div>
            )}
            {!isLoading && error && (
                <div className="listing-notifications">
                    <Banner error={error} />
                </div>
            )}
            {!isLoading && filteredGroups && (
                <div className="task-container">
                    <div className="filter-and-search">
                        <SearchInput
                            searchText={searchText}
                            setSearchText={setSearchText}
                        />
                        <FilterTasks
                            showByStatus={showByStatus}
                            setShowByStatus={setShowByStatus}
                        />
                    </div>
                    <TaskListScroll
                        onGroupAdd={onGroupAdd}
                        onDragEnd={onDragEnd}
                        onGroupUpdate={onGroupUpdate}
                        moving={moving}
                        filteredGroups={filteredGroups}
                    />
                </div>
            )}
        </BaseLayout>
    );
}

export default function Routing() {
    return (
        <Router>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => (
                        <Protected>
                            <App />
                        </Protected>
                    )}
                />
                <Route exact path="/oauth/callback" component={Callback} />
                <Route exact path="/login" component={Login} />
                <Route path="*" component={() => 'Page not found!'} />
            </Switch>
        </Router>
    );
}
