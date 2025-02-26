import React, { useState, useEffect, memo, useCallback } from 'react';
import { Vote, Menu, X, Bell, Moon, Sun } from 'lucide-react';
import { User } from '../../types';
import { format, formatDistanceToNow } from 'date-fns-jalali';
import { useThemeStore } from '../../store/theme';

const ELECTION_DATE = new Date('2025-03-01T05:00:00.000Z'); // ۱۱ اسفند ۱۴۰۳ ساعت ۸:۳۰

interface HeaderProps {
  user: User;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  onLogout: () => void;
}

export const Header = memo(({ user, isSidebarOpen, onSidebarToggle, onLogout }: HeaderProps) => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'پیام جدید در چت عمومی', unread: true },
    { id: 2, text: 'وبینار جدید ثبت شد', unread: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // نمایش پیام خوش‌آمدگویی به مدت 5 ثانیه
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const getTimeRemaining = useCallback(() => {
    const now = new Date();
    if (now >= ELECTION_DATE) {
      return 'انتخابات آغاز شده است';
    }
    return formatDistanceToNow(ELECTION_DATE, { addSuffix: true });
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotificationClick = useCallback(() => {
    setShowNotifications(!showNotifications);
  }, [showNotifications]);

  return (
    <div className="bg-white dark:bg-dark-card shadow transition-colors duration-200">
      {showWelcome && (
        <div className="bg-green-500 text-white py-2 px-4 text-center">
          <p className="font-bold">خوش آمدید {user.phone}</p>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* هدر اصلی - نمایش در دسکتاپ */}
        <div className="hidden lg:flex justify-between items-center py-4 px-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Vote className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">سامانه انتخابات</h1>
          </div>
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {getTimeRemaining()}
            </div>
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-full"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-lg shadow-lg py-2 z-50">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-hover cursor-pointer ${
                        notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-200">{notification.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-full"
            >
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              خروج
            </button>
          </div>
        </div>

        {/* هدر موبایل */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onSidebarToggle}
              className="text-gray-600 dark:text-gray-300"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Vote className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={handleNotificationClick}
                className="relative p-2"
              >
                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button onClick={toggleTheme} className="p-2">
                {isDarkMode ? (
                  <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
          
          {/* نوار اطلاعات در موبایل */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2">
            <div className="flex justify-between items-center text-sm">
              <div className="text-blue-600 dark:text-blue-400">
                {getTimeRemaining()}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {format(currentTime, 'HH:mm:ss')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Header.displayName = 'Header';