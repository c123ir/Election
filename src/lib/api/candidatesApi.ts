/**
 * ماژول API کاندیداها
 * 
 * این ماژول توابع مربوط به مدیریت کاندیداها را پیاده‌سازی می‌کند
 * شامل دریافت، ایجاد، بروزرسانی و تأیید کاندیداها
 */
import { query, transaction } from '../mysql';
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
    const users = await query('SELECT * FROM users WHERE role = ?', ['candidate']);
    
    if (users.length === 0) {
      return [];
    }
    
    // سپس اطلاعات کاندیداها را دریافت می‌کنیم
    const userIds = users.map(user => user.id);
    const placeholders = userIds.map(() => '?').join(',');
    
    let candidatesQuery = `SELECT * FROM candidates WHERE user_id IN (${placeholders})`;
    const params = [...userIds];
    
    if (options.approved !== undefined) {
      candidatesQuery += ' AND approved = ?';
      params.push(options.approved ? 1 : 0);
    }
    
    const candidatesData = await query(candidatesQuery, params);
    
    // ترکیب اطلاعات کاربران و کاندیداها
    const candidates = users.map(user => {
      const candidateInfo = candidatesData.find(c => c.user_id === user.id);
      
      if (!candidateInfo) {
        return {
          ...user,
          is_approved: user.is_approved === 1,
          privacy_settings: user.privacy_settings ? JSON.parse(user.privacy_settings) : null
        };
      }
      
      return {
        ...user,
        ...candidateInfo,
        is_approved: user.is_approved === 1,
        approved: candidateInfo.approved === 1,
        proposals: candidateInfo.proposals ? JSON.parse(candidateInfo.proposals) : [],
        privacy_settings: user.privacy_settings ? JSON.parse(user.privacy_settings) : null
      };
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
    const users = await query('SELECT * FROM users WHERE id = ?', [candidateId]);
    
    if (users.length === 0) {
      return null;
    }
    
    const userData = users[0];
    
    // سپس اطلاعات کاندیدا را دریافت می‌کنیم
    const candidates = await query('SELECT * FROM candidates WHERE user_id = ?', [candidateId]);
    
    if (candidates.length === 0) {
      return {
        ...userData,
        is_approved: userData.is_approved === 1,
        privacy_settings: userData.privacy_settings ? JSON.parse(userData.privacy_settings) : null
      };
    }
    
    const candidateData = candidates[0];
    
    // ترکیب اطلاعات کاربر و کاندیدا
    return {
      ...userData,
      ...candidateData,
      is_approved: userData.is_approved === 1,
      approved: candidateData.approved === 1,
      proposals: candidateData.proposals ? JSON.parse(candidateData.proposals) : [],
      privacy_settings: userData.privacy_settings ? JSON.parse(userData.privacy_settings) : null
    };
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
    return await transaction(async (connection) => {
      // بررسی وجود کاربر
      const [users] = await connection.execute('SELECT id FROM users WHERE id = ?', [userId]);
      
      if ((users as any[]).length === 0) {
        throw new Error('کاربر یافت نشد');
      }
      
      // بروزرسانی نقش کاربر
      await connection.execute('UPDATE users SET role = ? WHERE id = ?', ['candidate', userId]);
      
      // بررسی وجود کاندیدا
      const [candidates] = await connection.execute('SELECT user_id FROM candidates WHERE user_id = ?', [userId]);
      
      if ((candidates as any[]).length > 0) {
        // بروزرسانی کاندیدا
        await connection.execute(
          'UPDATE candidates SET bio = ?, proposals = ? WHERE user_id = ?',
          [candidateData.bio, JSON.stringify(candidateData.proposals), userId]
        );
      } else {
        // ایجاد کاندیدا
        await connection.execute(
          'INSERT INTO candidates (user_id, bio, proposals, approved, created_at) VALUES (?, ?, ?, ?, ?)',
          [userId, candidateData.bio, JSON.stringify(candidateData.proposals), 0, new Date()]
        );
      }
      
      return true;
    });
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
    await query('UPDATE candidates SET approved = 1 WHERE user_id = ?', [candidateId]);
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
    const results = await query('SELECT * FROM candidate_media WHERE candidate_id = ?', [candidateId]);
    
    // تبدیل فیلدهای JSON
    return results.map((media: any) => ({
      ...media,
      comments: media.comments ? JSON.parse(media.comments) : []
    }));
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
    const result = await query(
      'INSERT INTO candidate_media (candidate_id, title, description, url, type, file_type, thumbnail_url, created_at, likes, dislikes, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        candidateId,
        mediaData.title || '',
        mediaData.description || '',
        mediaData.url || '',
        mediaData.type || 'image',
        mediaData.file_type || null,
        mediaData.thumbnail_url || null,
        new Date(),
        0,
        0,
        JSON.stringify([])
      ]
    );
    
    if (result.insertId) {
      return result.insertId.toString();
    }
    
    return null;
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
    await query('DELETE FROM candidate_media WHERE id = ?', [mediaId]);
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
    // دریافت اطلاعات کاربر
    const users = await query('SELECT full_name FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      throw new Error('کاربر یافت نشد');
    }
    
    const userName = isAnonymous ? 'کاربر ناشناس' : users[0].full_name;
    
    // دریافت رسانه
    const media = await query('SELECT comments FROM candidate_media WHERE id = ?', [mediaId]);
    
    if (media.length === 0) {
      throw new Error('رسانه یافت نشد');
    }
    
    // ایجاد نظر جدید
    const newComment = {
      id: `comment-${Date.now()}`,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
      is_anonymous: isAnonymous,
      user_name: userName,
      likes: 0,
      dislikes: 0
    };
    
    // بروزرسانی نظرات
    const comments = JSON.parse(media[0].comments || '[]');
    comments.push(newComment);
    
    await query(
      'UPDATE candidate_media SET comments = ? WHERE id = ?',
      [JSON.stringify(comments), mediaId]
    );
    
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
    // بروزرسانی واکنش
    if (reactionType === 'like') {
      await query('UPDATE candidate_media SET likes = likes + 1 WHERE id = ?', [mediaId]);
    } else if (reactionType === 'dislike') {
      await query('UPDATE candidate_media SET dislikes = dislikes + 1 WHERE id = ?', [mediaId]);
    } else {
      throw new Error('نوع واکنش نامعتبر است');
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