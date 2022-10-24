import '../styles/Landing.css';
import AnonymousLogin from './Buttons/AnonymousLogin';
import GoogleLogin from './Buttons/GoogleLogin';
import ChoreoLogo from '../images/Choreo logo.svg';

export default function Landing() {
    return (
        <div className="landing-wrapper">
            <div className="login-card">
                <img
                    width={125}
                    height={32}
                    className="choreo-logo"
                    src={ChoreoLogo}
                    alt="Choreo Logo"
                />
                <h3>Task Manager</h3>
                <p className="login-tagline">
                    Simple task manage to organize you work and life
                </p>
                <GoogleLogin />
            </div>
        </div>
    );
}
