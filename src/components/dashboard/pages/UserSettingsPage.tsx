import React, { useState } from 'react';
import { Shield, Bell, Eye, EyeOff, UserCircle, MessageSquare, Vote } from 'lucide-react';
import { User } from '../../../types';
import toast from 'react-hot-toast';

interface UserSettingsPageProps {
  user: User;
  onUpdateSettings: (settings: Partial<User>) => void;
}

export function UserSettingsPage({ user, onUpdateSettings }: UserSettingsPageProps) {
  const [nickname, setNickname] = useState(user.nickname || '');
  const [privacySettings, setPrivacySettings] = useState(user.privacy_settings || {
    hide_identity: false,
    hide_business_info: false,
    anonymous_chat: false,
    anonymous_voting: false,
    notification_preferences: {
      email: true,
      sms: true,
      webinar_reminders: true,
      vote_confirmations: true
    }
  });

  const handleSave = () => {
    onUpdateSettings({
      nickname,
      privacy_settings: privacySettings
    });
    toast.success('تنظیمات با موفقیت ذخیره شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Shield className="h-6 w-6 text-blue-500 ml-2" />
        <h2 className="text-2xl font-bold">تنظیمات حریم خصوصی</h2>
      </div>

      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {/* تنظیمات نام مستعار */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <UserCircle className="h-5 w-5 ml-2 text-gray-400" />
              نام مستعار
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام مستعار شما در چت‌ها و نظرات
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="مثال: کاربر ناشناس"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                این نام به جای نام واقعی شما در بخش‌های مختلف نمایش داده خواهد شد
              </p>
            </div>
          </div>
        </div>

        {/* تنظیمات حریم خصوصی */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <Eye className="h-5 w-5 ml-2 text-gray-400" />
              حریم خصوصی
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">مخفی کردن هویت</label>
                <p className="text-sm text-gray-500">نام و مشخصات شما برای دیگران نمایش داده نخواهد شد</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.hide_identity}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings,
                    hide_identity: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">مخفی کردن اطلاعات کسب و کار</label>
                <p className="text-sm text-gray-500">اطلاعات کسب و کار شما برای دیگران نمایش داده نخواهد شد</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.hide_business_info}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings,
                    hide_business_info: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">چت ناشناس</label>
                <p className="text-sm text-gray-500">پیام‌های شما به صورت ناشناس ارسال خواهد شد</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.anonymous_chat}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings,
                    anonymous_chat: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">رای‌گیری ناشناس</label>
                <p className="text-sm text-gray-500">رای شما به صورت کاملاً ناشناس ثبت خواهد شد</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.anonymous_voting}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings,
                    anonymous_voting: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* تنظیمات اعلان‌ها */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <Bell className="h-5 w-5 ml-2 text-gray-400" />
              تنظیمات اعلان‌ها
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">اعلان ایمیلی</label>
                <p className="text-sm text-gray-500">دریافت اعلان‌ها از طریق ایمیل</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.notification_preferences.email}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings,
                    notification_preferences: {
                      ...privacySettings.notification_preferences,
                      email: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">اعلان پیامکی</label>
                <p className="text-sm text-gray-500">دریافت اعلان‌ها از طریق پیامک</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.notification_preferences.sms}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings,
                    notification_preferences: {
                      ...privacySettings.notification_preferences,
                      sms: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">یادآوری وبینارها</label>
                <p className="text-sm text-gray-500">دریافت یادآوری برای وبینارهای ثبت‌نام شده</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.notification_preferences.webinar_reminders}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings,
                    notification_preferences: {
                      ...privacySettings.notification_preferences,
                      webinar_reminders: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">تایید رای‌گیری</label>
                <p className="text-sm text-gray-500">دریافت تاییدیه برای رای‌های ثبت شده</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.notification_preferences.vote_confirmations}
                  onChange={(e) => setPrivacySettings({
                    ...privacySettings,
                    notification_preferences: {
                      ...privacySettings.notification_preferences,
                      vote_confirmations: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 ml-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          ذخیره تنظیمات
        </button>
      </div>

      {/* راهنمای حریم خصوصی */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">راهنمای حریم خصوصی</h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start">
            <MessageSquare className="h-5 w-5 ml-2 mt-0.5" />
            <span>با فعال کردن "چت ناشناس"، پیام‌های شما با نام مستعار نمایش داده می‌شود و هویت واقعی شما محفوظ می‌ماند.</span>
          </li>
          <li className="flex items-start">
            <Vote className="h-5 w-5 ml-2 mt-0.5" />
            <span>رای‌گیری ناشناس به شما امکان می‌دهد بدون نگرانی از شناسایی شدن، در انتخابات شرکت کنید.</span>
          </li>
          <li className="flex items-start">
            <EyeOff className="h-5 w-5 ml-2 mt-0.5" />
            <span>اطلاعات کسب و کار شما فقط برای مدیران سیستم قابل مشاهده خواهد بود.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}