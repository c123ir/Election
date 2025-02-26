/**
 * ماژول API گزارش‌ها
 * 
 * این ماژول توابع مربوط به گزارش‌گیری را پیاده‌سازی می‌کند
 * شامل گزارش‌های آماری، نمودارها و تحلیل‌ها
 */
import { supabase } from '../supabase';

/**
 * دریافت آمار کلی سیستم
 * 
 * @returns {Promise<{
 *   total_users: number;
 *   total_candidates: number;
 *   total_votes: number;
 *   participation_rate: number;
 * }>} آمار کلی سیستم
 * 
 * @example
 * // دریافت آمار کلی
 * const stats = await reportsApi.getSystemStats();
 */
export async function getSystemStats(): Promise<{
  total_users: number;
  total_candidates: number;
  total_votes: number;
  participation_rate: number;
}> {
  try {
    // دریافت تعداد کل کاربران
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact' });
    
    if (usersError) {
      console.error('خطا در دریافت تعداد کاربران:', usersError);
      return { total_users: 0, total_candidates: 0, total_votes: 0, participation_rate: 0 };
    }
    
    // دریافت تعداد کاندیداها
    const { count: candidatesCount, error: candidatesError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact' });
    
    if (candidatesError) {
      console.error('خطا در دریافت تعداد کاندیداها:', candidatesError);
      return { total_users: usersCount || 0, total_candidates: 0, total_votes: 0, participation_rate: 0 };
    }
    
    // دریافت تعداد آرا
    const { count: votesCount, error: votesError } = await supabase
      .from('votes')
      .select('*', { count: 'exact' });
    
    if (votesError) {
      console.error('خطا در دریافت تعداد آرا:', votesError);
      return { 
        total_users: usersCount || 0, 
        total_candidates: candidatesCount || 0, 
        total_votes: 0, 
        participation_rate: 0 
      };
    }
    
    // محاسبه نرخ مشارکت
    const eligibleVoters = (usersCount || 0) - (candidatesCount || 0);
    const participationRate = eligibleVoters > 0 ? ((votesCount || 0) / eligibleVoters) * 100 : 0;
    
    return {
      total_users: usersCount || 0,
      total_candidates: candidatesCount || 0,
      total_votes: votesCount || 0,
      participation_rate: participationRate
    };
  } catch (error) {
    console.error('خطا در دریافت آمار کلی سیستم:', error);
    return { total_users: 0, total_candidates: 0, total_votes: 0, participation_rate: 0 };
  }
}

/**
 * دریافت آمار رأی‌گیری روزانه
 * 
 * @param {object} options گزینه‌های فیلتر
 * @returns {Promise<{date: string, votes: number}[]>} آمار روزانه
 * 
 * @example
 * // دریافت آمار روزانه
 * const dailyStats = await reportsApi.getDailyVoteStats();
 * 
 * // دریافت آمار روزانه در بازه زمانی خاص
 * const filteredStats = await reportsApi.getDailyVoteStats({
 *   start_date: '2023-01-01',
 *   end_date: '2023-01-31'
 * });
 */
export async function getDailyVoteStats(options: { start_date?: string, end_date?: string } = {}): Promise<{date: string, votes: number}[]> {
  try {
    const { data, error } = await supabase.rpc('get_daily_vote_stats', {
      start_date: options.start_date,
      end_date: options.end_date
    });
    
    if (error) {
      console.error('خطا در دریافت آمار روزانه رأی‌گیری:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('خطا در دریافت آمار روزانه رأی‌گیری:', error);
    return [];
  }
}

/**
 * دریافت آمار رأی‌گیری بر اساس رسته صنفی
 * 
 * @returns {Promise<{category_id: string, category_name: string, votes: number}[]>} آمار رسته‌ها
 * 
 * @example
 * // دریافت آمار رسته‌ها
 * const categoryStats = await reportsApi.getCategoryVoteStats();
 */
export async function getCategoryVoteStats(): Promise<{category_id: string, category_name: string, votes: number}[]> {
  try {
    const { data, error } = await supabase.rpc('get_category_vote_stats');
    
    if (error) {
      console.error('خطا در دریافت آمار رأی‌گیری بر اساس رسته صنفی:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('خطا در دریافت آمار رأی‌گیری بر اساس رسته صنفی:', error);
    return [];
  }
}

/**
 * دریافت آمار فعالیت کاربران
 * 
 * @returns {Promise<{
 *   active_users: number;
 *   inactive_users: number;
 *   new_users_last_week: number;
 *   new_users_last_month: number;
 * }>} آمار فعالیت کاربران
 * 
 * @example
 * // دریافت آمار فعالیت کاربران
 * const userActivityStats = await reportsApi.getUserActivityStats();
 */
export async function getUserActivityStats(): Promise<{
  active_users: number;
  inactive_users: number;
  new_users_last_week: number;
  new_users_last_month: number;
}> {
  try {
    const { data, error } = await supabase.rpc('get_user_activity_stats');
    
    if (error) {
      console.error('خطا در دریافت آمار فعالیت کاربران:', error);
      return {
        active_users: 0,
        inactive_users: 0,
        new_users_last_week: 0,
        new_users_last_month: 0
      };
    }
    
    return data || {
      active_users: 0,
      inactive_users: 0,
      new_users_last_week: 0,
      new_users_last_month: 0
    };
  } catch (error) {
    console.error('خطا در دریافت آمار فعالیت کاربران:', error);
    return {
      active_users: 0,
      inactive_users: 0,
      new_users_last_week: 0,
      new_users_last_month: 0
    };
  }
}

/**
 * دریافت آمار نظرسنجی‌ها
 * 
 * @returns {Promise<{
 *   total_surveys: number;
 *   active_surveys: number;
 *   total_votes: number;
 *   average_votes_per_survey: number;
 * }>} آمار نظرسنجی‌ها
 * 
 * @example
 * // دریافت آمار نظرسنجی‌ها
 * const surveyStats = await reportsApi.getSurveyStats();
 */
export async function getSurveyStats(): Promise<{
  total_surveys: number;
  active_surveys: number;
  total_votes: number;
  average_votes_per_survey: number;
}> {
  try {
    // دریافت تعداد کل نظرسنجی‌ها
    const { count: totalSurveys, error: totalError } = await supabase
      .from('surveys')
      .select('*', { count: 'exact' });
    
    if (totalError) {
      console.error('خطا در دریافت تعداد نظرسنجی‌ها:', totalError);
      return { total_surveys: 0, active_surveys: 0, total_votes: 0, average_votes_per_survey: 0 };
    }
    
    // دریافت تعداد نظرسنجی‌های فعال
    const { count: activeSurveys, error: activeError } = await supabase
      .from('surveys')
      .select('*', { count: 'exact' })
      .eq('is_active', true);
    
    if (activeError) {
      console.error('خطا در دریافت تعداد نظرسنجی‌های فعال:', activeError);
      return { 
        total_surveys: totalSurveys || 0, 
        active_surveys: 0, 
        total_votes: 0, 
        average_votes_per_survey: 0 
      };
    }
    
    // دریافت تعداد کل آرا
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('total_votes');
    
    if (surveysError) {
      console.error('خطا در دریافت آرای نظرسنجی‌ها:', surveysError);
      return { 
        total_surveys: totalSurveys || 0, 
        active_surveys: activeSurveys || 0, 
        total_votes: 0, 
        average_votes_per_survey: 0 
      };
    }
    
    const totalVotes = surveys.reduce((sum, survey) => sum + (survey.total_votes || 0), 0);
    const averageVotes = totalSurveys && totalSurveys > 0 ? totalVotes / totalSurveys : 0;
    
    return {
      total_surveys: totalSurveys || 0,
      active_surveys: activeSurveys || 0,
      total_votes: totalVotes,
      average_votes_per_survey: averageVotes
    };
  } catch (error) {
    console.error('خطا در دریافت آمار نظرسنجی‌ها:', error);
    return { total_surveys: 0, active_surveys: 0, total_votes: 0, average_votes_per_survey: 0 };
  }
}

/**
 * دریافت آمار وبینارها
 * 
 * @returns {Promise<{
 *   total_webinars: number;
 *   upcoming_webinars: number;
 *   completed_webinars: number;
 *   total_participants: number;
 * }>} آمار وبینارها
 * 
 * @example
 * // دریافت آمار وبینارها
 * const webinarStats = await reportsApi.getWebinarStats();
 */
export async function getWebinarStats(): Promise<{
  total_webinars: number;
  upcoming_webinars: number;
  completed_webinars: number;
  total_participants: number;
}> {
  try {
    // دریافت تعداد کل وبینارها
    const { count: totalWebinars, error: totalError } = await supabase
      .from('webinars')
      .select('*', { count: 'exact' });
    
    if (totalError) {
      console.error('خطا در دریافت تعداد وبینارها:', totalError);
      return { total_webinars: 0, upcoming_webinars: 0, completed_webinars: 0, total_participants: 0 };
    }
    
    // دریافت تعداد وبینارهای آینده
    const { count: upcomingWebinars, error: upcomingError } = await supabase
      .from('webinars')
      .select('*', { count: 'exact' })
      .eq('status', 'scheduled');
    
    if (upcomingError) {
      console.error('خطا در دریافت تعداد وبینارهای آینده:', upcomingError);
      return { 
        total_webinars: totalWebinars || 0, 
        upcoming_webinars: 0, 
        completed_webinars: 0, 
        total_participants: 0 
      };
    }
    
    // دریافت تعداد وبینارهای پایان یافته
    const { count: completedWebinars, error: completedError } = await supabase
      .from('webinars')
      .select('*', { count: 'exact' })
      .eq('status', 'ended');
    
    if (completedError) {
      console.error('خطا در دریافت تعداد وبینارهای پایان یافته:', completedError);
      return { 
        total_webinars: totalWebinars || 0, 
        upcoming_webinars: upcomingWebinars || 0, 
        completed_webinars: 0, 
        total_participants: 0 
      };
    }
    
    // دریافت تعداد کل شرکت‌کنندگان
    const { data: webinars, error: webinarsError } = await supabase
      .from('webinars')
      .select('participants_count');
    
    if (webinarsError) {
      console.error('خطا در دریافت تعداد شرکت‌کنندگان وبینارها:', webinarsError);
      return { 
        total_webinars: totalWebinars || 0, 
        upcoming_webinars: upcomingWebinars || 0, 
        completed_webinars: completedWebinars || 0, 
        total_participants: 0 
      };
    }
    
    const totalParticipants = webinars.reduce((sum, webinar) => sum + (webinar.participants_count || 0), 0);
    
    return {
      total_webinars: totalWebinars || 0,
      upcoming_webinars: upcomingWebinars || 0,
      completed_webinars: completedWebinars || 0,
      total_participants: totalParticipants
    };
  } catch (error) {
    console.error('خطا در دریافت آمار وبینارها:', error);
    return { total_webinars: 0, upcoming_webinars: 0, completed_webinars: 0, total_participants: 0 };
  }
}

/**
 * دریافت گزارش کامل انتخابات
 * 
 * @returns {Promise<{
 *   election_stats: any;
 *   candidate_results: any[];
 *   daily_votes: any[];
 *   category_stats: any[];
 * }>} گزارش کامل
 * 
 * @example
 * // دریافت گزارش کامل
 * const report = await reportsApi.getFullElectionReport();
 */
export async function getFullElectionReport(): Promise<{
  election_stats: any;
  candidate_results: any[];
  daily_votes: any[];
  category_stats: any[];
}> {
  try {
    // دریافت آمار کلی
    const stats = await getSystemStats();
    
    // دریافت نتایج کاندیداها
    const { data: candidateResults, error: resultsError } = await supabase.rpc('get_vote_results');
    
    if (resultsError) {
      console.error('خطا در دریافت نتایج کاندیداها:', resultsError);
      return { 
        election_stats: stats, 
        candidate_results: [], 
        daily_votes: [], 
        category_stats: [] 
      };
    }
    
    // دریافت آمار روزانه
    const dailyVotes = await getDailyVoteStats();
    
    // دریافت آمار رسته‌ها
    const categoryStats = await getCategoryVoteStats();
    
    return {
      election_stats: stats,
      candidate_results: candidateResults || [],
      daily_votes,
      category_stats: categoryStats
    };
  } catch (error) {
    console.error('خطا در دریافت گزارش کامل انتخابات:', error);
    return { 
      election_stats: await getSystemStats(), 
      candidate_results: [], 
      daily_votes: [], 
      category_stats: [] 
    };
  }
}

export const reportsApi = {
  getSystemStats,
  getDailyVoteStats,
  getCategoryVoteStats,
  getUserActivityStats,
  getSurveyStats,
  getWebinarStats,
  getFullElectionReport
};