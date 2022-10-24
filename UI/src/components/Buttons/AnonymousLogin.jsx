import React from 'react';
import LoginButton from './LoginButton';

export default function AnonymousLogin() {
    const onLoginClick = () => {};
    return (
        <LoginButton isInProgress onLoginClick={onLoginClick}>
            Try Anonymously
        </LoginButton>
    );
}
