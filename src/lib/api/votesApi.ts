/**
 * ماژول API رأی‌گیری
 * 
 * این ماژول توابع مربوط به رأی‌گیری را پیاده‌سازی می‌کند
 * شامل ثبت رأی، دریافت نتایج و بررسی رأی کاربر
 */
import { supabase } from '../supabase';

/**
 * ثبت رأی
 * 
 * @param {string} voterId شناسه رأی‌دهنده
 * @param {string} candidateId شناسه کاندیدا
 * @returns {Promise<boolean>} نتیجه ثبت رأی
 * 
 * @example
 * // ثبت رأی
 * const success = await votesApi.castVote('user123', 'candidate456');
 */
export async function castVote(voterId: string, candidateId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('cast_vote', {
      voter: voterId,
      candidate: candidateId
    });
    
    if (error) {
      console.error('خطا در ثبت رأی:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در ثبت رأی:', error);
    return false;
  }
}

/**
 * دریافت نتایج رأی‌گیری
 * 
 * @returns {Promise<Array<{candidate_id: string, candidate_name: string, votes_count: number}>>} نتایج رأی‌گیری
 * 
 * @example
 * // دریافت نتایج
 * const results = await votesApi.getResults();
 */
export async function getResults(): Promise<Array<{candidate_id: string, candidate_name: string, votes_count: number}>> {
  try {
    const { data, error } = await supabase.rpc('get_vote_results');
    
    if (error) {
      console.error('خطا در دریافت نتایج رأی‌گیری:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('خطا در دریافت نتایج رأی‌گیری:', error);
    return [];
  }
}

/**
 * بررسی رأی کاربر
 * 
 * @param {string} userId شناسه کاربر
 * @returns {Promise<string | null>} شناسه کاندیدای انتخاب شده یا null
 * 
 * @example
 * // بررسی رأی کاربر
 * const candidateId = await votesApi.getUserVote('user123');
 */
export async function getUserVote(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('candidate_id')
      .eq('voter_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // کاربر هنوز رأی نداده است
        return null;
      }
      console.error('خطا در بررسی رأی کاربر:', error);
      return null;
    }
    
    return data.candidate_id;
  } catch (error) {
    console.error('خطا در بررسی رأی کاربر:', error);
    return null;
  }
}

/**
 * بررسی آیا کاربر رأی داده است
 * 
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} آیا کاربر رأی داده است
 * 
 * @example
 * // بررسی رأی دادن کاربر
 * const hasVoted = await votesApi.hasUserVoted('user123');
 */
export async function hasUserVoted(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('has_user_voted', {
      user_id: userId
    });
    
    if (error) {
      console.error('خطا در بررسی رأی کاربر:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('خطا در بررسی رأی کاربر:', error);
    return false;
  }
}

/**
 * دریافت تعداد کل آرا
 * 
 * @returns {Promise<number>} تعداد کل آرا
 * 
 * @example
 * // دریافت تعداد کل آرا
 * const totalVotes = await votesApi.getTotalVotes();
 */
export async function getTotalVotes(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('votes')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('خطا در دریافت تعداد کل آرا:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('خطا در دریافت تعداد کل آرا:', error);
    return 0;
  }
}

/**
 * دریافت آمار مشارکت
 * 
 * @returns {Promise<number>} درصد مشارکت
 * 
 * @example
 * // دریافت آمار مشارکت
 * const participationRate = await votesApi.getParticipationRate();
 */
export async function getParticipationRate(): Promise<number> {
  try {
    // دریافت تعداد کل آرا
    const { count: votesCount, error: votesError } = await supabase
      .from('votes')
      .select('*', { count: 'exact' });
    
    if (votesError) {
      console.error('خطا در دریافت تعداد کل آرا:', votesError);
      return 0;
    }
    
    // دریافت تعداد کل کاربران
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'member')
      .eq('is_approved', true);
    
    if (usersError) {
      console.error('خطا در دریافت تعداد کل کاربران:', usersError);
      return 0;
    }
    
    // محاسبه درصد مشارکت
    if (usersCount === 0) return 0;
    return (votesCount || 0) / (usersCount || 1) * 100;
  } catch (error) {
    console.error('خطا در دریافت آمار مشارکت:', error);
    return 0;
  }
}

export const votesApi = {
  castVote,
  getResults,
  getUserVote,
  hasUserVoted,
  getTotalVotes,
  getParticipationRate
};