import '../../styles/Header/Header.css';
import AvatarMenu from './AvatarMenu';
import logo from '../../images/logo.svg';

export default function Header(props) {
    return (
        <div className="header-container">
            <div className="header-left">
                <div className="choreo-logo-container">
                    <img
                        width={33}
                        height={24}
                        className="choreo-logo"
                        src={logo}
                        alt="Choreo Logo"
                    />
                </div>
                <h4>Todo Dashboard</h4>
            </div>
            <div className="header-right">
                <AvatarMenu />
            </div>
        </div>
    );
}
