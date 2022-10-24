import React from 'react';
import '../../styles/LoginButton.css';

export default function LoginButton(props) {
    const { children, onLoginClick, isInProgress } = props;
    return (
        <button
            disabled={isInProgress}
            onClick={onLoginClick}
            className="login-button"
        >
            {children}
        </button>
    );
}
