import '../styles/BaseLayout.css';

export default function BaseLayout(props) {
    const { children, header } = props;
    return (
        <main className="base-grid">
            <div className="top-bar">{header}</div>
            <div className="task-board">{children}</div>
            <div className="grid-footer">
                Powered By{' '}
                <a
                    className="footer-choreo-link"
                    target="_blank"
                    href="https://choreo.dev/"
                >
                    Choreo
                </a>
            </div>
        </main>
    );
}
