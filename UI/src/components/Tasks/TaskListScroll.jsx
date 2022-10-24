import NewTaskGroup from './NewTaskGroup';
import TasksGroup from './TasksGroup';
import { useOnScreen } from '../../data/hooks/utils';
import { DragDropContext } from 'react-beautiful-dnd';
import { useRef } from 'react';
import ChevronRight from '../../images/right.svg';
import ChevronLeft from '../../images/left.svg';

const TaskListScroll = (props) => {
    const { filteredGroups, moving, onDragEnd, onGroupUpdate, onGroupAdd } =
        props;
    const leftRef = useRef();
    const rightRef = useRef();
    const isLeft = useOnScreen(leftRef);
    const isRight = useOnScreen(rightRef);

    return (
        <>
            {!isLeft && (
                <div className="scroller-button scroller-button-left">
                    <button
                        onClick={() =>
                            leftRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'end',
                                inline: 'nearest',
                            })
                        }
                    >
                        <img alt='Scroll to left' width={34} height={34} src={ChevronLeft} />
                    </button>
                </div>
            )}
            {!isRight && (
                <div className="scroller-button scroller-button-right">
                    <button
                        onClick={() =>
                            rightRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'end',
                                inline: 'nearest',
                            })
                        }
                    >
                        <img alt='Scroll to right' width={34} height={34} src={ChevronRight} />
                    </button>
                </div>
            )}
            <div
                className={`task-list-container ${
                    !isLeft && isRight && 'left-shadow'
                } ${!isRight && isLeft && 'right-shadow'} ${
                    !isRight && !isLeft && 'left-right-shadow'
                }`}
            >
                <div ref={leftRef}></div>
                <DragDropContext onDragEnd={onDragEnd}>
                    {filteredGroups.map((group) => (
                        <TasksGroup
                            movingTasks={moving}
                            onGroupUpdate={onGroupUpdate}
                            key={group.id}
                            group={group}
                        />
                    ))}
                </DragDropContext>
                <NewTaskGroup onGroupAdd={onGroupAdd} />
                <div ref={rightRef}></div>
            </div>
        </>
    );
};

export default TaskListScroll;
