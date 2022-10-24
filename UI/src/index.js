import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';

import App from './pages/index';
ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root')
);
