import * as toxicity from '@tensorflow-models/toxicity';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as qna from '@tensorflow-models/qna';

export class ContentModerationSystem {
  private toxicityModel: any;
  private encoderModel: any;
  private qnaModel: any;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeSystem();
  }

  private async initializeSystem() {
    try {
      // بارگذاری مدل‌های مورد نیاز
      this.toxicityModel = await toxicity.load(0.7);
      this.encoderModel = await use.load();
      this.qnaModel = await qna.load();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing content moderation system:', error);
      throw error;
    }
  }

  public async moderateText(text: string): Promise<{
    isAppropriate: boolean;
    issues: string[];
    confidence: number;
  }> {
    if (!this.isInitialized) {
      throw new Error('Content moderation system not initialized');
    }

    try {
      // تحلیل متن برای یافتن محتوای نامناسب
      const predictions = await this.toxicityModel.classify(text);
      
      const issues = [];
      let totalConfidence = 0;
      let toxicCategories = 0;

      for (const prediction of predictions) {
        if (prediction.results[0].match) {
          issues.push(prediction.label);
          totalConfidence += prediction.results[0].probabilities[1];
          toxicCategories++;
        }
      }

      const averageConfidence = toxicCategories > 0 ? totalConfidence / toxicCategories : 1;

      return {
        isAppropriate: issues.length === 0,
        issues,
        confidence: averageConfidence
      };
    } catch (error) {
      console.error('Error moderating text:', error);
      throw error;
    }
  }

  public async analyzeQuestion(question: string, context: string): Promise<{
    isRelevant: boolean;
    suggestedAnswer?: string;
    confidence: number;
  }> {
    if (!this.isInitialized) {
      throw new Error('Content moderation system not initialized');
    }

    try {
      // تحلیل ارتباط سوال با متن
      const answers = await this.qnaModel.findAnswers(question, context);
      
      if (answers.length === 0) {
        return {
          isRelevant: false,
          confidence: 0
        };
      }

      const bestAnswer = answers[0];
      return {
        isRelevant: bestAnswer.score > 0.3,
        suggestedAnswer: bestAnswer.text,
        confidence: bestAnswer.score
      };
    } catch (error) {
      console.error('Error analyzing question:', error);
      throw error;
    }
  }

  public async checkSimilarity(text1: string, text2: string): Promise<{
    similarity: number;
    isDuplicate: boolean;
  }> {
    if (!this.isInitialized) {
      throw new Error('Content moderation system not initialized');
    }

    try {
      // تبدیل متن‌ها به بردار
      const embeddings = await this.encoderModel.embed([text1, text2]);
      
      // محاسبه شباهت کسینوسی
      const similarity = await this.calculateCosineSimilarity(
        embeddings.arraySync()[0],
        embeddings.arraySync()[1]
      );

      return {
        similarity,
        isDuplicate: similarity > 0.8
      };
    } catch (error) {
      console.error('Error checking similarity:', error);
      throw error;
    }
  }

  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
    const norm1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const norm2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (norm1 * norm2);
  }

  public async suggestImprovements(text: string): Promise<{
    suggestions: string[];
    readabilityScore: number;
  }> {
    try {
      // تحلیل متن و ارائه پیشنهادات بهبود
      const suggestions = [];
      let readabilityScore = 1;

      // بررسی طول متن
      if (text.length < 50) {
        suggestions.push('متن کوتاه است. جزئیات بیشتری اضافه کنید.');
        readabilityScore *= 0.8;
      }

      // بررسی تکرار کلمات
      const words = text.split(/\s+/);
      const wordFrequency = new Map<string, number>();
      words.forEach(word => {
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      });

      wordFrequency.forEach((count, word) => {
        if (count > 3) {
          suggestions.push(`کلمه "${word}" زیاد تکرار شده است.`);
          readabilityScore *= 0.9;
        }
      });

      // بررسی علائم نگارشی
      if (!/[.!؟]/.test(text)) {
        suggestions.push('از علائم نگارشی مناسب استفاده کنید.');
        readabilityScore *= 0.9;
      }

      return {
        suggestions,
        readabilityScore: Math.max(0, Math.min(1, readabilityScore))
      };
    } catch (error) {
      console.error('Error suggesting improvements:', error);
      throw error;
    }
  }
}