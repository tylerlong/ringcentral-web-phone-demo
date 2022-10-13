import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';

import App from './main';

const container = document.createElement('div');
document.body.appendChild(container);

const root = ReactDOM.createRoot(container);
root.render(<App />);
