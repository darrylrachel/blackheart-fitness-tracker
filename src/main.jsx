import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './app/router';
import { RouterProvider } from 'react-router-dom';
// import router from './router';
import router from './app/router';
import './styles/tailwind.css';

console.log('🌐 App starting...');
console.log('🌐 ENV:', import.meta.env);
console.log('🌐 router:', router);
console.log('📱 main.jsx loaded');



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
