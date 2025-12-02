import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './components/AuthContext';  // นำเข้า AuthProvider
import { BrowserRouter as Router } from 'react-router-dom';  // นำเข้า Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>  
    <Router>  {/* ห่อหุ้ม App ด้วย Router */}
      <AuthProvider>  {/* ห่อหุ้ม App ด้วย AuthProvider */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
