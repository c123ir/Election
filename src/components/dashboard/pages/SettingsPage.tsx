import React, { useState } from 'react';
import { Settings, Bell, Shield, Globe, Database, Server } from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="تنظیمات سیستم"
        description="مدیریت تنظیمات و پیکربندی سامانه انتخابات"
        icon={Settings}
        gradient="from-gray-600 to-gray-800"
        image="https://source.unsplash.com/featured/400x400?settings"
      />

      <div className="bg-white dark:bg-dark-card rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Globe className="h-5 w-5 ml-2 text-blue-500" />
            تنظیمات انتخابات
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                تاریخ شروع انتخابات
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-hover"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                تاریخ پایان انتخابات
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-hover"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                حداکثر تعداد کاندیداها
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-hover"
                placeholder="مثال: ۱۰"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Bell className="h-5 w-5 ml-2 text-yellow-500" />
            تنظیمات اطلاع‌رسانی
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sms-notification"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
              />
              <label htmlFor="sms-notification" className="text-sm text-gray-700 dark:text-gray-300">
                ارسال پیامک به کاندیداها
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="result-notification"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
              />
              <label htmlFor="result-notification" className="text-sm text-gray-700 dark:text-gray-300">
                اطلاع‌رسانی نتایج به صورت خودکار
              </label>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Shield className="h-5 w-5 ml-2 text-green-500" />
            تنظیمات امنیتی
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="two-factor"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
              />
              <label htmlFor="two-factor" className="text-sm text-gray-700 dark:text-gray-300">
                فعال‌سازی تایید دو مرحله‌ای
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ip-restriction"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
              />
              <label htmlFor="ip-restriction" className="text-sm text-gray-700 dark:text-gray-300">
                محدودیت IP برای رای‌دهی
              </label>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Database className="h-5 w-5 ml-2 text-purple-500" />
            تنظیمات پایگاه داده
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto-backup"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
              />
              <label htmlFor="auto-backup" className="text-sm text-gray-700 dark:text-gray-300">
                پشتیبان‌گیری خودکار روزانه
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="data-encryption"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
              />
              <label htmlFor="data-encryption" className="text-sm text-gray-700 dark:text-gray-300">
                رمزنگاری داده‌ها
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </div>
    </div>
  );
}