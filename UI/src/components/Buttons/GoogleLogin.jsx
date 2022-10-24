import React, { useState } from 'react';
import { useAuthRequestURL } from '../../data/hooks/auth.js';
import googleLogo from '../../images/google.svg';
import LoginButton from './LoginButton';

export default function GoogleLogin() {
    const { getAuthRequestURL } = useAuthRequestURL();
    const [isInProgress, setIsInProgress] = useState(false);
    const onLoginClick = async () => {
        setIsInProgress(true);
        const loginURL = await getAuthRequestURL();
        window.location.href = loginURL;
    };
    return (
        <LoginButton isInProgress={isInProgress} onLoginClick={onLoginClick}>
            <img
                className={isInProgress ? 'gray-logo' : ''}
                src={googleLogo}
                alt="Google logo"
            />
            <div>Login with Google</div>
        </LoginButton>
    );
}
