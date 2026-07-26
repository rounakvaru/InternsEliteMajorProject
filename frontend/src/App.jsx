import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

import './styles/global.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/modal.css';
import './styles/toast.css';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen flex-center">
        <span className="spinner" style={{ borderTopColor: 'var(--primary-color)' }}></span>
        <span className="loading-text">Loading application...</span>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <div className="bg-glow-1" aria-hidden="true"></div>
          <div className="bg-glow-2" aria-hidden="true"></div>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
