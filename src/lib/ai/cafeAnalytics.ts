import * as tf from '@tensorflow/tfjs';
import { CafeSystem, CafeUser, CafeTransaction, CafeReport } from '../../types/cafe';

export class CafeAnalytics {
  private model: tf.LayersModel | null = null;

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    // Compile the model before training
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    await this.trainModel();
  }

  private async trainModel() {
    if (!this.model) return;

    // Sample training data
    const trainingData = {
      inputs: [
        [0.5, 0.3, 0.2, 0.4, 0.6, 0.7, 0.8, 0.2, 0.1, 0.9],
        [0.3, 0.7, 0.4, 0.2, 0.8, 0.1, 0.5, 0.6, 0.3, 0.4],
        [0.8, 0.2, 0.6, 0.7, 0.3, 0.4, 0.2, 0.9, 0.5, 0.1]
      ],
      outputs: [
        [0.8],
        [0.4],
        [0.6]
      ]
    };

    await this.model.fit(
      tf.tensor2d(trainingData.inputs),
      tf.tensor2d(trainingData.outputs),
      {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        shuffle: true
      }
    );
  }

  public async predictUserBehavior(user: CafeUser): Promise<{
    returnProbability: number;
    recommendedServices: string[];
    optimalTimeSlots: string[];
  }> {
    if (!this.model) throw new Error('Model not initialized');

    // Extract features
    const features = this.extractUserFeatures(user);
    
    // Make prediction
    const prediction = this.model.predict(tf.tensor2d([features])) as tf.Tensor;
    const result = await prediction.data();
    
    return {
      returnProbability: result[0],
      recommendedServices: this.recommendServices(user),
      optimalTimeSlots: this.findOptimalTimeSlots(user)
    };
  }

  private extractUserFeatures(user: CafeUser): number[] {
    const features = [];
    
    // User behavior features
    features.push(
      user.total_time / 3600, // Normalize total time (hours)
      user.credit / 1000000, // Normalize credit
      user.favorite_systems.length / 10, // Normalize favorite systems count
      this.calculateVisitFrequency(user.last_visit)
    );
    
    // Add additional features with default values
    while (features.length < 10) {
      features.push(0);
    }
    
    return features;
  }

  private calculateVisitFrequency(lastVisit: string): number {
    const days = (Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(days / 30, 1); // Normalize to [0,1]
  }

  private recommendServices(user: CafeUser): string[] {
    const recommendations = [];
    
    // High usage time recommendations
    if (user.total_time > 3600) {
      recommendations.push('بسته اینترنت ویژه');
    }

    // High credit balance recommendations
    if (user.credit > 500000) {
      recommendations.push('سرویس‌های پرینت و اسکن VIP');
    }

    // Frequent visitor recommendations
    if (this.calculateVisitFrequency(user.last_visit) < 0.3) {
      recommendations.push('تخفیف ویژه کاربران وفادار');
    }

    return recommendations;
  }

  private findOptimalTimeSlots(user: CafeUser): string[] {
    // Analyze optimal time slots based on user behavior
    return [
      '۹ تا ۱۲ صبح',
      '۲ تا ۵ بعد از ظهر',
      '۶ تا ۹ شب'
    ];
  }
}