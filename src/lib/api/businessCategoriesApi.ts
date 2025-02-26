/**
 * ماژول API رسته‌های صنفی
 * 
 * این ماژول توابع مربوط به رسته‌های صنفی را پیاده‌سازی می‌کند
 * شامل دریافت، ایجاد و بروزرسانی رسته‌های صنفی
 */
import { supabase } from '../supabase';
import { BUSINESS_CATEGORIES } from '../../types';

/**
 * دریافت لیست رسته‌های صنفی
 * 
 * @returns {Promise<{id: string, name: string}[]>} لیست رسته‌های صنفی
 * 
 * @example
 * // دریافت همه رسته‌های صنفی
 * const categories = await businessCategoriesApi.getBusinessCategories();
 */
export async function getBusinessCategories(): Promise<{id: string, name: string}[]> {
  try {
    const { data, error } = await supabase
      .from('business_categories')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('خطا در دریافت رسته‌های صنفی:', error);
      return Object.entries(BUSINESS_CATEGORIES).map(([id, name]) => ({ id, name }));
    }
    
    return data;
  } catch (error) {
    console.error('خطا در دریافت رسته‌های صنفی:', error);
    return Object.entries(BUSINESS_CATEGORIES).map(([id, name]) => ({ id, name }));
  }
}

/**
 * دریافت یک رسته صنفی
 * 
 * @param {string} categoryId شناسه رسته صنفی
 * @returns {Promise<{id: string, name: string, description?: string} | null>} اطلاعات رسته صنفی
 * 
 * @example
 * // دریافت رسته صنفی
 * const category = await businessCategoriesApi.getBusinessCategory('computer');
 */
export async function getBusinessCategory(categoryId: string): Promise<{id: string, name: string, description?: string} | null> {
  try {
    const { data, error } = await supabase
      .from('business_categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    if (error) {
      console.error('خطا در دریافت رسته صنفی:', error);
      const name = BUSINESS_CATEGORIES[categoryId as keyof typeof BUSINESS_CATEGORIES];
      return name ? { id: categoryId, name } : null;
    }
    
    return data;
  } catch (error) {
    console.error('خطا در دریافت رسته صنفی:', error);
    const name = BUSINESS_CATEGORIES[categoryId as keyof typeof BUSINESS_CATEGORIES];
    return name ? { id: categoryId, name } : null;
  }
}

/**
 * ایجاد رسته صنفی جدید
 * 
 * @param {object} categoryData اطلاعات رسته صنفی
 * @returns {Promise<string | null>} شناسه رسته صنفی یا null
 * 
 * @example
 * // ایجاد رسته صنفی
 * const categoryId = await businessCategoriesApi.createBusinessCategory({
 *   id: 'new_category',
 *   name: 'رسته جدید',
 *   description: 'توضیحات رسته جدید'
 * });
 */
export async function createBusinessCategory(categoryData: {
  id: string;
  name: string;
  description?: string;
}): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('business_categories')
      .insert(categoryData)
      .select('id')
      .single();
    
    if (error) {
      console.error('خطا در ایجاد رسته صنفی:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('خطا در ایجاد رسته صنفی:', error);
    return null;
  }
}

/**
 * بروزرسانی رسته صنفی
 * 
 * @param {string} categoryId شناسه رسته صنفی
 * @param {object} categoryData اطلاعات جدید رسته صنفی
 * @returns {Promise<boolean>} نتیجه بروزرسانی
 * 
 * @example
 * // بروزرسانی رسته صنفی
 * const success = await businessCategoriesApi.updateBusinessCategory('computer', {
 *   name: 'رایانه و خدمات نرم‌افزاری',
 *   description: 'توضیحات جدید'
 * });
 */
export async function updateBusinessCategory(
  categoryId: string,
  categoryData: {
    name?: string;
    description?: string;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('business_categories')
      .update(categoryData)
      .eq('id', categoryId);
    
    if (error) {
      console.error('خطا در بروزرسانی رسته صنفی:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در بروزرسانی رسته صنفی:', error);
    return false;
  }
}

/**
 * حذف رسته صنفی
 * 
 * @param {string} categoryId شناسه رسته صنفی
 * @returns {Promise<boolean>} نتیجه حذف
 * 
 * @example
 * // حذف رسته صنفی
 * const success = await businessCategoriesApi.deleteBusinessCategory('custom_category');
 */
export async function deleteBusinessCategory(categoryId: string): Promise<boolean> {
  try {
    // بررسی می‌کنیم که رسته پیش‌فرض نباشد
    if (Object.keys(BUSINESS_CATEGORIES).includes(categoryId)) {
      console.error('امکان حذف رسته‌های پیش‌فرض وجود ندارد');
      return false;
    }
    
    const { error } = await supabase
      .from('business_categories')
      .delete()
      .eq('id', categoryId);
    
    if (error) {
      console.error('خطا در حذف رسته صنفی:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در حذف رسته صنفی:', error);
    return false;
  }
}

/**
 * دریافت تعداد کاربران هر رسته صنفی
 * 
 * @returns {Promise<{category_id: string, category_name: string, count: number}[]>} آمار رسته‌های صنفی
 * 
 * @example
 * // دریافت آمار رسته‌های صنفی
 * const stats = await businessCategoriesApi.getBusinessCategoryStats();
 */
export async function getBusinessCategoryStats(): Promise<{category_id: string, category_name: string, count: number}[]> {
  try {
    const { data, error } = await supabase.rpc('get_business_category_stats');
    
    if (error) {
      console.error('خطا در دریافت آمار رسته‌های صنفی:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('خطا در دریافت آمار رسته‌های صنفی:', error);
    return [];
  }
}

export const businessCategoriesApi = {
  getBusinessCategories,
  getBusinessCategory,
  createBusinessCategory,
  updateBusinessCategory,
  deleteBusinessCategory,
  getBusinessCategoryStats
};