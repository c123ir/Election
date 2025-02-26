import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../../lib/auth';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';
import { convertPersianToEnglish } from '../../lib/utils';

interface OTPFormProps {
  phone: string;
  onBack: () => void;
}

export function OTPForm({ phone, onBack }: OTPFormProps) {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(120); // 2 دقیقه
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // تبدیل اعداد فارسی به انگلیسی و حذف کاراکترهای غیر عددی
    const value = convertPersianToEnglish(e.target.value);
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setCode(numericValue);
    
    // اگر کد 4 رقمی کامل شد، فرم را ارسال کن
    if (numericValue.length === 4) {
      setTimeout(() => {
        formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 300);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    
    setIsResending(true);
    const success = await sendOTP(phone);
    
    if (success) {
      toast.success('کد جدید ارسال شد');
      setTimer(120);
    } else {
      toast.error('خطا در ارسال کد');
    }
    setIsResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 4) {
      toast.error('کد باید ۴ رقمی باشد');
      return;
    }

    if (isVerifying) return;
    setIsVerifying(true);
    
    try {
      // تایید کد
      const isCodeValid = await verifyOTP(phone, code);
      
      if (!isCodeValid) {
        toast.error('کد وارد شده صحیح نیست');
        setIsVerifying(false);
        return;
      }
      
      // ورود کاربر
      try {
        await login(phone);
        toast.success(`خوش آمدید ${phone}`);
        navigate('/dashboard');
      } catch (loginError) {
        console.error('خطا در ورود کاربر:', loginError);
        toast.error('خطا در ورود به سیستم');
      }
    } catch (error) {
      console.error('خطا در تایید کد:', error);
      toast.error('خطا در تایید کد');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-dark-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">تایید شماره موبایل</h2>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          کد تایید به شماره {phone} ارسال شد
        </p>
        <button
          onClick={onBack}
          className="text-blue-600 dark:text-blue-400 hover:underline mt-2"
        >
          تغییر شماره
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            className="w-full px-4 py-2 text-center text-2xl tracking-widest border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-hover"
            placeholder="- - - -"
            maxLength={4}
            autoFocus
          />
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {timer > 0 ? (
            <span>ارسال مجدد کد تا {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isResending ? 'در حال ارسال...' : 'ارسال مجدد کد'}
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {isVerifying ? 'در حال تایید...' : 'تایید و ورود'}
        </button>
      </form>
    </div>
  );
}