// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

/**
 * کلاینت Supabase برای اتصال به بانک اطلاعاتی
 * 
 * این کلاینت برای تمام عملیات‌های دیتابیس استفاده می‌شود
 * URL و کلید API از متغیرهای محیطی خوانده می‌شوند
 * 
 * @example
 * // استفاده از کلاینت برای دریافت داده‌ها
 * const { data, error } = await supabase.from('users').select('*');
 */
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

/**
 * بررسی وضعیت اتصال به Supabase
 * 
 * @returns {Promise<boolean>} وضعیت اتصال
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('خطا در اتصال به Supabase:', error);
    return false;
  }
}