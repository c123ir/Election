/**
 * ماژول API وبینارها
 * 
 * این ماژول توابع مربوط به وبینارها را پیاده‌سازی می‌کند
 * شامل دریافت، ایجاد و ثبت‌نام در وبینارها
 */
import { supabase } from '../supabase';

/**
 * دریافت لیست وبینارها
 * 
 * @param {object} options گزینه‌های فیلتر
 * @returns {Promise<any[]>} لیست وبینارها
 * 
 * @example
 * // دریافت همه وبینارها
 * const webinars = await webinarsApi.getWebinars();
 * 
 * // دریافت وبینارهای در حال پخش
 * const liveWebinars = await webinarsApi.getWebinars({ status: 'live' });
 */
export async function getWebinars(options: { status?: string, candidate_id?: string } = {}): Promise<any[]> {
  try {
    let query = supabase.from('webinars').select('*');
    
    if (options.status) {
      query = query.eq('status', options.status);
    }
    
    if (options.candidate_id) {
      query = query.eq('candidate_id', options.candidate_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('خطا در دریافت وبینارها:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('خطا در دریافت وبینارها:', error);
    return [];
  }
}

/**
 * دریافت یک وبینار
 * 
 * @param {string} webinarId شناسه وبینار
 * @returns {Promise<any | null>} اطلاعات وبینار
 * 
 * @example
 * // دریافت وبینار
 * const webinar = await webinarsApi.getWebinar('123');
 */
export async function getWebinar(webinarId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('webinars')
      .select('*')
      .eq('id', webinarId)
      .single();
    
    if (error) {
      console.error('خطا در دریافت وبینار:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('خطا در دریافت وبینار:', error);
    return null;
  }
}

/**
 * ایجاد وبینار جدید
 * 
 * @param {object} webinarData اطلاعات وبینار
 * @returns {Promise<string | null>} شناسه وبینار یا null
 * 
 * @example
 * // ایجاد وبینار
 * const webinarId = await webinarsApi.createWebinar({
 *   title: 'عنوان وبینار',
 *   description: 'توضیحات',
 *   candidate_id: 'candidate123',
 *   start_time: '2023-12-31T18:00:00',
 *   duration: 60
 * });
 */
export async function createWebinar(webinarData: {
  title: string;
  description: string;
  candidate_id: string;
  start_time: string;
  duration: number;
}): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('webinars')
      .insert({
        ...webinarData,
        status: 'scheduled',
        participants_count: 0
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('خطا در ایجاد وبینار:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('خطا در ایجاد وبینار:', error);
    return null;
  }
}

/**
 * ثبت‌نام در وبینار
 * 
 * @param {string} webinarId شناسه وبینار
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} نتیجه ثبت‌نام
 * 
 * @example
 * // ثبت‌نام در وبینار
 * const success = await webinarsApi.registerForWebinar('webinar123', 'user456');
 */
export async function registerForWebinar(webinarId: string, userId: string): Promise<boolean> {
  try {
    // ابتدا وبینار را دریافت می‌کنیم
    const { data: webinarData, error: webinarError } = await supabase
      .from('webinars')
      .select('*')
      .eq('id', webinarId)
      .single();
    
    if (webinarError) {
      console.error('خطا در دریافت وبینار:', webinarError);
      return false;
    }
    
    // بررسی می‌کنیم که وبینار هنوز شروع نشده باشد
    if (webinarData.status !== 'scheduled') {
      console.error('وبینار در حال پخش یا پایان یافته است');
      return false;
    }
    
    // بررسی می‌کنیم که کاربر قبلاً ثبت‌نام نکرده باشد
    const { count, error: countError } = await supabase
      .from('webinar_participants')
      .select('*', { count: 'exact' })
      .eq('webinar_id', webinarId)
      .eq('user_id', userId);
    
    if (countError) {
      console.error('خطا در بررسی ثبت‌نام قبلی:', countError);
      return false;
    }
    
    if (count && count > 0) {
      console.error('کاربر قبلاً در این وبینار ثبت‌نام کرده است');
      return false;
    }
    
    // ثبت‌نام کاربر در وبینار
    const { error: registerError } = await supabase
      .from('webinar_participants')
      .insert({
        webinar_id: webinarId,
        user_id: userId,
        registered_at: new Date().toISOString()
      });
    
    if (registerError) {
      console.error('خطا در ثبت‌نام در وبینار:', registerError);
      return false;
    }
    
    // بروزرسانی تعداد شرکت‌کنندگان
    const { error: updateError } = await supabase
      .from('webinars')
      .update({
        participants_count: webinarData.participants_count + 1
      })
      .eq('id', webinarId);
    
    if (updateError) {
      console.error('خطا در بروزرسانی تعداد شرکت‌کنندگان:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در ثبت‌نام در وبینار:', error);
    return false;
  }
}

/**
 * بررسی ثبت‌نام کاربر در وبینار
 * 
 * @param {string} webinarId شناسه وبینار
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} آیا کاربر ثبت‌نام کرده است
 * 
 * @example
 * // بررسی ثبت‌نام کاربر
 * const isRegistered = await webinarsApi.isUserRegistered('webinar123', 'user456');
 */
export async function isUserRegistered(webinarId: string, userId: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('webinar_participants')
      .select('*', { count: 'exact' })
      .eq('webinar_id', webinarId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('خطا در بررسی ثبت‌نام کاربر:', error);
      return false;
    }
    
    return (count || 0) > 0;
  } catch (error) {
    console.error('خطا در بررسی ثبت‌نام کاربر:', error);
    return false;
  }
}

/**
 * دریافت شرکت‌کنندگان وبینار
 * 
 * @param {string} webinarId شناسه وبینار
 * @returns {Promise<string[]>} لیست شناسه کاربران
 * 
 * @example
 * // دریافت شرکت‌کنندگان
 * const participants = await webinarsApi.getWebinarParticipants('webinar123');
 */
export async function getWebinarParticipants(webinarId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('webinar_participants')
      .select('user_id')
      .eq('webinar_id', webinarId);
    
    if (error) {
      console.error('خطا در دریافت شرکت‌کنندگان وبینار:', error);
      return [];
    }
    
    return data.map(item => item.user_id);
  } catch (error) {
    console.error('خطا در دریافت شرکت‌کنندگان وبینار:', error);
    return [];
  }
}

/**
 * بروزرسانی وضعیت وبینار
 * 
 * @param {string} webinarId شناسه وبینار
 * @param {string} status وضعیت جدید
 * @returns {Promise<boolean>} نتیجه بروزرسانی
 * 
 * @example
 * // شروع وبینار
 * const success = await webinarsApi.updateWebinarStatus('webinar123', 'live');
 */
export async function updateWebinarStatus(webinarId: string, status: 'scheduled' | 'live' | 'ended'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('webinars')
      .update({ status })
      .eq('id', webinarId);
    
    if (error) {
      console.error('خطا در بروزرسانی وضعیت وبینار:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در بروزرسانی وضعیت وبینار:', error);
    return false;
  }
}

/**
 * ثبت آدرس ضبط وبینار
 * 
 * @param {string} webinarId شناسه وبینار
 * @param {string} recordingUrl آدرس ضبط
 * @returns {Promise<boolean>} نتیجه ثبت
 * 
 * @example
 * // ثبت آدرس ضبط
 * const success = await webinarsApi.setRecordingUrl('webinar123', 'https://example.com/recording.mp4');
 */
export async function setRecordingUrl(webinarId: string, recordingUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('webinars')
      .update({ recording_url: recordingUrl })
      .eq('id', webinarId);
    
    if (error) {
      console.error('خطا در ثبت آدرس ضبط وبینار:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در ثبت آدرس ضبط وبینار:', error);
    return false;
  }
}

/**
 * حذف وبینار
 * 
 * @param {string} webinarId شناسه وبینار
 * @returns {Promise<boolean>} نتیجه حذف
 * 
 * @example
 * // حذف وبینار
 * const success = await webinarsApi.deleteWebinar('webinar123');
 */
export async function deleteWebinar(webinarId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('webinars')
      .delete()
      .eq('id', webinarId);
    
    if (error) {
      console.error('خطا در حذف وبینار:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در حذف وبینار:', error);
    return false;
  }
}

export const webinarsApi = {
  getWebinars,
  getWebinar,
  createWebinar,
  registerForWebinar,
  isUserRegistered,
  getWebinarParticipants,
  updateWebinarStatus,
  setRecordingUrl,
  deleteWebinar
};