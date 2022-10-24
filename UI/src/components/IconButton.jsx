import React from 'react';

import '../styles/IconButton.css';

export function IconButton(props) {
    const { disabled = false, onClick, iconImage, alt } = props;
    return (
        <button disabled={disabled} onClick={onClick} className="icon-button">
            <img width={20} height={20} alt={alt} src={iconImage}></img>
        </button>
    );
}
