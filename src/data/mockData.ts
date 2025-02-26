// src/data/mockData.ts
import { User, Candidate, BusinessCategory, CandidateMedia } from '../types';

// لیست نام‌های تصادفی فارسی
const firstNames = ['علی', 'محمد', 'حسین', 'رضا', 'مهدی', 'فاطمه', 'زهرا', 'مریم', 'سارا', 'نرگس'];
const lastNames = ['محمدی', 'حسینی', 'رضایی', 'کریمی', 'موسوی', 'هاشمی', 'علوی', 'نوری', 'صادقی', 'اکبری'];

// لیست نام‌های تجاری تصادفی
const businessNames = [
  'فروشگاه کامپیوتر',
  'خدمات فنی رایانه',
  'فروشگاه لوازم جانبی',
  'مرکز خدمات کامپیوتری',
  'کافی‌نت و خدمات اینترنت',
  'فروشگاه ماشین‌های اداری',
  'مرکز تعمیرات تخصصی',
  'فروشگاه قطعات کامپیوتر',
  'خدمات شبکه و پشتیبانی',
  'مرکز فروش نرم‌افزار'
];

// لیست رسته‌های صنفی
const businessCategories: BusinessCategory[] = [
  'computer',
  'office_equipment',
  'internet_cafe',
  'typing_copying',
  'stationery',
  'binding',
  'pos_terminal'
];

export const mockUsers: User[] = [
  {
    id: '1',
    phone: '09123456789',
    full_name: 'حسین آری',
    role: 'candidate',
    business_category: 'office_equipment',
    business_name: 'ماشین‌های اداری آری',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '2',
    phone: '09916406975',
    full_name: 'سید مرتضی اجله',
    role: 'candidate',
    business_category: 'office_equipment',
    business_name: 'ماشین‌های اداری اجله',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '3',
    phone: '09808110376',
    full_name: 'نازنین اسماعیلی طرزی',
    role: 'candidate',
    business_category: 'internet_cafe',
    business_name: 'کافی نت',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '4',
    phone: '09397438266',
    full_name: 'مجتبی حسنی',
    role: 'candidate',
    business_category: 'computer',
    business_name: 'مجتمع کامپیوتر یک دو سه',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '5',
    phone: '09801402323',
    full_name: 'امیرحسین حیدری نژاد',
    role: 'candidate',
    business_category: 'computer',
    business_name: 'کلینیک لپ تاپ',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '6',
    phone: '09916734567',
    full_name: 'رضا خواجگان',
    role: 'candidate',
    business_category: 'internet_cafe',
    business_name: 'کافی نت و خدمات کامپیوتری',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '7',
    phone: '05830479623',
    full_name: 'محمدامین شعبانی رابری',
    role: 'candidate',
    business_category: 'internet_cafe',
    business_name: 'کافی نت شعبانی',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '8',
    phone: '09808888891',
    full_name: 'احمدرضا صداقت نیا',
    role: 'candidate',
    business_category: 'computer',
    business_name: 'شرکت صداقت الکترونیک',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '9',
    phone: '09392485808',
    full_name: 'افسانه کریم الدینی',
    role: 'candidate',
    business_category: 'computer',
    business_name: 'شرکت مهندسی تباشیر',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  },
  {
    id: '10',
    phone: '09926362891',
    full_name: 'محمدمهدی معمارزاده کرمانی',
    role: 'candidate',
    business_category: 'typing_copying',
    business_name: 'خدمات تایپ و تکثیر',
    created_at: '2024-02-23T00:00:00Z',
    is_approved: true
  }
];

// تابع تولید شماره موبایل تصادفی
const generateRandomPhone = () => {
  const prefix = '09';
  const remainingDigits = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return prefix + remainingDigits;
};

// تابع تولید تاریخ تصادفی در بازه 6 ماه گذشته
const generateRandomDate = () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime).toISOString();
};

// تولید 20 عضو تصادفی
export const mockMembers: User[] = Array.from({ length: 20 }, (_, index) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const businessCategory = businessCategories[Math.floor(Math.random() * businessCategories.length)];
  const businessName = businessNames[Math.floor(Math.random() * businessNames.length)] + ' ' + lastName;

  return {
    id: `member-${index + 1}`,
    phone: generateRandomPhone(),
    full_name: `${firstName} ${lastName}`,
    role: 'member',
    business_category: businessCategory,
    business_name: businessName,
    created_at: generateRandomDate(),
    is_approved: Math.random() > 0.2 // 80% احتمال تایید شده بودن
  };
});

// ترکیب همه کاربران
export const allUsers = [...mockUsers, ...mockMembers];

const getAvatarUrl = (userId: string): string => {
  const avatarUrls: { [key: string]: string } = {
    '1': 'https://s33.picofile.com/file/8483052076/01_aari.png',
    '2': 'https://s33.picofile.com/file/8483052084/02_ajelle.png',
    '3': 'https://s33.picofile.com/file/8483052092/03_esmaiili.png',
    '4': 'https://s33.picofile.com/file/8483051384/my_piccc.png',
    '5': 'https://s33.picofile.com/file/8483052100/04_heidaripng.png',
    '6': 'https://s33.picofile.com/file/8483052118/05_khajegan.png',
    '7': 'https://s33.picofile.com/file/8483052134/06_shabani.png',
    '8': 'https://s33.picofile.com/file/8483052126/06_sedaghat.png',
    '9': 'https://s33.picofile.com/file/8483052142/08_karimadini.png',
    '10': 'https://s33.picofile.com/file/8483052150/10_memarzadeh.png'
  };
  return avatarUrls[userId] || `https://source.unsplash.com/random/400x400?face&${userId}`;
};

// تولید رسانه‌های نمونه برای هر کاندیدا
const generateSampleMedia = (candidateId: string): CandidateMedia[] => {
  const sampleVideos = [
    'https://player.vimeo.com/video/824804225',
    'https://player.vimeo.com/video/824799055',
    'https://player.vimeo.com/video/824797748',
    'https://player.vimeo.com/video/824796486'
  ];

  const sampleImages = [
    'https://source.unsplash.com/800x600?computer,technology',
    'https://source.unsplash.com/800x600?office,business',
    'https://source.unsplash.com/800x600?meeting,presentation',
    'https://source.unsplash.com/800x600?workspace,desk'
  ];

  const sampleDocuments = [
    {
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      type: 'pdf'
    },
    {
      url: 'https://calibre-ebook.com/downloads/demos/demo.docx',
      type: 'doc'
    }
  ];

  const media: CandidateMedia[] = [];

  // اضافه کردن ویدیوها
  sampleVideos.forEach((url, index) => {
    media.push({
      id: `video-${candidateId}-${index}`,
      candidate_id: candidateId,
      title: `ویدیوی معرفی برنامه ${index + 1}`,
      description: 'در این ویدیو به معرفی برنامه‌های خود برای بهبود وضعیت صنف می‌پردازم',
      url,
      type: 'video',
      thumbnail_url: `https://source.unsplash.com/800x450?video,presentation&${index}`,
      created_at: generateRandomDate(),
      likes: Math.floor(Math.random() * 50),
      dislikes: Math.floor(Math.random() * 10),
      comments: Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
        id: `comment-${candidateId}-video-${index}-${i}`,
        user_id: mockMembers[Math.floor(Math.random() * mockMembers.length)].id,
        content: 'برنامه‌های خوبی ارائه کردید. امیدوارم در صورت انتخاب شدن به آنها عمل کنید.',
        created_at: generateRandomDate(),
        is_anonymous: Math.random() > 0.5,
        user_name: 'کاربر ناشناس',
        likes: Math.floor(Math.random() * 10),
        dislikes: Math.floor(Math.random() * 3)
      }))
    });
  });

  // اضافه کردن تصاویر
  sampleImages.forEach((url, index) => {
    media.push({
      id: `image-${candidateId}-${index}`,
      candidate_id: candidateId,
      title: `تصویر فعالیت‌های صنفی ${index + 1}`,
      description: 'گزارش تصویری از فعالیت‌های انجام شده در راستای بهبود وضعیت صنف',
      url,
      type: 'image',
      created_at: generateRandomDate(),
      likes: Math.floor(Math.random() * 50),
      dislikes: Math.floor(Math.random() * 10),
      comments: Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
        id: `comment-${candidateId}-image-${index}-${i}`,
        user_id: mockMembers[Math.floor(Math.random() * mockMembers.length)].id,
        content: 'تصاویر گویای فعالیت‌های مثبت شما در صنف است.',
        created_at: generateRandomDate(),
        is_anonymous: Math.random() > 0.5,
        user_name: 'کاربر ناشناس',
        likes: Math.floor(Math.random() * 10),
        dislikes: Math.floor(Math.random() * 3)
      }))
    });
  });

  // اضافه کردن اسناد
  sampleDocuments.forEach((doc, index) => {
    media.push({
      id: `doc-${candidateId}-${index}`,
      candidate_id: candidateId,
      title: `سند برنامه‌های پیشنهادی ${index + 1}`,
      description: 'جزئیات کامل برنامه‌ها و اهداف در قالب یک سند جامع',
      url: doc.url,
      type: 'document',
      file_type: doc.type,
      created_at: generateRandomDate(),
      likes: Math.floor(Math.random() * 30),
      dislikes: Math.floor(Math.random() * 5),
      comments: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        id: `comment-${candidateId}-doc-${index}-${i}`,
        user_id: mockMembers[Math.floor(Math.random() * mockMembers.length)].id,
        content: 'برنامه‌های جامع و کاملی ارائه کرده‌اید.',
        created_at: generateRandomDate(),
        is_anonymous: Math.random() > 0.5,
        user_name: 'کاربر ناشناس',
        likes: Math.floor(Math.random() * 10),
        dislikes: Math.floor(Math.random() * 3)
      }))
    });
  });

  return media;
};

export const mockCandidates: Candidate[] = mockUsers.map(user => ({
  ...user,
  bio: 'توضیحات و سوابق کاری کاندیدا',
  proposals: [
    'بهبود وضعیت صنف',
    'حمایت از کسب و کارهای نوپا',
    'برگزاری دوره‌های آموزشی',
    'ایجاد فرصت‌های شغلی جدید'
  ],
  avatar_url: getAvatarUrl(user.id),
  approved: true,
  media: generateSampleMedia(user.id)
}));