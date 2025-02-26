/**
 * ماژول API انتظارات
 * 
 * این ماژول توابع مربوط به انتظارات اعضا را پیاده‌سازی می‌کند
 * شامل دریافت، ایجاد و پاسخ به انتظارات
 */
import { supabase } from '../supabase';
import { Expectation } from '../../types';

/**
 * دریافت لیست انتظارات
 * 
 * @param {object} options گزینه‌های فیلتر
 * @returns {Promise<Expectation[]>} لیست انتظارات
 * 
 * @example
 * // دریافت همه انتظارات
 * const expectations = await expectationsApi.getExpectations();
 * 
 * // دریافت انتظارات یک رسته خاص
 * const computerExpectations = await expectationsApi.getExpectations({ business_category: 'computer' });
 */
export async function getExpectations(options: { business_category?: string, status?: string, priority?: string } = {}): Promise<Expectation[]> {
  try {
    let query = supabase.from('expectations').select('*');
    
    if (options.business_category) {
      query = query.eq('business_category', options.business_category);
    }
    
    if (options.status) {
      query = query.eq('status', options.status);
    }
    
    if (options.priority) {
      query = query.eq('priority', options.priority);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('خطا در دریافت انتظارات:', error);
      return [];
    }
    
    return data as Expectation[];
  } catch (error) {
    console.error('خطا در دریافت انتظارات:', error);
    return [];
  }
}

/**
 * دریافت یک انتظار
 * 
 * @param {string} expectationId شناسه انتظار
 * @returns {Promise<Expectation | null>} اطلاعات انتظار
 * 
 * @example
 * // دریافت انتظار
 * const expectation = await expectationsApi.getExpectation('123');
 */
export async function getExpectation(expectationId: string): Promise<Expectation | null> {
  try {
    const { data, error } = await supabase
      .from('expectations')
      .select('*')
      .eq('id', expectationId)
      .single();
    
    if (error) {
      console.error('خطا در دریافت انتظار:', error);
      return null;
    }
    
    return data as Expectation;
  } catch (error) {
    console.error('خطا در دریافت انتظار:', error);
    return null;
  }
}

/**
 * ایجاد انتظار جدید
 * 
 * @param {Partial<Expectation>} expectationData اطلاعات انتظار
 * @returns {Promise<string | null>} شناسه انتظار یا null
 * 
 * @example
 * // ایجاد انتظار
 * const expectationId = await expectationsApi.createExpectation({
 *   title: 'عنوان انتظار',
 *   description: 'توضیحات',
 *   business_category: 'computer',
 *   priority: 'high',
 *   user_id: 'user123'
 * });
 */
export async function createExpectation(expectationData: Partial<Expectation>): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('expectations')
      .insert({
        ...expectationData,
        created_at: new Date().toISOString(),
        status: 'pending',
        likes: 0,
        dislikes: 0,
        comments: [],
        candidate_responses: []
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('خطا در ایجاد انتظار:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('خطا در ایجاد انتظار:', error);
    return null;
  }
}

/**
 * افزودن پاسخ کاندیدا به انتظار
 * 
 * @param {string} expectationId شناسه انتظار
 * @param {string} candidateId شناسه کاندیدا
 * @param {object} responseData اطلاعات پاسخ
 * @returns {Promise<boolean>} نتیجه افزودن پاسخ
 * 
 * @example
 * // افزودن پاسخ کاندیدا
 * const success = await expectationsApi.addCandidateResponse('exp123', 'candidate456', {
 *   content: 'متن پاسخ',
 *   action_plan: ['گام اول', 'گام دوم'],
 *   estimated_time: '1402/06/01'
 * });
 */
export async function addCandidateResponse(
  expectationId: string,
  candidateId: string,
  responseData: {
    content: string;
    action_plan: string[];
    estimated_time: string;
  }
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('add_candidate_response', {
      expectation_id: expectationId,
      candidate_id: candidateId,
      content: responseData.content,
      action_plan: responseData.action_plan,
      estimated_time: responseData.estimated_time
    });
    
    if (error) {
      console.error('خطا در افزودن پاسخ کاندیدا:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در افزودن پاسخ کاندیدا:', error);
    return false;
  }
}

/**
 * افزودن نظر به انتظار
 * 
 * @param {string} expectationId شناسه انتظار
 * @param {string} userId شناسه کاربر
 * @param {string} content متن نظر
 * @param {boolean} isAnonymous آیا نظر ناشناس باشد
 * @returns {Promise<boolean>} نتیجه افزودن نظر
 * 
 * @example
 * // افزودن نظر
 * const success = await expectationsApi.addComment('exp123', 'user456', 'متن نظر', true);
 */
export async function addComment(
  expectationId: string,
  userId: string,
  content: string,
  isAnonymous: boolean = false
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('add_expectation_comment', {
      expectation_id: expectationId,
      user_id: userId,
      content,
      is_anonymous: isAnonymous
    });
    
    if (error) {
      console.error('خطا در افزودن نظر به انتظار:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در افزودن نظر به انتظار:', error);
    return false;
  }
}

/**
 * واکنش به انتظار (لایک/دیسلایک)
 * 
 * @param {string} expectationId شناسه انتظار
 * @param {string} userId شناسه کاربر
 * @param {string} reactionType نوع واکنش ('like' یا 'dislike')
 * @returns {Promise<boolean>} نتیجه واکنش
 * 
 * @example
 * // لایک کردن انتظار
 * const success = await expectationsApi.reactToExpectation('exp123', 'user456', 'like');
 */
export async function reactToExpectation(
  expectationId: string,
  userId: string,
  reactionType: 'like' | 'dislike'
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('react_to_expectation', {
      expectation_id: expectationId,
      user_id: userId,
      reaction_type: reactionType
    });
    
    if (error) {
      console.error('خطا در واکنش به انتظار:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در واکنش به انتظار:', error);
    return false;
  }
}

/**
 * بروزرسانی وضعیت انتظار
 * 
 * @param {string} expectationId شناسه انتظار
 * @param {string} status وضعیت جدید
 * @returns {Promise<boolean>} نتیجه بروزرسانی
 * 
 * @example
 * // بروزرسانی وضعیت انتظار
 * const success = await expectationsApi.updateStatus('exp123', 'in_progress');
 */
export async function updateStatus(expectationId: string, status: 'pending' | 'in_progress' | 'completed'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('expectations')
      .update({ status })
      .eq('id', expectationId);
    
    if (error) {
      console.error('خطا در بروزرسانی وضعیت انتظار:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در بروزرسانی وضعیت انتظار:', error);
    return false;
  }
}

/**
 * حذف انتظار
 * 
 * @param {string} expectationId شناسه انتظار
 * @returns {Promise<boolean>} نتیجه حذف
 * 
 * @example
 * // حذف انتظار
 * const success = await expectationsApi.deleteExpectation('exp123');
 */
export async function deleteExpectation(expectationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('expectations')
      .delete()
      .eq('id', expectationId);
    
    if (error) {
      console.error('خطا در حذف انتظار:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در حذف انتظار:', error);
    return false;
  }
}

export const expectationsApi = {
  getExpectations,
  getExpectation,
  createExpectation,
  addCandidateResponse,
  addComment,
  reactToExpectation,
  updateStatus,
  deleteExpectation
};