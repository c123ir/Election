/**
 * ماژول API کاربران
 * 
 * این ماژول توابع مربوط به مدیریت کاربران را پیاده‌سازی می‌کند
 * شامل دریافت، ایجاد، بروزرسانی و حذف کاربران
 */
import { supabase } from '../supabase';
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
    let query = supabase.from('users').select('*');
    
    if (options.is_approved !== undefined) {
      query = query.eq('is_approved', options.is_approved);
    }
    
    if (options.role) {
      query = query.eq('role', options.role);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('خطا در دریافت کاربران:', error);
      return [];
    }
    
    return data as User[];
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('خطا در دریافت اطلاعات کاربر:', error);
      return null;
    }
    
    return data as User;
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
    const { error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId);
    
    if (error) {
      console.error('خطا در بروزرسانی اطلاعات کاربر:', error);
      return false;
    }
    
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
    const { data, error } = await supabase.rpc('approve_user', {
      user_id: userId
    });
    
    if (error) {
      console.error('خطا در تأیید کاربر:', error);
      return false;
    }
    
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
    const { data, error } = await supabase.rpc('register_user', {
      phone_number: userData.phone,
      name: userData.full_name,
      business_cat: userData.business_category,
      business_name: userData.business_name
    });
    
    if (error) {
      console.error('خطا در ثبت‌نام کاربر:', error);
      return null;
    }
    
    return data;
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
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('خطا در حذف کاربر:', error);
      return false;
    }
    
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
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('phone', phone);
    
    if (error) {
      console.error('خطا در بررسی وجود کاربر:', error);
      return false;
    }
    
    return (count || 0) > 0;
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error) {
      console.error('خطا در دریافت کاربر با شماره موبایل:', error);
      return null;
    }
    
    return data as User;
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