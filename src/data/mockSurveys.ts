// src/data/mockSurveys.ts
import { Survey, BusinessCategory } from '../types';
import { mockMembers } from './mockData';

const generateRandomDate = (future = false) => {
  const now = new Date();
  const offset = future ? 30 : -30; // روز
  const date = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000 * Math.random());
  return date.toISOString();
};

export const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'نظرسنجی درباره برگزاری دوره‌های آموزشی',
    description: 'لطفاً نظر خود را درباره نحوه برگزاری دوره‌های آموزشی اعلام کنید',
    business_category: 'computer',
    options: [
      { id: '1', text: 'برگزاری حضوری', votes: 120 },
      { id: '2', text: 'برگزاری آنلاین', votes: 60 },
      { id: '3', text: 'ترکیبی از هر دو', votes: 20 }
    ],
    created_at: generateRandomDate(),
    end_date: generateRandomDate(true),
    total_votes: 200,
    is_active: true,
    participants: mockMembers.slice(0, 200).map(member => member.id),
    created_by: mockMembers[0].id
  },
  {
    id: '2',
    title: 'نظرسنجی درباره زمان برگزاری جلسات صنفی',
    description: 'زمان مناسب برای برگزاری جلسات ماهانه صنف را انتخاب کنید',
    business_category: 'office_equipment',
    options: [
      { id: '1', text: 'صبح (۸ تا ۱۲)', votes: 80 },
      { id: '2', text: 'بعد از ظهر (۱۴ تا ۱۷)', votes: 150 },
      { id: '3', text: 'عصر (۱۷ به بعد)', votes: 70 }
    ],
    created_at: generateRandomDate(),
    end_date: generateRandomDate(true),
    total_votes: 300,
    is_active: true,
    participants: mockMembers.slice(0, 300).map(member => member.id),
    created_by: mockMembers[1].id
  },
  {
    id: '3',
    title: 'نظرسنجی درباره اولویت‌های صنفی',
    description: 'مهمترین موضوعی که باید در اولویت رسیدگی قرار گیرد را انتخاب کنید',
    business_category: 'computer',
    options: [
      { id: '1', text: 'مالیات و عوارض', votes: 250 },
      { id: '2', text: 'بیمه و خدمات درمانی', votes: 180 },
      { id: '3', text: 'آموزش و ارتقای مهارت', votes: 120 },
      { id: '4', text: 'تسهیلات بانکی', votes: 150 }
    ],
    created_at: generateRandomDate(),
    end_date: generateRandomDate(true),
    total_votes: 700,
    is_active: true,
    participants: mockMembers.slice(0, 700).map(member => member.id),
    created_by: mockMembers[2].id
  },
  {
    id: '4',
    title: 'نظرسنجی درباره نحوه اطلاع‌رسانی',
    description: 'روش ارجح خود برای دریافت اخبار و اطلاعیه‌های صنفی را انتخاب کنید',
    business_category: 'internet_cafe',
    options: [
      { id: '1', text: 'پیامک', votes: 300 },
      { id: '2', text: 'کانال تلگرام', votes: 400 },
      { id: '3', text: 'وب‌سایت اتحادیه', votes: 100 },
      { id: '4', text: 'تماس تلفنی', votes: 50 }
    ],
    created_at: generateRandomDate(),
    end_date: generateRandomDate(true),
    total_votes: 850,
    is_active: false,
    participants: mockMembers.slice(0, 850).map(member => member.id),
    created_by: mockMembers[3].id
  }
];