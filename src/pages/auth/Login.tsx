import React from 'react';
import { LoginForm } from '../../components/auth/LoginForm';
import { useThemeStore } from '../../store/theme';
import { Moon, Sun, Vote } from 'lucide-react';

export function LoginPage() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 p-2 text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-hover rounded-full transition-colors"
      >
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Vote className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">بنام خدای نزدیک</h1>
          <h2 className="mt-6 text-xl text-gray-800 dark:text-dark-text-secondary">سامانه انتخابات اتحادیه صنف کامپیوتر</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}