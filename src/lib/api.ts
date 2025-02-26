/**
 * ماژول API
 * 
 * این ماژول توابع مربوط به ارتباط با API سرور را پیاده‌سازی می‌کند
 * شامل توابع CRUD برای جداول مختلف
 */
import { supabase } from './supabase';
import { Candidate, User, CandidateMedia, Expectation, Survey, ChatRoom, Message } from '../types';

/**
 * API کاربران
 */
export const usersApi = {
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
  async getUsers(options: { is_approved?: boolean, role?: string } = {}): Promise<User[]> {
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
  },
  
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
  async getUser(userId: string): Promise<User | null> {
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
  },
  
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
  async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
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
  },
  
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
  async approveUser(userId: string): Promise<boolean> {
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
  },
  
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
  async registerUser(userData: {
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
};

/**
 * API کاندیداها
 */
export const candidatesApi = {
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
  async getCandidates(options: { approved?: boolean } = {}): Promise<Candidate[]> {
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
  },
  
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
  async getCandidate(candidateId: string): Promise<Candidate | null> {
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
  },
  
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
  async registerCandidate(
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
  },
  
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
  async approveCandidate(candidateId: string): Promise<boolean> {
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
  },
  
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
  async getCandidateMedia(candidateId: string): Promise<CandidateMedia[]> {
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
  },
  
  /**
   * افزودن رسانه برای کاندیدا
   * 
   * @param {string} candidateId شناسه کاندیدا
   * @param {Partial<CandidateMedia>} mediaData اطلاعات رسانه
   * @returns {Promise<boolean>} نتیجه افزودن
   * 
   * @example
   * // افزودن رسانه
   * const success = await candidatesApi.addCandidateMedia('123', {
   *   title: 'عنوان',
   *   description: 'توضیحات',
   *   url: 'https://example.com/image.jpg',
   *   type: 'image'
   * });
   */
  async addCandidateMedia(
    candidateId: string,
    mediaData: Partial<CandidateMedia>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('candidate_media')
        .insert({
          candidate_id: candidateId,
          ...mediaData,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('خطا در افزودن رسانه:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('خطا در افزودن رسانه:', error);
      return false;
    }
  }
};

/**
 * API رأی‌گیری
 */
export const votesApi = {
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
  async castVote(voterId: string, candidateId: string): Promise<boolean> {
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
  },
  
  /**
   * دریافت نتایج رأی‌گیری
   * 
   * @returns {Promise<Array<{candidate_id: string, candidate_name: string, votes_count: number}>>} نتایج رأی‌گیری
   * 
   * @example
   * // دریافت نتایج
   * const results = await votesApi.getResults();
   */
  async getResults(): Promise<Array<{candidate_id: string, candidate_name: string, votes_count: number}>> {
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
  },
  
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
  async getUserVote(userId: string): Promise<string | null> {
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
};

/**
 * API نظرسنجی‌ها
 */
export const surveysApi = {
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
  async getSurveys(options: { is_active?: boolean } = {}): Promise<Survey[]> {
    try {
      let query = supabase.from('surveys').select('*');
      
      if (options.is_active !== undefined) {
        query = query.eq('is_active', options.is_active);
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
  },
  
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
  async createSurvey(surveyData: Partial<Survey>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .insert({
          ...surveyData,
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
  },
  
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
  async voteInSurvey(surveyId: string, optionId: string, userId: string): Promise<boolean> {
    try {
      // ابتدا نظرسنجی را دریافت می‌کنیم
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', surveyId)
        .single();
      
      if (surveyError) {
        console.error('خطا در دریافت نظرسنجی:', surveyError);
        return false;
      }
      
      // بررسی می‌کنیم که کاربر قبلاً رأی نداده باشد
      if (surveyData.participants.includes(userId)) {
        console.error('کاربر قبلاً در این نظرسنجی شرکت کرده است');
        return false;
      }
      
      // بروزرسانی گزینه‌ها
      const updatedOptions = surveyData.options.map(option => {
        if (option.id === optionId) {
          return {
            ...option,
            votes: option.votes + 1
          };
        }
        return option;
      });
      
      // بروزرسانی نظرسنجی
      const { error: updateError } = await supabase
        .from('surveys')
        .update({
          options: updatedOptions,
          total_votes: surveyData.total_votes + 1,
          participants: [...surveyData.participants, userId]
        })
        .eq('id', surveyId);
      
      if (updateError) {
        console.error('خطا در بروزرسانی نظرسنجی:', updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('خطا در ثبت رأی در نظرسنجی:', error);
      return false;
    }
  }
};

/**
 * API انتظارات
 */
export const expectationsApi = {
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
  async getExpectations(options: { business_category?: string, status?: string } = {}): Promise<Expectation[]> {
    try {
      let query = supabase.from('expectations').select('*');
      
      if (options.business_category) {
        query = query.eq('business_category', options.business_category);
      }
      
      if (options.status) {
        query = query.eq('status', options.status);
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
  },
  
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
  async createExpectation(expectationData: Partial<Expectation>): Promise<string | null> {
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
  },
  
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
  async addCandidateResponse(
    expectationId: string,
    candidateId: string,
    responseData: {
      content: string;
      action_plan: string[];
      estimated_time: string;
    }
  ): Promise<boolean> {
    try {
      // ابتدا انتظار را دریافت می‌کنیم
      const { data: expectationData, error: expectationError } = await supabase
        .from('expectations')
        .select('*')
        .eq('id', expectationId)
        .single();
      
      if (expectationError) {
        console.error('خطا در دریافت انتظار:', expectationError);
        return false;
      }
      
      // پاسخ جدید را ایجاد می‌کنیم
      const newResponse = {
        id: `response-${Date.now()}`,
        candidate_id: candidateId,
        expectation_id: expectationId,
        content: responseData.content,
        action_plan: responseData.action_plan,
        estimated_time: responseData.estimated_time,
        created_at: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        comments: []
      };
      
      // پاسخ‌های قبلی را بررسی می‌کنیم
      const candidateResponses = expectationData.candidate_responses || [];
      
      // بررسی می‌کنیم که کاندیدا قبلاً پاسخ نداده باشد
      const existingResponseIndex = candidateResponses.findIndex(
        response => response.candidate_id === candidateId
      );
      
      let updatedResponses;
      if (existingResponseIndex !== -1) {
        // اگر قبلاً پاسخ داده، آن را بروزرسانی می‌کنیم
        updatedResponses = [...candidateResponses];
        updatedResponses[existingResponseIndex] = {
          ...updatedResponses[existingResponseIndex],
          content: responseData.content,
          action_plan: responseData.action_plan,
          estimated_time: responseData.estimated_time
        };
      } else {
        // اگر پاسخ جدید است، آن را اضافه می‌کنیم
        updatedResponses = [...candidateResponses, newResponse];
      }
      
      // انتظار را بروزرسانی می‌کنیم
      const { error: updateError } = await supabase
        .from('expectations')
        .update({
          candidate_responses: updatedResponses
        })
        .eq('id', expectationId);
      
      if (updateError) {
        console.error('خطا در بروزرسانی انتظار:', updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('خطا در افزودن پاسخ کاندیدا:', error);
      return false;
    }
  }
};

/**
 * API چت و پیام‌رسانی
 */
export const chatApi = {
  /**
   * دریافت لیست اتاق‌های چت
   * 
   * @param {object} options گزینه‌های فیلتر
   * @returns {Promise<ChatRoom[]>} لیست اتاق‌های چت
   * 
   * @example
   * // دریافت همه اتاق‌های چت
   * const rooms = await chatApi.getChatRooms();
   * 
   * // دریافت اتاق‌های چت عمومی
   * const publicRooms = await chatApi.getChatRooms({ type: 'public' });
   */
  async getChatRooms(options: { type?: string } = {}): Promise<ChatRoom[]> {
    try {
      let query = supabase.from('chat_rooms').select('*');
      
      if (options.type) {
        query = query.eq('type', options.type);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('خطا در دریافت اتاق‌های چت:', error);
        return [];
      }
      
      return data as ChatRoom[];
    } catch (error) {
      console.error('خطا در دریافت اتاق‌های چت:', error);
      return [];
    }
  },
  
  /**
   * ایجاد اتاق چت جدید
   * 
   * @param {object} roomData اطلاعات اتاق چت
   * @returns {Promise<string | null>} شناسه اتاق چت یا null
   * 
   * @example
   * // ایجاد اتاق چت
   * const roomId = await chatApi.createChatRoom({
   *   title: 'عنوان اتاق',
   *   type: 'public',
   *   created_by: 'user123'
   * });
   */
  async createChatRoom(roomData: {
    title: string;
    type: string;
    created_by: string;
  }): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('create_chat_room', {
        room_title: roomData.title,
        room_type: roomData.type,
        creator_id: roomData.created_by
      });
      
      if (error) {
        console.error('خطا در ایجاد اتاق چت:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('خطا در ایجاد اتاق چت:', error);
      return null;
    }
  },
  
  /**
   * دریافت پیام‌های یک اتاق چت
   * 
   * @param {string} roomId شناسه اتاق چت
   * @returns {Promise<Message[]>} لیست پیام‌ها
   * 
   * @example
   * // دریافت پیام‌های اتاق چت
   * const messages = await chatApi.getChatMessages('room123');
   */
  async getChatMessages(roomId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('خطا در دریافت پیام‌ها:', error);
        return [];
      }
      
      return data as Message[];
    } catch (error) {
      console.error('خطا در دریافت پیام‌ها:', error);
      return [];
    }
  },
  
  /**
   * ارسال پیام در اتاق چت
   * 
   * @param {object} messageData اطلاعات پیام
   * @returns {Promise<string | null>} شناسه پیام یا null
   * 
   * @example
   * // ارسال پیام
   * const messageId = await chatApi.sendMessage({
   *   room_id: 'room123',
   *   sender_id: 'user456',
   *   content: 'متن پیام'
   * });
   */
  async sendMessage(messageData: {
    room_id: string;
    sender_id: string;
    content: string;
  }): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('send_message', {
        room: messageData.room_id,
        sender: messageData.sender_id,
        msg_content: messageData.content
      });
      
      if (error) {
        console.error('خطا در ارسال پیام:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('خطا در ارسال پیام:', error);
      return null;
    }
  },
  
  /**
   * پیوستن به اتاق چت
   * 
   * @param {string} roomId شناسه اتاق چت
   * @param {string} userId شناسه کاربر
   * @returns {Promise<boolean>} نتیجه پیوستن
   * 
   * @example
   * // پیوستن به اتاق چت
   * const success = await chatApi.joinChatRoom('room123', 'user456');
   */
  async joinChatRoom(roomId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_participants')
        .insert({
          room_id: roomId,
          user_id: userId
        });
      
      if (error) {
        console.error('خطا در پیوستن به اتاق چت:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('خطا در پیوستن به اتاق چت:', error);
      return false;
    }
  },
  
  /**
   * حذف پیام
   * 
   * @param {string} messageId شناسه پیام
   * @param {string} userId شناسه کاربر حذف‌کننده
   * @returns {Promise<boolean>} نتیجه حذف
   * 
   * @example
   * // حذف پیام
   * const success = await chatApi.deleteMessage('message123', 'user456');
   */
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({
          is_deleted: true,
          deleted_by: userId
        })
        .eq('id', messageId);
      
      if (error) {
        console.error('خطا در حذف پیام:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('خطا در حذف پیام:', error);
      return false;
    }
  }
};

/**
 * API وبینارها
 */
export const webinarsApi = {
  /**
   * دریافت لیست وبینارها
   * 
   * @param {object} options گزینه‌های فیلتر
   * @returns {Promise<Webinar[]>} لیست وبینارها
   * 
   * @example
   * // دریافت همه وبینارها
   * const webinars = await webinarsApi.getWebinars();
   * 
   * // دریافت وبینارهای در حال پخش
   * const liveWebinars = await webinarsApi.getWebinars({ status: 'live' });
   */
  async getWebinars(options: { status?: string, candidate_id?: string } = {}): Promise<any[]> {
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
  },
  
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
  async createWebinar(webinarData: {
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
  },
  
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
  async registerForWebinar(webinarId: string, userId: string): Promise<boolean> {
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
};