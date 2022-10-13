import ReactDOM from 'react-dom/client';
import React from 'react';

const container = document.createElement('div');
document.body.appendChild(container);

const root = ReactDOM.createRoot(container);
root.render(<h1>Hello world! </h1>);
