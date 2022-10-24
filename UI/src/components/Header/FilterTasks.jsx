import { TASK_STATUS } from '../../data/hooks/tasks';
import '../../styles/FilterTasks.css';
export default function FilterTasks(props) {
    const { showByStatus, setShowByStatus } = props;
    return (
        <div className="filter-container">
            <select
                className="drop-down"
                value={showByStatus}
                onChange={(e) => setShowByStatus(e.target.value)}
                name="filter-by-status"
                id="filter-by-status"
            >
                <option value={TASK_STATUS.ALL}>Show all tasks</option>
                <option value={TASK_STATUS.COMPLETED}>Completed</option>
                <option value={TASK_STATUS.INPROGRSS}>In Progress</option>
                <option value={TASK_STATUS.OPEN}>Open</option>
            </select>
        </div>
    );
}
