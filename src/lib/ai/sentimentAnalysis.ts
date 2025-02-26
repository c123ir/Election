import * as tf from '@tensorflow/tfjs';
import natural from 'natural';
import compromise from 'compromise';

// تنظیمات اولیه برای تحلیل احساسات به زبان فارسی
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

// آموزش اولیه مدل با داده‌های نمونه فارسی
const trainingData = [
  { text: 'عالی بود', label: 'positive' },
  { text: 'خیلی خوب', label: 'positive' },
  { text: 'راضی هستم', label: 'positive' },
  { text: 'ضعیف بود', label: 'negative' },
  { text: 'بد بود', label: 'negative' },
  { text: 'ناراضی هستم', label: 'negative' },
  // اضافه کردن داده‌های بیشتر برای آموزش بهتر
];

trainingData.forEach(item => {
  classifier.addDocument(item.text, item.label);
});

classifier.train();

export interface SentimentResult {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export const analyzeSentiment = (text: string): SentimentResult => {
  // پیش‌پردازش متن
  const normalizedText = text.trim().toLowerCase();
  const tokens = tokenizer.tokenize(normalizedText);
  
  // تحلیل احساسات با استفاده از compromise
  const doc = compromise(normalizedText);
  const hasPositive = doc.match('#Positive').found;
  const hasNegative = doc.match('#Negative').found;
  
  // محاسبه امتیاز با ترکیب نتایج مختلف
  const classifierResult = classifier.classify(normalizedText);
  const score = classifierResult === 'positive' ? 1 : classifierResult === 'negative' ? -1 : 0;
  
  // محاسبه اطمینان
  const confidence = classifier.getClassifications(normalizedText)[0].value;
  
  // تعیین برچسب نهایی
  let label: 'positive' | 'negative' | 'neutral';
  if (score > 0.3) {
    label = 'positive';
  } else if (score < -0.3) {
    label = 'negative';
  } else {
    label = 'neutral';
  }
  
  return {
    score,
    label,
    confidence
  };
};

export const predictEngagement = async (content: string): Promise<number> => {
  // ایجاد یک مدل ساده برای پیش‌بینی میزان تعامل
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ units: 16, inputShape: [10], activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' })
    ]
  });
  
  // تبدیل متن به بردار ویژگی
  const features = extractFeatures(content);
  
  // پیش‌بینی میزان تعامل
  const prediction = model.predict(tf.tensor2d([features])) as tf.Tensor;
  const result = await prediction.data();
  
  return result[0];
};

const extractFeatures = (content: string): number[] => {
  const features = [];
  
  // طول متن
  features.push(content.length / 1000); // نرمال‌سازی
  
  // تعداد کلمات
  features.push(content.split(/\s+/).length / 100);
  
  // تعداد جملات
  features.push(content.split(/[.!?]+/).length / 10);
  
  // تعداد کاراکترهای خاص
  features.push((content.match(/[!?،]/g) || []).length / 10);
  
  // پر کردن بقیه ویژگی‌ها با مقادیر پیش‌فرض
  while (features.length < 10) {
    features.push(0);
  }
  
  return features;
};