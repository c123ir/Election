/**
 * ماژول API کاربران
 * 
 * این ماژول توابع مربوط به مدیریت کاربران را پیاده‌سازی می‌کند
 * شامل دریافت، ایجاد، بروزرسانی و حذف کاربران
 */
import { query, transaction } from '../mysql';
import { User } from '../../types';

/**
 * دریافت لیست کاربران
 * 
 * @param {object} options گزینه‌های فیلتر
 * @returns {Promise<User[]>} لیست کاربران
 * 
 * @example
 * // دریافت همه کاربران
 * const users = await usersApi.getUsers();
 * 
 * // دریافت کاربران تأیید شده
 * const approvedUsers = await usersApi.getUsers({ is_approved: true });
 */
export async function getUsers(options: { is_approved?: boolean, role?: string } = {}): Promise<User[]> {
  try {
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params: any[] = [];
    
    if (options.is_approved !== undefined) {
      sql += ' AND is_approved = ?';
      params.push(options.is_approved ? 1 : 0);
    }
    
    if (options.role) {
      sql += ' AND role = ?';
      params.push(options.role);
    }
    
    const results = await query(sql, params);
    
    // تبدیل فیلدهای بولین
    return results.map((user: any) => ({
      ...user,
      is_approved: user.is_approved === 1,
      privacy_settings: user.privacy_settings ? JSON.parse(user.privacy_settings) : null
    }));
  } catch (error) {
    console.error('خطا در دریافت کاربران:', error);
    return [];
  }
}

/**
 * دریافت اطلاعات یک کاربر
 * 
 * @param {string} userId شناسه کاربر
 * @returns {Promise<User | null>} اطلاعات کاربر
 * 
 * @example
 * // دریافت اطلاعات کاربر
 * const user = await usersApi.getUser('123');
 */
export async function getUser(userId: string): Promise<User | null> {
  try {
    const results = await query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (results.length === 0) {
      return null;
    }
    
    const user = results[0];
    
    // تبدیل فیلدهای بولین و JSON
    return {
      ...user,
      is_approved: user.is_approved === 1,
      privacy_settings: user.privacy_settings ? JSON.parse(user.privacy_settings) : null
    };
  } catch (error) {
    console.error('خطا در دریافت اطلاعات کاربر:', error);
    return null;
  }
}

/**
 * بروزرسانی اطلاعات کاربر
 * 
 * @param {string} userId شناسه کاربر
 * @param {Partial<User>} userData اطلاعات جدید کاربر
 * @returns {Promise<boolean>} نتیجه بروزرسانی
 * 
 * @example
 * // بروزرسانی نام کاربر
 * const success = await usersApi.updateUser('123', { full_name: 'نام جدید' });
 */
export async function updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
  try {
    // ساخت کوئری بروزرسانی
    const fields: string[] = [];
    const values: any[] = [];
    
    // بررسی و اضافه کردن فیلدها
    if (userData.full_name !== undefined) {
      fields.push('full_name = ?');
      values.push(userData.full_name);
    }
    
    if (userData.phone !== undefined) {
      fields.push('phone = ?');
      values.push(userData.phone);
    }
    
    if (userData.role !== undefined) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    
    if (userData.business_category !== undefined) {
      fields.push('business_category = ?');
      values.push(userData.business_category);
    }
    
    if (userData.business_name !== undefined) {
      fields.push('business_name = ?');
      values.push(userData.business_name);
    }
    
    if (userData.is_approved !== undefined) {
      fields.push('is_approved = ?');
      values.push(userData.is_approved ? 1 : 0);
    }
    
    if (userData.privacy_settings !== undefined) {
      fields.push('privacy_settings = ?');
      values.push(JSON.stringify(userData.privacy_settings));
    }
    
    // اگر فیلدی برای بروزرسانی وجود ندارد
    if (fields.length === 0) {
      return true;
    }
    
    // اضافه کردن شناسه کاربر به پارامترها
    values.push(userId);
    
    // اجرای کوئری بروزرسانی
    await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return true;
  } catch (error) {
    console.error('خطا در بروزرسانی اطلاعات کاربر:', error);
    return false;
  }
}

/**
 * تأیید کاربر
 * 
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} نتیجه تأیید
 * 
 * @example
 * // تأیید کاربر
 * const success = await usersApi.approveUser('123');
 */
export async function approveUser(userId: string): Promise<boolean> {
  try {
    await query('UPDATE users SET is_approved = 1 WHERE id = ?', [userId]);
    return true;
  } catch (error) {
    console.error('خطا در تأیید کاربر:', error);
    return false;
  }
}

/**
 * ثبت‌نام کاربر جدید
 * 
 * @param {object} userData اطلاعات کاربر
 * @returns {Promise<string | null>} شناسه کاربر یا null
 * 
 * @example
 * // ثبت‌نام کاربر
 * const userId = await usersApi.registerUser({
 *   phone: '09123456789',
 *   full_name: 'نام کاربر',
 *   business_category: 'computer',
 *   business_name: 'نام کسب و کار'
 * });
 */
export async function registerUser(userData: {
  phone: string;
  full_name: string;
  business_category: string;
  business_name: string;
}): Promise<string | null> {
  try {
    // بررسی وجود کاربر با این شماره موبایل
    const existingUsers = await query('SELECT id FROM users WHERE phone = ?', [userData.phone]);
    
    if (existingUsers.length > 0) {
      throw new Error('کاربر با این شماره موبایل قبلاً ثبت شده است');
    }
    
    // ایجاد کاربر جدید
    const result = await query(
      'INSERT INTO users (phone, full_name, role, business_category, business_name, created_at, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        userData.phone,
        userData.full_name,
        'member',
        userData.business_category,
        userData.business_name,
        new Date(),
        0 // کاربر جدید نیاز به تأیید دارد
      ]
    );
    
    if (result.insertId) {
      return result.insertId.toString();
    }
    
    return null;
  } catch (error) {
    console.error('خطا در ثبت‌نام کاربر:', error);
    return null;
  }
}

/**
 * حذف کاربر
 * 
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} نتیجه حذف
 * 
 * @example
 * // حذف کاربر
 * const success = await usersApi.deleteUser('123');
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await query('DELETE FROM users WHERE id = ?', [userId]);
    return true;
  } catch (error) {
    console.error('خطا در حذف کاربر:', error);
    return false;
  }
}

/**
 * بررسی وجود کاربر با شماره موبایل
 * 
 * @param {string} phone شماره موبایل
 * @returns {Promise<boolean>} نتیجه بررسی
 * 
 * @example
 * // بررسی وجود کاربر
 * const exists = await usersApi.userExistsByPhone('09123456789');
 */
export async function userExistsByPhone(phone: string): Promise<boolean> {
  try {
    const results = await query('SELECT COUNT(*) as count FROM users WHERE phone = ?', [phone]);
    return results[0].count > 0;
  } catch (error) {
    console.error('خطا در بررسی وجود کاربر:', error);
    return false;
  }
}

/**
 * دریافت کاربر با شماره موبایل
 * 
 * @param {string} phone شماره موبایل
 * @returns {Promise<User | null>} اطلاعات کاربر
 * 
 * @example
 * // دریافت کاربر با شماره موبایل
 * const user = await usersApi.getUserByPhone('09123456789');
 */
export async function getUserByPhone(phone: string): Promise<User | null> {
  try {
    const results = await query('SELECT * FROM users WHERE phone = ?', [phone]);
    
    if (results.length === 0) {
      return null;
    }
    
    const user = results[0];
    
    // تبدیل فیلدهای بولین و JSON
    return {
      ...user,
      is_approved: user.is_approved === 1,
      privacy_settings: user.privacy_settings ? JSON.parse(user.privacy_settings) : null
    };
  } catch (error) {
    console.error('خطا در دریافت کاربر با شماره موبایل:', error);
    return null;
  }
}

export const usersApi = {
  getUsers,
  getUser,
  updateUser,
  approveUser,
  registerUser,
  deleteUser,
  userExistsByPhone,
  getUserByPhone
};