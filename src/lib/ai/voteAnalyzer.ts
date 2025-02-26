import * as tf from '@tensorflow/tfjs';
import { Chart } from 'chart.js/auto';
import { Vote, VoteAnalysis, VotingPattern } from '../../types';

export class VoteAnalyzer {
  private model: tf.LayersModel | null = null;
  
  constructor() {
    this.initializeModel();
  }
  
  private async initializeModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 32, activation: 'relu', inputShape: [10] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
      ]
    });
    
    await this.trainModel();
  }
  
  private async trainModel() {
    // آموزش مدل با داده‌های تاریخی
    const trainingData = {
      inputs: [
        // ویژگی‌های رای‌ها: زمان، موقعیت جغرافیایی، رسته صنفی و...
      ],
      outputs: [
        // الگوهای رای‌دهی
      ]
    };
    
    if (this.model) {
      await this.model.fit(
        tf.tensor2d(trainingData.inputs),
        tf.tensor2d(trainingData.outputs),
        {
          epochs: 50,
          batchSize: 32,
          validationSplit: 0.2
        }
      );
    }
  }
  
  public async analyzeVotes(votes: Vote[]): Promise<VoteAnalysis> {
    // تحلیل آماری رای‌ها
    const totalVotes = votes.length;
    const participationRate = this.calculateParticipationRate(votes);
    const patterns = await this.detectVotingPatterns(votes);
    const trends = this.analyzeTrends(votes);
    const anomalies = await this.detectAnomalies(votes);
    
    return {
      totalVotes,
      participationRate,
      patterns,
      trends,
      anomalies,
      recommendations: this.generateRecommendations({
        participationRate,
        patterns,
        anomalies
      })
    };
  }
  
  private calculateParticipationRate(votes: Vote[]): number {
    // محاسبه نرخ مشارکت
    const totalEligibleVoters = 1000; // باید از دیتابیس خوانده شود
    return (votes.length / totalEligibleVoters) * 100;
  }
  
  private async detectVotingPatterns(votes: Vote[]): Promise<VotingPattern[]> {
    if (!this.model) return [];
    
    // استخراج ویژگی‌ها از رای‌ها
    const features = this.extractVoteFeatures(votes);
    
    // پیش‌بینی الگوها
    const predictions = this.model.predict(tf.tensor2d([features])) as tf.Tensor;
    const patterns = await predictions.data();
    
    // تفسیر نتایج
    return this.interpretPatterns(Array.from(patterns));
  }
  
  private extractVoteFeatures(votes: Vote[]): number[] {
    // استخراج ویژگی‌های مهم از رای‌ها
    const features = [];
    
    // زمان‌بندی رای‌ها
    const voteTimes = votes.map(v => new Date(v.timestamp).getHours());
    features.push(
      Math.min(...voteTimes) / 24,
      Math.max(...voteTimes) / 24,
      this.calculateStandardDeviation(voteTimes) / 24
    );
    
    // توزیع جغرافیایی
    const locations = votes.map(v => v.location);
    features.push(
      this.calculateLocationDiversity(locations)
    );
    
    // توزیع رسته‌های صنفی
    const categories = votes.map(v => v.businessCategory);
    features.push(
      this.calculateCategoryDiversity(categories)
    );
    
    return features;
  }
  
  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
  
  private calculateLocationDiversity(locations: string[]): number {
    const uniqueLocations = new Set(locations);
    return uniqueLocations.size / locations.length;
  }
  
  private calculateCategoryDiversity(categories: string[]): number {
    const uniqueCategories = new Set(categories);
    return uniqueCategories.size / categories.length;
  }
  
  private interpretPatterns(patterns: number[]): VotingPattern[] {
    const interpretedPatterns: VotingPattern[] = [];
    
    // تفسیر الگوهای شناسایی شده
    if (patterns[0] > 0.5) {
      interpretedPatterns.push({
        type: 'time_based',
        description: 'الگوی رای‌دهی زمان‌محور',
        confidence: patterns[0]
      });
    }
    
    if (patterns[1] > 0.5) {
      interpretedPatterns.push({
        type: 'location_based',
        description: 'الگوی رای‌دهی مکان‌محور',
        confidence: patterns[1]
      });
    }
    
    if (patterns[2] > 0.5) {
      interpretedPatterns.push({
        type: 'category_based',
        description: 'الگوی رای‌دهی رسته‌محور',
        confidence: patterns[2]
      });
    }
    
    return interpretedPatterns;
  }
  
  private analyzeTrends(votes: Vote[]) {
    // تحلیل روندها
    const hourlyVotes = this.groupVotesByHour(votes);
    const dailyVotes = this.groupVotesByDay(votes);
    
    return {
      hourly: this.calculateTrends(hourlyVotes),
      daily: this.calculateTrends(dailyVotes)
    };
  }
  
  private groupVotesByHour(votes: Vote[]) {
    const grouped = new Map<number, number>();
    votes.forEach(vote => {
      const hour = new Date(vote.timestamp).getHours();
      grouped.set(hour, (grouped.get(hour) || 0) + 1);
    });
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a - b);
  }
  
  private groupVotesByDay(votes: Vote[]) {
    const grouped = new Map<string, number>();
    votes.forEach(vote => {
      const day = new Date(vote.timestamp).toISOString().split('T')[0];
      grouped.set(day, (grouped.get(day) || 0) + 1);
    });
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b));
  }
  
  private calculateTrends(data: [string | number, number][]) {
    // محاسبه روند با استفاده از رگرسیون خطی ساده
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data.map(([, count]) => count);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return {
      slope,
      intercept,
      direction: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable'
    };
  }
  
  private async detectAnomalies(votes: Vote[]) {
    // شناسایی رای‌های مشکوک
    const anomalies = [];
    
    // بررسی رای‌های تکراری
    const duplicateVotes = this.findDuplicateVotes(votes);
    if (duplicateVotes.length > 0) {
      anomalies.push({
        type: 'duplicate_votes',
        description: 'رای‌های تکراری شناسایی شد',
        count: duplicateVotes.length
      });
    }
    
    // بررسی رای‌های خارج از محدوده زمانی
    const timeAnomalies = this.findTimeAnomalies(votes);
    if (timeAnomalies.length > 0) {
      anomalies.push({
        type: 'time_anomaly',
        description: 'رای‌های خارج از محدوده زمانی مجاز',
        count: timeAnomalies.length
      });
    }
    
    return anomalies;
  }
  
  private findDuplicateVotes(votes: Vote[]) {
    const seen = new Set<string>();
    return votes.filter(vote => {
      const key = `${vote.userId}-${vote.timestamp}`;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
  }
  
  private findTimeAnomalies(votes: Vote[]) {
    const validStartTime = 8; // ساعت شروع رای‌گیری
    const validEndTime = 18; // ساعت پایان رای‌گیری
    
    return votes.filter(vote => {
      const hour = new Date(vote.timestamp).getHours();
      return hour < validStartTime || hour >= validEndTime;
    });
  }
  
  private generateRecommendations(analysis: {
    participationRate: number;
    patterns: VotingPattern[];
    anomalies: any[];
  }) {
    const recommendations = [];
    
    // توصیه‌ها بر اساس نرخ مشارکت
    if (analysis.participationRate < 50) {
      recommendations.push({
        type: 'participation',
        description: 'افزایش اطلاع‌رسانی برای بهبود مشارکت',
        priority: 'high'
      });
    }
    
    // توصیه‌ها بر اساس الگوها
    analysis.patterns.forEach(pattern => {
      if (pattern.type === 'time_based' && pattern.confidence > 0.7) {
        recommendations.push({
          type: 'timing',
          description: 'بهینه‌سازی زمان‌بندی رای‌گیری',
          priority: 'medium'
        });
      }
    });
    
    // توصیه‌ها بر اساس ناهنجاری‌ها
    if (analysis.anomalies.length > 0) {
      recommendations.push({
        type: 'security',
        description: 'تقویت مکانیزم‌های امنیتی',
        priority: 'high'
      });
    }
    
    return recommendations;
  }
  
  public generateReport(analysis: VoteAnalysis): Chart {
    // ایجاد نمودار تحلیلی
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['مشارکت', 'الگوها', 'ناهنجاری‌ها'],
        datasets: [{
          label: 'تحلیل رای‌گیری',
          data: [
            analysis.participationRate,
            analysis.patterns.length,
            analysis.anomalies.length
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'گزارش تحلیلی رای‌گیری'
          }
        }
      }
    });
  }
}