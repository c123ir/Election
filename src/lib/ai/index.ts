import { FaceVerificationSystem } from './faceVerification';
import { ContentModerationSystem } from './contentModeration';
import { CafeAnalytics } from './cafeAnalytics';

// Export a single instance of each system
export const faceVerification = new FaceVerificationSystem();
export const contentModeration = new ContentModerationSystem();
export const cafeAnalytics = new CafeAnalytics();

// Helper function to initialize all AI systems
export const initializeAI = async () => {
  try {
    await Promise.all([
      faceVerification.initializeSystem(),
      contentModeration.initializeSystem(),
      cafeAnalytics.initializeModel()
    ]);
    console.log('AI systems initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing AI systems:', error);
    return false;
  }
};