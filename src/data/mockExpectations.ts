// src/data/mockExpectations.ts
import { Expectation, BusinessCategory } from '../types';
import { mockMembers, mockCandidates } from './mockData';
import { format, addMonths } from 'date-fns-jalali';

const generateRandomDate = () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime).toISOString();
};

const sampleExpectations: Partial<Expectation>[] = [
  {
    title: 'برگزاری دوره‌های آموزشی تخصصی',
    description: 'برگزاری دوره‌های آموزشی تخصصی در زمینه تعمیرات و نگهداری سیستم‌های کامپیوتری برای ارتقای سطح دانش فنی اعضای صنف',
    business_category: 'computer',
    priority: 'high',
    status: 'in_progress'
  },
  {
    title: 'حمایت از کسب‌وکارهای نوپا',
    description: 'ارائه تسهیلات و مشاوره به کسب‌وکارهای تازه تأسیس برای کمک به رشد و توسعه آنها',
    business_category: 'office_equipment',
    priority: 'medium',
    status: 'pending'
  },
  {
    title: 'مقابله با فروشندگان غیرمجاز',
    description: 'اتخاذ تدابیر لازم برای جلوگیری از فعالیت فروشندگان غیرمجاز و حمایت از کسب‌وکارهای قانونی',
    business_category: 'computer',
    priority: 'high',
    status: 'pending'
  },
  {
    title: 'بهبود خدمات بیمه‌ای',
    description: 'گسترش پوشش بیمه‌ای و ارائه خدمات درمانی مناسب‌تر برای اعضای صنف و خانواده‌های آنها',
    business_category: 'internet_cafe',
    priority: 'medium',
    status: 'completed'
  }
];

export const mockExpectations: Expectation[] = sampleExpectations.map((exp, index) => {
  const randomMember = mockMembers[Math.floor(Math.random() * mockMembers.length)];
  const created_at = generateRandomDate();
  
  // تولید پاسخ‌های کاندیداها
  const candidateResponses = mockCandidates
    .filter(() => Math.random() > 0.5) // برخی کاندیداها پاسخ می‌دهند
    .map(candidate => ({
      id: `response-${index}-${candidate.id}`,
      candidate_id: candidate.id,
      expectation_id: `exp-${index}`,
      content: 'این موضوع از اولویت‌های اصلی برنامه‌های من است و برای تحقق آن برنامه مشخصی دارم.',
      action_plan: [
        'بررسی دقیق وضعیت موجود',
        'تشکیل کارگروه تخصصی',
        'تدوین برنامه عملیاتی',
        'پیگیری و اجرای مصوبات'
      ],
      estimated_time: format(addMonths(new Date(), 6), 'yyyy/MM/dd'),
      created_at: generateRandomDate(),
      likes: Math.floor(Math.random() * 30),
      dislikes: Math.floor(Math.random() * 10),
      comments: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        id: `comment-response-${index}-${i}`,
        user_id: mockMembers[Math.floor(Math.random() * mockMembers.length)].id,
        content: 'برنامه عملی و قابل اجرایی به نظر می‌رسد.',
        created_at: generateRandomDate(),
        is_anonymous: Math.random() > 0.5,
        user_name: 'کاربر ناشناس',
        likes: Math.floor(Math.random() * 10),
        dislikes: Math.floor(Math.random() * 3)
      }))
    }));

  return {
    id: `exp-${index}`,
    user_id: randomMember.id,
    ...exp,
    created_at,
    likes: Math.floor(Math.random() * 50),
    dislikes: Math.floor(Math.random() * 10),
    comments: Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
      id: `comment-${index}-${i}`,
      user_id: mockMembers[Math.floor(Math.random() * mockMembers.length)].id,
      content: 'این موضوع واقعاً مهم است و باید در اولویت قرار بگیرد.',
      created_at: generateRandomDate(),
      is_anonymous: Math.random() > 0.5,
      user_name: 'کاربر ناشناس',
      likes: Math.floor(Math.random() * 10),
      dislikes: Math.floor(Math.random() * 3)
    })),
    candidate_responses: candidateResponses
  } as Expectation;
});