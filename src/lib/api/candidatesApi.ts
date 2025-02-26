/**
 * ماژول API کاندیداها
 * 
 * این ماژول توابع مربوط به مدیریت کاندیداها را پیاده‌سازی می‌کند
 * شامل دریافت، ایجاد، بروزرسانی و تأیید کاندیداها
 */
import { supabase } from '../supabase';
import { Candidate, CandidateMedia } from '../../types';

/**
 * دریافت لیست کاندیداها
 * 
 * @param {object} options گزینه‌های فیلتر
 * @returns {Promise<Candidate[]>} لیست کاندیداها
 * 
 * @example
 * // دریافت همه کاندیداها
 * const candidates = await candidatesApi.getCandidates();
 * 
 * // دریافت کاندیداهای تأیید شده
 * const approvedCandidates = await candidatesApi.getCandidates({ approved: true });
 */
export async function getCandidates(options: { approved?: boolean } = {}): Promise<Candidate[]> {
  try {
    // ابتدا کاربران با نقش کاندیدا را دریافت می‌کنیم
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'candidate');
    
    const { data: users, error: usersError } = await query;
    
    if (usersError) {
      console.error('خطا در دریافت کاندیداها:', usersError);
      return [];
    }
    
    // سپس اطلاعات کاندیداها را دریافت می‌کنیم
    const userIds = users.map(user => user.id);
    
    let candidatesQuery = supabase
      .from('candidates')
      .select('*')
      .in('user_id', userIds);
    
    if (options.approved !== undefined) {
      candidatesQuery = candidatesQuery.eq('approved', options.approved);
    }
    
    const { data: candidatesData, error: candidatesError } = await candidatesQuery;
    
    if (candidatesError) {
      console.error('خطا در دریافت اطلاعات کاندیداها:', candidatesError);
      return [];
    }
    
    // ترکیب اطلاعات کاربران و کاندیداها
    const candidates = users.map(user => {
      const candidateInfo = candidatesData.find(c => c.user_id === user.id);
      return {
        ...user,
        ...candidateInfo
      } as Candidate;
    });
    
    return candidates;
  } catch (error) {
    console.error('خطا در دریافت کاندیداها:', error);
    return [];
  }
}

/**
 * دریافت اطلاعات یک کاندیدا
 * 
 * @param {string} candidateId شناسه کاندیدا
 * @returns {Promise<Candidate | null>} اطلاعات کاندیدا
 * 
 * @example
 * // دریافت اطلاعات کاندیدا
 * const candidate = await candidatesApi.getCandidate('123');
 */
export async function getCandidate(candidateId: string): Promise<Candidate | null> {
  try {
    // ابتدا اطلاعات کاربر را دریافت می‌کنیم
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', candidateId)
      .single();
    
    if (userError) {
      console.error('خطا در دریافت اطلاعات کاربر:', userError);
      return null;
    }
    
    // سپس اطلاعات کاندیدا را دریافت می‌کنیم
    const { data: candidateData, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('user_id', candidateId)
      .single();
    
    if (candidateError) {
      console.error('خطا در دریافت اطلاعات کاندیدا:', candidateError);
      return null;
    }
    
    // ترکیب اطلاعات کاربر و کاندیدا
    return {
      ...userData,
      ...candidateData
    } as Candidate;
  } catch (error) {
    console.error('خطا در دریافت اطلاعات کاندیدا:', error);
    return null;
  }
}

/**
 * ثبت کاندیدا
 * 
 * @param {string} userId شناسه کاربر
 * @param {object} candidateData اطلاعات کاندیدا
 * @returns {Promise<boolean>} نتیجه ثبت
 * 
 * @example
 * // ثبت کاندیدا
 * const success = await candidatesApi.registerCandidate('123', {
 *   bio: 'بیوگرافی',
 *   proposals: ['برنامه 1', 'برنامه 2']
 * });
 */
export async function registerCandidate(
  userId: string,
  candidateData: {
    bio: string;
    proposals: string[];
  }
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('register_candidate', {
      user_id: userId,
      bio: candidateData.bio,
      proposals: candidateData.proposals
    });
    
    if (error) {
      console.error('خطا در ثبت کاندیدا:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در ثبت کاندیدا:', error);
    return false;
  }
}

/**
 * تأیید کاندیدا
 * 
 * @param {string} candidateId شناسه کاندیدا
 * @returns {Promise<boolean>} نتیجه تأیید
 * 
 * @example
 * // تأیید کاندیدا
 * const success = await candidatesApi.approveCandidate('123');
 */
export async function approveCandidate(candidateId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('approve_candidate', {
      candidate_id: candidateId
    });
    
    if (error) {
      console.error('خطا در تأیید کاندیدا:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در تأیید کاندیدا:', error);
    return false;
  }
}

/**
 * دریافت رسانه‌های کاندیدا
 * 
 * @param {string} candidateId شناسه کاندیدا
 * @returns {Promise<CandidateMedia[]>} لیست رسانه‌ها
 * 
 * @example
 * // دریافت رسانه‌های کاندیدا
 * const media = await candidatesApi.getCandidateMedia('123');
 */
export async function getCandidateMedia(candidateId: string): Promise<CandidateMedia[]> {
  try {
    const { data, error } = await supabase
      .from('candidate_media')
      .select('*')
      .eq('candidate_id', candidateId);
    
    if (error) {
      console.error('خطا در دریافت رسانه‌های کاندیدا:', error);
      return [];
    }
    
    return data as CandidateMedia[];
  } catch (error) {
    console.error('خطا در دریافت رسانه‌های کاندیدا:', error);
    return [];
  }
}

/**
 * افزودن رسانه برای کاندیدا
 * 
 * @param {string} candidateId شناسه کاندیدا
 * @param {Partial<CandidateMedia>} mediaData اطلاعات رسانه
 * @returns {Promise<string | null>} شناسه رسانه یا null
 * 
 * @example
 * // افزودن رسانه
 * const mediaId = await candidatesApi.addCandidateMedia('123', {
 *   title: 'عنوان',
 *   description: 'توضیحات',
 *   url: 'https://example.com/image.jpg',
 *   type: 'image'
 * });
 */
export async function addCandidateMedia(
  candidateId: string,
  mediaData: Partial<CandidateMedia>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('candidate_media')
      .insert({
        candidate_id: candidateId,
        ...mediaData,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('خطا در افزودن رسانه:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('خطا در افزودن رسانه:', error);
    return null;
  }
}

/**
 * حذف رسانه کاندیدا
 * 
 * @param {string} mediaId شناسه رسانه
 * @returns {Promise<boolean>} نتیجه حذف
 * 
 * @example
 * // حذف رسانه
 * const success = await candidatesApi.deleteCandidateMedia('123');
 */
export async function deleteCandidateMedia(mediaId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('candidate_media')
      .delete()
      .eq('id', mediaId);
    
    if (error) {
      console.error('خطا در حذف رسانه:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در حذف رسانه:', error);
    return false;
  }
}

/**
 * افزودن نظر به رسانه کاندیدا
 * 
 * @param {string} mediaId شناسه رسانه
 * @param {string} userId شناسه کاربر
 * @param {string} content متن نظر
 * @param {boolean} isAnonymous آیا نظر ناشناس باشد
 * @returns {Promise<boolean>} نتیجه افزودن نظر
 * 
 * @example
 * // افزودن نظر
 * const success = await candidatesApi.addMediaComment('123', 'user456', 'متن نظر', true);
 */
export async function addMediaComment(
  mediaId: string,
  userId: string,
  content: string,
  isAnonymous: boolean = false
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('add_media_comment', {
      media_id: mediaId,
      user_id: userId,
      content,
      is_anonymous: isAnonymous
    });
    
    if (error) {
      console.error('خطا در افزودن نظر به رسانه:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در افزودن نظر به رسانه:', error);
    return false;
  }
}

/**
 * واکنش به رسانه (لایک/دیسلایک)
 * 
 * @param {string} mediaId شناسه رسانه
 * @param {string} userId شناسه کاربر
 * @param {string} reactionType نوع واکنش ('like' یا 'dislike')
 * @returns {Promise<boolean>} نتیجه واکنش
 * 
 * @example
 * // لایک کردن رسانه
 * const success = await candidatesApi.reactToMedia('123', 'user456', 'like');
 */
export async function reactToMedia(
  mediaId: string,
  userId: string,
  reactionType: 'like' | 'dislike'
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('react_to_media', {
      media_id: mediaId,
      user_id: userId,
      reaction_type: reactionType
    });
    
    if (error) {
      console.error('خطا در واکنش به رسانه:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در واکنش به رسانه:', error);
    return false;
  }
}

export const candidatesApi = {
  getCandidates,
  getCandidate,
  registerCandidate,
  approveCandidate,
  getCandidateMedia,
  addCandidateMedia,
  deleteCandidateMedia,
  addMediaComment,
  reactToMedia
};