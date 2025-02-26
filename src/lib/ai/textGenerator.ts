import * as tf from '@tensorflow/tfjs';
import natural from 'natural';

interface GenerationOptions {
  maxLength?: number;
  temperature?: number;
  topic?: string;
}

export class TextGenerator {
  private tokenizer: natural.WordTokenizer;
  private model: tf.LayersModel | null = null;
  private vocabulary: string[] = [];
  
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.initializeModel();
  }
  
  private async initializeModel() {
    // ایجاد یک مدل ساده برای تولید متن
    this.model = tf.sequential({
      layers: [
        tf.layers.embedding({ inputDim: 1000, outputDim: 32, inputLength: 10 }),
        tf.layers.lstm({ units: 64, returnSequences: true }),
        tf.layers.lstm({ units: 32 }),
        tf.layers.dense({ units: 1000, activation: 'softmax' })
      ]
    });
    
    // آموزش مدل با داده‌های نمونه
    await this.trainModel();
  }
  
  private async trainModel() {
    // داده‌های آموزشی نمونه
    const sampleTexts = [
      'بهبود وضعیت صنف با استفاده از فناوری‌های نوین',
      'حمایت از کسب و کارهای نوپا و استارتاپ‌ها',
      'برگزاری دوره‌های آموزشی تخصصی برای اعضا',
      'ایجاد فرصت‌های شغلی جدید در حوزه فناوری',
      // اضافه کردن نمونه‌های بیشتر
    ];
    
    // پردازش و آماده‌سازی داده‌ها
    this.vocabulary = [...new Set(sampleTexts.flatMap(text => 
      this.tokenizer.tokenize(text)
    ))];
    
    // تبدیل متن‌ها به تنسور
    const sequences = sampleTexts.map(text => 
      this.textToSequence(text)
    );
    
    // آموزش مدل
    if (this.model) {
      await this.model.fit(
        tf.tensor2d(sequences),
        tf.tensor2d(sequences),
        {
          epochs: 100,
          batchSize: 32
        }
      );
    }
  }
  
  private textToSequence(text: string): number[] {
    return this.tokenizer.tokenize(text)
      .map(token => this.vocabulary.indexOf(token))
      .filter(index => index !== -1);
  }
  
  private sequenceToText(sequence: number[]): string {
    return sequence
      .map(index => this.vocabulary[index])
      .filter(token => token)
      .join(' ');
  }
  
  public async generateText(options: GenerationOptions = {}): Promise<string> {
    const {
      maxLength = 50,
      temperature = 0.7,
      topic = ''
    } = options;
    
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    
    // شروع با کلمات اولیه مرتبط با موضوع
    let sequence = this.textToSequence(topic);
    
    while (sequence.length < maxLength) {
      // پیش‌بینی کلمه بعدی
      const input = tf.tensor2d([sequence]);
      const prediction = this.model.predict(input) as tf.Tensor;
      const probabilities = await prediction.data();
      
      // انتخاب کلمه بعدی با استفاده از دما
      const nextToken = this.sampleWithTemperature(
        Array.from(probabilities),
        temperature
      );
      
      sequence.push(nextToken);
      
      // پاکسازی حافظه
      input.dispose();
      prediction.dispose();
    }
    
    return this.sequenceToText(sequence);
  }
  
  private sampleWithTemperature(probabilities: number[], temperature: number): number {
    // اعمال دما روی احتمالات
    const scaled = probabilities.map(p => Math.log(p) / temperature);
    const expScaled = scaled.map(Math.exp);
    const sum = expScaled.reduce((a, b) => a + b, 0);
    const normalized = expScaled.map(p => p / sum);
    
    // انتخاب تصادفی بر اساس احتمالات
    const random = Math.random();
    let cumSum = 0;
    
    for (let i = 0; i < normalized.length; i++) {
      cumSum += normalized[i];
      if (random < cumSum) return i;
    }
    
    return normalized.length - 1;
  }
}

// نمونه استفاده:
// const generator = new TextGenerator();
// const text = await generator.generateText({
//   topic: 'برنامه‌های پیشنهادی',
//   maxLength: 100,
//   temperature: 0.8
// });