import React from 'react';
import { Vote, Shield, Users, Clock, Database, Globe, Cpu, Lock, Zap, Smartphone, Cloud, Award } from 'lucide-react';

export function AboutSystemPage() {
  return (
    <div className="space-y-8">
      {/* معرفی سیستم */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
        <div className="max-w-3xl mx-auto text-center">
          <Vote className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">سامانه جامع انتخابات الکترونیک اتحادیه‌های صنفی</h1>
          <p className="text-xl opacity-90">
            یک راهکار مدرن، امن و کارآمد برای برگزاری انتخابات دیجیتال
          </p>
        </div>
      </div>

      {/* ویژگی‌های اصلی */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-8 text-center">ویژگی‌های کلیدی سیستم</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">امنیت پیشرفته</h3>
            <p className="text-gray-600 dark:text-gray-400">
              استفاده از رمزنگاری پیشرفته و احراز هویت چندمرحله‌ای برای حفظ امنیت آرا
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <Users className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">مدیریت کاربران</h3>
            <p className="text-gray-600 dark:text-gray-400">
              سیستم جامع مدیریت اعضا با قابلیت تأیید هویت و دسترسی‌های سطح‌بندی شده
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <Clock className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">مدیریت زمان</h3>
            <p className="text-gray-600 dark:text-gray-400">
              برنامه‌ریزی دقیق زمانی و مدیریت خودکار فرآیند رای‌گیری
            </p>
          </div>
        </div>
      </div>

      {/* قابلیت‌های فنی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Database className="h-6 w-6 ml-2 text-blue-600 dark:text-blue-400" />
            زیرساخت فنی
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Cpu className="h-5 w-5 text-blue-500 ml-2 mt-1" />
              <div>
                <h4 className="font-medium">پردازش توزیع‌شده</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  استفاده از معماری میکروسرویس برای مقیاس‌پذیری و پایداری بالا
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Lock className="h-5 w-5 text-blue-500 ml-2 mt-1" />
              <div>
                <h4 className="font-medium">امنیت داده</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  رمزنگاری پیشرفته و ذخیره‌سازی امن اطلاعات حساس
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Zap className="h-5 w-5 text-blue-500 ml-2 mt-1" />
              <div>
                <h4 className="font-medium">عملکرد بهینه</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  پاسخگویی سریع و قابلیت پردازش همزمان تعداد بالای درخواست‌ها
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Globe className="h-6 w-6 ml-2 text-green-600 dark:text-green-400" />
            دسترسی‌پذیری
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Smartphone className="h-5 w-5 text-green-500 ml-2 mt-1" />
              <div>
                <h4 className="font-medium">طراحی واکنشگرا</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  سازگار با تمامی دستگاه‌ها و اندازه‌های نمایشگر
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Cloud className="h-5 w-5 text-green-500 ml-2 mt-1" />
              <div>
                <h4 className="font-medium">دسترسی ابری</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  امکان استفاده از سیستم در هر زمان و مکان
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Award className="h-5 w-5 text-green-500 ml-2 mt-1" />
              <div>
                <h4 className="font-medium">استانداردهای جهانی</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  پیاده‌سازی بر اساس بهترین استانداردهای امنیتی و فنی
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* قابلیت‌های کاربردی */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">قابلیت‌های کاربردی</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">مدیریت انتخابات</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• برنامه‌ریزی و زمان‌بندی انتخابات</li>
              <li>• مدیریت کاندیداها و تأیید صلاحیت‌ها</li>
              <li>• نظارت بر روند رای‌گیری</li>
              <li>• گزارش‌گیری لحظه‌ای</li>
            </ul>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">ارتباطات و تعامل</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• سیستم پیام‌رسانی داخلی</li>
              <li>• برگزاری وبینار و جلسات آنلاین</li>
              <li>• تالار گفتگوی تخصصی</li>
              <li>• اطلاع‌رسانی چندکاناله</li>
            </ul>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">گزارش‌ها و تحلیل‌ها</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• آمار مشارکت و نتایج</li>
              <li>• تحلیل روند رای‌گیری</li>
              <li>• گزارش‌های مدیریتی</li>
              <li>• نمودارهای تحلیلی</li>
            </ul>
          </div>
        </div>
      </div>

      {/* مزایای سیستم */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">مزایای استفاده از سیستم</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <h3 className="font-bold text-xl mb-2 text-blue-700 dark:text-blue-300">۷۰٪</h3>
            <p className="text-gray-600 dark:text-gray-400">کاهش هزینه‌های برگزاری</p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-xl mb-2 text-blue-700 dark:text-blue-300">۹۹.۹٪</h3>
            <p className="text-gray-600 dark:text-gray-400">دسترس‌پذیری سیستم</p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-xl mb-2 text-blue-700 dark:text-blue-300">۱۰۰٪</h3>
            <p className="text-gray-600 dark:text-gray-400">شفافیت در شمارش آرا</p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-xl mb-2 text-blue-700 dark:text-blue-300">۲۴/۷</h3>
            <p className="text-gray-600 dark:text-gray-400">پشتیبانی و نظارت</p>
          </div>
        </div>
      </div>
    </div>
  );
}