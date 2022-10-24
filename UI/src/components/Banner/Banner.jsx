import '../../styles/Banner/Banner.css';

export default function Banner(props) {
    const { error } = props;
    return (
        <div className="banner-container">
            <h1 className="banner-title">{error.message || 'Error!'}</h1>

            <p className="banner-text">{error.stack || ''}</p>
        </div>
    );
}
