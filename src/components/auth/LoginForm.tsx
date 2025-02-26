import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendOTP } from '../../lib/auth';
import { OTPForm } from './OTPForm';
import toast from 'react-hot-toast';

export function LoginForm() {
  const [phone, setPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  // تبدیل اعداد فارسی به انگلیسی
  const convertPersianToEnglish = (str: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    return str.split('').map(c => {
      const index = persianNumbers.indexOf(c);
      return index !== -1 ? englishNumbers[index] : c;
    }).join('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // تبدیل اعداد فارسی به انگلیسی و حذف کاراکترهای غیر عددی
    const value = convertPersianToEnglish(e.target.value);
    setPhone(value.replace(/\D/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.match(/^09\d{9}$/)) {
      toast.error('شماره موبایل معتبر نیست');
      return;
    }

    setLoading(true);
    const success = await sendOTP(phone);
    setLoading(false);

    if (success) {
      setShowOTP(true);
    } else {
      toast.error('خطا در ارسال کد تایید');
    }
  };

  if (showOTP) {
    return <OTPForm phone={phone} onBack={() => setShowOTP(false)} />;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">ورود به سامانه</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            شماره موبایل
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-hover"
            placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
          />
          <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
            برای ورود به عنوان مدیر از شماره 09132323123 استفاده کنید
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? 'در حال ارسال کد...' : 'دریافت کد تایید'}
        </button>
        <div className="text-center">
          <Link to="/register" className="text-blue-600 hover:text-blue-800 text-sm">
            عضو نیستید؟ ثبت‌نام کنید
          </Link>
        </div>
      </form>
    </div>
  );
}