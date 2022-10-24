import React from 'react';
import '../../styles/Callback.css';
import SuccessIcon from './../../images/success.svg';
import SpinnerIcon from './../../images/spinner.svg';

function CallbackItem({ text, status }) {
    const getStatusIcon = () => {
        if (status === 'success') {
            return (
                <div className="success-icon">
                    <img alt='success' src={SuccessIcon} />
                </div>
            );
        } else if (status === 'error') {
            return <div className="error-icon">error</div>;
        }
        return (
            <div className="spinner-icon">
                <img alt='error' src={SpinnerIcon} />
            </div>
        );
    };
    return (
        <div className="callback-item">
            <div className="callback-item-text">{text}</div>
            <div className="callback-item-icon">{getStatusIcon()}</div>
        </div>
    );
}

export default CallbackItem;
