import '../../styles/Header/SearchInput.css';

export default function SearchInput(props) {
    const { searchText, setSearchText } = props;
    return (
        <div className="search-container">
            <input
                autoFocus
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="search"
                placeholder="Search tasks"
                aria-label="Search tasks"
            />
        </div>
    );
}
