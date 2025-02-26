/**
 * ماژول API نظرسنجی‌ها
 * 
 * این ماژول توابع مربوط به نظرسنجی‌ها را پیاده‌سازی می‌کند
 * شامل دریافت، ایجاد و ثبت رأی در نظرسنجی‌ها
 */
import { supabase } from '../supabase';
import { Survey } from '../../types';

/**
 * دریافت لیست نظرسنجی‌ها
 * 
 * @param {object} options گزینه‌های فیلتر
 * @returns {Promise<Survey[]>} لیست نظرسنجی‌ها
 * 
 * @example
 * // دریافت همه نظرسنجی‌ها
 * const surveys = await surveysApi.getSurveys();
 * 
 * // دریافت نظرسنجی‌های فعال
 * const activeSurveys = await surveysApi.getSurveys({ is_active: true });
 */
export async function getSurveys(options: { is_active?: boolean, business_category?: string } = {}): Promise<Survey[]> {
  try {
    let query = supabase.from('surveys').select('*');
    
    if (options.is_active !== undefined) {
      query = query.eq('is_active', options.is_active);
    }
    
    if (options.business_category) {
      query = query.eq('business_category', options.business_category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('خطا در دریافت نظرسنجی‌ها:', error);
      return [];
    }
    
    return data as Survey[];
  } catch (error) {
    console.error('خطا در دریافت نظرسنجی‌ها:', error);
    return [];
  }
}

/**
 * دریافت یک نظرسنجی
 * 
 * @param {string} surveyId شناسه نظرسنجی
 * @returns {Promise<Survey | null>} اطلاعات نظرسنجی
 * 
 * @example
 * // دریافت نظرسنجی
 * const survey = await surveysApi.getSurvey('123');
 */
export async function getSurvey(surveyId: string): Promise<Survey | null> {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();
    
    if (error) {
      console.error('خطا در دریافت نظرسنجی:', error);
      return null;
    }
    
    return data as Survey;
  } catch (error) {
    console.error('خطا در دریافت نظرسنجی:', error);
    return null;
  }
}

/**
 * ایجاد نظرسنجی جدید
 * 
 * @param {Partial<Survey>} surveyData اطلاعات نظرسنجی
 * @returns {Promise<string | null>} شناسه نظرسنجی یا null
 * 
 * @example
 * // ایجاد نظرسنجی
 * const surveyId = await surveysApi.createSurvey({
 *   title: 'عنوان نظرسنجی',
 *   description: 'توضیحات',
 *   business_category: 'computer',
 *   options: [{ text: 'گزینه 1' }, { text: 'گزینه 2' }],
 *   end_date: '2023-12-31'
 * });
 */
export async function createSurvey(surveyData: Partial<Survey>): Promise<string | null> {
  try {
    // تبدیل گزینه‌ها به فرمت مناسب
    const options = (surveyData.options || []).map((option, index) => ({
      id: `option-${index + 1}`,
      text: typeof option === 'string' ? option : option.text,
      votes: 0
    }));
    
    const { data, error } = await supabase
      .from('surveys')
      .insert({
        ...surveyData,
        options,
        created_at: new Date().toISOString(),
        total_votes: 0,
        is_active: true,
        participants: []
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('خطا در ایجاد نظرسنجی:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('خطا در ایجاد نظرسنجی:', error);
    return null;
  }
}

/**
 * ثبت رأی در نظرسنجی
 * 
 * @param {string} surveyId شناسه نظرسنجی
 * @param {string} optionId شناسه گزینه
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} نتیجه ثبت رأی
 * 
 * @example
 * // ثبت رأی در نظرسنجی
 * const success = await surveysApi.voteInSurvey('survey123', 'option456', 'user789');
 */
export async function voteInSurvey(surveyId: string, optionId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('vote_in_survey', {
      survey_id: surveyId,
      option_id: optionId,
      user_id: userId
    });
    
    if (error) {
      console.error('خطا در ثبت رأی در نظرسنجی:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در ثبت رأی در نظرسنجی:', error);
    return false;
  }
}

/**
 * بررسی آیا کاربر در نظرسنجی شرکت کرده است
 * 
 * @param {string} surveyId شناسه نظرسنجی
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} آیا کاربر شرکت کرده است
 * 
 * @example
 * // بررسی شرکت کاربر در نظرسنجی
 * const hasVoted = await surveysApi.hasUserVotedInSurvey('survey123', 'user456');
 */
export async function hasUserVotedInSurvey(surveyId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('participants')
      .eq('id', surveyId)
      .single();
    
    if (error) {
      console.error('خطا در بررسی شرکت کاربر در نظرسنجی:', error);
      return false;
    }
    
    return data.participants.includes(userId);
  } catch (error) {
    console.error('خطا در بررسی شرکت کاربر در نظرسنجی:', error);
    return false;
  }
}

/**
 * غیرفعال کردن نظرسنجی
 * 
 * @param {string} surveyId شناسه نظرسنجی
 * @returns {Promise<boolean>} نتیجه غیرفعال کردن
 * 
 * @example
 * // غیرفعال کردن نظرسنجی
 * const success = await surveysApi.deactivateSurvey('123');
 */
export async function deactivateSurvey(surveyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('surveys')
      .update({ is_active: false })
      .eq('id', surveyId);
    
    if (error) {
      console.error('خطا در غیرفعال کردن نظرسنجی:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در غیرفعال کردن نظرسنجی:', error);
    return false;
  }
}

/**
 * حذف نظرسنجی
 * 
 * @param {string} surveyId شناسه نظرسنجی
 * @returns {Promise<boolean>} نتیجه حذف
 * 
 * @example
 * // حذف نظرسنجی
 * const success = await surveysApi.deleteSurvey('123');
 */
export async function deleteSurvey(surveyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', surveyId);
    
    if (error) {
      console.error('خطا در حذف نظرسنجی:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در حذف نظرسنجی:', error);
    return false;
  }
}

export const surveysApi = {
  getSurveys,
  getSurvey,
  createSurvey,
  voteInSurvey,
  hasUserVotedInSurvey,
  deactivateSurvey,
  deleteSurvey
};