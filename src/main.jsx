import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './app/router';
import App from '../src/app/App';
import { BrowserRouter } from 'react-router-dom';
import './styles/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);