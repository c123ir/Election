/**
 * ماژول احراز هویت
 * 
 * این ماژول توابع مربوط به احراز هویت کاربران را پیاده‌سازی می‌کند
 * شامل ارسال کد تأیید، بررسی کد، ورود و خروج کاربران
 */
import { sendVerificationCode } from './sms';
import { useAuthStore } from '../store/auth';
import { User } from '../types';
import { query, transaction } from './mysql';

/**
 * تولید کد تصادفی 4 رقمی
 * @returns {string} کد 4 رقمی
 */
function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// متغیر سراسری برای ذخیره کد تایید در محیط توسعه
const verificationCodes = new Map<string, string>();

/**
 * ارسال کد تأیید به شماره موبایل کاربر
 * 
 * @param {string} phone شماره موبایل کاربر
 * @returns {Promise<boolean>} نتیجه ارسال کد
 * 
 * @example
 * // ارسال کد تأیید
 * const success = await sendOTP('09123456789');
 */
export async function sendOTP(phone: string): Promise<boolean> {
  try {
    // تولید کد
    const code = generateCode();
    
    // در محیط واقعی: ذخیره کد در دیتابیس
    if (import.meta.env.PROD) {
      // حذف کدهای قبلی
      await query('DELETE FROM verification_codes WHERE phone = ?', [phone]);
      
      // تنظیم زمان انقضا (5 دقیقه)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      
      // ذخیره کد جدید
      await query(
        'INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)',
        [phone, code, expiresAt]
      );
    } else {
      // در محیط توسعه: ذخیره کد در حافظه موقت
      verificationCodes.set(phone, code);
    }
    
    // ارسال پیامک
    // در محیط واقعی از سرویس پیامک استفاده می‌شود
    // در محیط توسعه فقط در کنسول نمایش می‌دهیم
    if (import.meta.env.PROD) {
      const success = await sendVerificationCode(phone, code);
      if (!success) {
        console.error('خطا در ارسال پیامک');
        return false;
      }
    } else {
      console.log(`کد تایید برای ${phone}: ${code}`);
    }
    
    return true;
  } catch (error) {
    console.error('خطا در ارسال کد تایید:', error);
    return false;
  }
}

/**
 * تأیید کد وارد شده توسط کاربر
 * 
 * @param {string} phone شماره موبایل کاربر
 * @param {string} code کد وارد شده
 * @returns {Promise<boolean>} نتیجه تأیید کد
 * 
 * @example
 * // تأیید کد
 * const isValid = await verifyOTP('09123456789', '1234');
 */
export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  try {
    // در محیط واقعی: بررسی کد در دیتابیس
    if (import.meta.env.PROD) {
      const now = new Date();
      
      const results = await query(
        'SELECT * FROM verification_codes WHERE phone = ? AND code = ? AND expires_at > ? AND is_used = 0',
        [phone, code, now]
      );
      
      if (results.length === 0) {
        return false;
      }
      
      // علامت‌گذاری کد به عنوان استفاده شده
      await query(
        'UPDATE verification_codes SET is_used = 1 WHERE id = ?',
        [results[0].id]
      );
      
      return true;
    } else {
      // در محیط توسعه: بررسی کد در حافظه موقت
      const storedCode = verificationCodes.get(phone);
      
      if (storedCode && storedCode === code) {
        // پاک کردن کد پس از استفاده موفق
        verificationCodes.delete(phone);
        return true;
      }
      
      return false;
    }
  } catch (error) {
    console.error('خطا در تایید کد:', error);
    return false;
  }
}

/**
 * ورود کاربر به سیستم
 * 
 * @param {string} phone شماره موبایل کاربر
 * @returns {Promise<boolean>} نتیجه ورود
 * 
 * @example
 * // ورود کاربر
 * const success = await loginUser('09123456789');
 */
export async function loginUser(phone: string): Promise<boolean> {
  try {
    // در محیط واقعی: دریافت اطلاعات کاربر از دیتابیس
    if (import.meta.env.PROD) {
      // دریافت اطلاعات کاربر
      const users = await query(
        'SELECT * FROM users WHERE phone = ?',
        [phone]
      );
      
      if (users.length === 0) {
        console.error('کاربر یافت نشد');
        return false;
      }
      
      const userData = users[0];
      
      // اگر کاربر کاندیدا است، اطلاعات کاندیدا را هم دریافت کنیم
      if (userData.role === 'candidate') {
        const candidates = await query(
          'SELECT * FROM candidates WHERE user_id = ?',
          [userData.id]
        );
        
        if (candidates.length > 0) {
          const candidateData = candidates[0];
          userData.bio = candidateData.bio;
          userData.proposals = JSON.parse(candidateData.proposals || '[]');
          userData.avatar_url = candidateData.avatar_url;
          userData.approved = candidateData.approved === 1;
        }
      }
      
      // ذخیره اطلاعات کاربر در استور
      const { setUser } = useAuthStore.getState();
      setUser(userData as User);
      
      return true;
    } else {
      // در محیط توسعه: ایجاد کاربر آزمایشی
      const { setUser } = useAuthStore.getState();
      
      // بررسی مدیر بودن
      const isAdmin = phone === '09132323123';
      
      // ایجاد کاربر آزمایشی
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        phone,
        full_name: isAdmin ? 'مدیر سیستم' : 'کاربر آزمایشی',
        role: isAdmin ? 'admin' : 'member',
        created_at: new Date().toISOString(),
        business_category: 'computer',
        business_name: isAdmin ? 'اتحادیه صنف کامپیوتر' : 'فروشگاه آزمایشی',
        is_approved: true,
        privacy_settings: {
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
        }
      };
      
      setUser(newUser);
      return true;
    }
  } catch (error) {
    console.error('خطا در ورود کاربر:', error);
    return false;
  }
}

/**
 * بررسی وجود نشست فعال
 * 
 * @returns {Promise<boolean>} وضعیت نشست
 * 
 * @example
 * // بررسی نشست
 * const hasSession = await checkExistingSession();
 */
export async function checkExistingSession(): Promise<boolean> {
  try {
    // در محیط توسعه: بررسی وجود نشست در localStorage
    const storedUser = localStorage.getItem('auth-storage');
    if (storedUser) {
      try {
        const parsedData = JSON.parse(storedUser);
        if (parsedData.state && parsedData.state.user) {
          const { setUser } = useAuthStore.getState();
          setUser(parsedData.state.user);
          return true;
        }
      } catch (parseError) {
        console.error('خطا در پارس کردن داده‌های ذخیره شده:', parseError);
      }
    }
    return false;
  } catch (error) {
    console.error('خطا در بررسی نشست:', error);
    return false;
  }
}

/**
 * خروج کاربر از سیستم
 * 
 * @returns {Promise<boolean>} نتیجه خروج
 * 
 * @example
 * // خروج کاربر
 * const success = await logoutUser();
 */
export async function logoutUser(): Promise<boolean> {
  try {
    // پاکسازی استور
    const { setUser } = useAuthStore.getState();
    setUser(null);
    
    return true;
  } catch (error) {
    console.error('خطا در خروج از سیستم:', error);
    return false;
  }
}