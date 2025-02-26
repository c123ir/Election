import * as brain from 'brain.js';
import { Candidate, User } from '../../types';

interface RecommendationInput {
  user: User;
  candidates: Candidate[];
}

interface RecommendationResult {
  candidateId: string;
  score: number;
  reasons: string[];
}

// ایجاد شبکه عصبی برای سیستم پیشنهاددهنده
const net = new brain.NeuralNetwork({
  hiddenLayers: [10, 5],
});

// آموزش شبکه با داده‌های نمونه
const trainNetwork = () => {
  const trainingData = [
    {
      input: {
        userBusinessCategory: 1,
        candidateBusinessCategory: 1,
        experienceYears: 0.7,
        proposalsCount: 0.8,
      },
      output: { score: 0.9 }
    },
    // اضافه کردن داده‌های آموزشی بیشتر
  ];

  net.train(trainingData);
};

trainNetwork();

export const getRecommendations = (input: RecommendationInput): RecommendationResult[] => {
  const { user, candidates } = input;
  
  return candidates.map(candidate => {
    // تبدیل ویژگی‌ها به فرمت مناسب برای شبکه عصبی
    const features = {
      userBusinessCategory: normalizeCategory(user.business_category),
      candidateBusinessCategory: normalizeCategory(candidate.business_category),
      experienceYears: normalizeExperience(candidate),
      proposalsCount: normalizeProposals(candidate),
    };
    
    // پیش‌بینی امتیاز تناسب
    const result = net.run(features) as { score: number };
    
    // تولید دلایل پیشنهاد
    const reasons = generateReasons(user, candidate, result.score);
    
    return {
      candidateId: candidate.id,
      score: result.score,
      reasons,
    };
  }).sort((a, b) => b.score - a.score);
};

const normalizeCategory = (category: string | undefined): number => {
  // تبدیل دسته‌بندی به عدد نرمال شده
  const categories = Object.keys(BUSINESS_CATEGORIES);
  return category ? categories.indexOf(category) / categories.length : 0;
};

const normalizeExperience = (candidate: Candidate): number => {
  // محاسبه و نرمال‌سازی سابقه کار
  const created = new Date(candidate.created_at);
  const now = new Date();
  const years = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.min(years / 10, 1);
};

const normalizeProposals = (candidate: Candidate): number => {
  // نرمال‌سازی تعداد پیشنهادات
  return candidate.proposals ? Math.min(candidate.proposals.length / 10, 1) : 0;
};

const generateReasons = (user: User, candidate: Candidate, score: number): string[] => {
  const reasons: string[] = [];
  
  // بررسی تطابق رسته صنفی
  if (user.business_category === candidate.business_category) {
    reasons.push('رسته صنفی مشابه با شما');
  }
  
  // بررسی تعداد پیشنهادات
  if (candidate.proposals && candidate.proposals.length > 5) {
    reasons.push('دارای برنامه‌های کاری مشخص و متعدد');
  }
  
  // بررسی امتیاز کلی
  if (score > 0.8) {
    reasons.push('تطابق بالا با نیازهای شما');
  }
  
  return reasons;
};