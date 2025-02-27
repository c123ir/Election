/**
 * ماژول اتصال به دیتابیس
 * 
 * این ماژول برای ذخیره‌سازی داده‌ها در مرورگر استفاده می‌شود
 */
import { query as dbQuery, checkConnection as dbCheckConnection, transaction as dbTransaction } from './db';

/**
 * اجرای یک کوئری
 * 
 * @param {string} sql کوئری SQL
 * @param {any[]} params پارامترها
 * @returns {Promise<any>} نتیجه کوئری
 */
export async function query(sql: string, params: any[] = []): Promise<any> {
  try {
    // در محیط مرورگر از دیتابیس داخلی استفاده می‌کنیم
    return await dbQuery('users', 'select');
  } catch (error) {
    console.error('خطا در اجرای کوئری:', error);
    throw error;
  }
}

/**
 * بررسی اتصال به دیتابیس
 * 
 * @returns {Promise<boolean>} وضعیت اتصال
 */
export async function checkConnection(): Promise<boolean> {
  return await dbCheckConnection();
}

/**
 * اجرای یک تراکنش
 * 
 * @param {Function} callback تابع حاوی عملیات تراکنش
 * @returns {Promise<any>} نتیجه تراکنش
 */
export async function transaction<T>(callback: () => Promise<T>): Promise<T> {
  return await dbTransaction(callback);
}

export default {
  query,
  checkConnection,
  transaction
};