import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/auth/Login';
import { RegisterPage } from './pages/auth/Register';
import { Dashboard } from './components/dashboard/pages/Dashboard';
import { useThemeStore } from './store/theme';
import { useAuthStore } from './store/auth';
import { checkExistingSession } from './lib/auth';

function App() {
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    // اعمال تم به محض لود برنامه
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // بررسی وجود نشست فعال
    checkExistingSession();
  }, []);

  return (
    <BrowserRouter>
      <div className={`min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary font-yekan transition-colors duration-200`}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route path="/dashboard/*" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'dark:bg-dark-card dark:text-dark-text-primary',
            style: {
              background: isDarkMode ? '#1e1e1e' : '#fff',
              color: isDarkMode ? '#fff' : '#000',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;