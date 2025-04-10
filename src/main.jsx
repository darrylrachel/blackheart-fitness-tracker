import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './app/router';
import './styles/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);