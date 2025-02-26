import * as faceapi from 'face-api.js';
import { Camera } from '@mediapipe/camera_utils';
import { FaceDetection } from '@mediapipe/face_detection';

export class FaceVerificationSystem {
  private model: any;
  private camera: any;
  private faceDetector: any;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeSystem();
  }

  private async initializeSystem() {
    try {
      // بارگذاری مدل‌های تشخیص چهره
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

      // راه‌اندازی MediaPipe
      this.faceDetector = new FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing face verification system:', error);
      throw error;
    }
  }

  public async startVerification(videoElement: HTMLVideoElement): Promise<{
    isVerified: boolean;
    confidence: number;
    message: string;
  }> {
    if (!this.isInitialized) {
      throw new Error('Face verification system not initialized');
    }

    try {
      // راه‌اندازی دوربین
      this.camera = new Camera(videoElement, {
        onFrame: async () => {
          await this.faceDetector.send({ image: videoElement });
        },
        width: 640,
        height: 480
      });
      await this.camera.start();

      // تشخیص چهره
      const detections = await faceapi.detectAllFaces(videoElement)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        return {
          isVerified: false,
          confidence: 0,
          message: 'چهره‌ای شناسایی نشد'
        };
      }

      if (detections.length > 1) {
        return {
          isVerified: false,
          confidence: 0,
          message: 'بیش از یک چهره شناسایی شد'
        };
      }

      // بررسی زنده بودن
      const isLive = await this.checkLiveness(videoElement);
      if (!isLive) {
        return {
          isVerified: false,
          confidence: 0,
          message: 'لطفاً از چهره واقعی استفاده کنید'
        };
      }

      // محاسبه اطمینان
      const confidence = this.calculateConfidence(detections[0]);

      return {
        isVerified: confidence > 0.8,
        confidence,
        message: confidence > 0.8 ? 'تایید هویت موفق' : 'تایید هویت ناموفق'
      };
    } catch (error) {
      console.error('Error during face verification:', error);
      throw error;
    } finally {
      if (this.camera) {
        this.camera.stop();
      }
    }
  }

  private async checkLiveness(videoElement: HTMLVideoElement): Promise<boolean> {
    // پیاده‌سازی تشخیص زنده بودن با استفاده از حرکات چهره
    const NUM_FRAMES = 10;
    const frames = [];
    
    for (let i = 0; i < NUM_FRAMES; i++) {
      const detection = await faceapi.detectSingleFace(videoElement).withFaceLandmarks();
      if (detection) {
        frames.push(detection.landmarks.positions);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (frames.length < NUM_FRAMES) {
      return false;
    }

    // بررسی تغییرات طبیعی در موقعیت نقاط چهره
    let movement = 0;
    for (let i = 1; i < frames.length; i++) {
      const diff = this.calculateLandmarksDifference(frames[i], frames[i-1]);
      movement += diff;
    }

    const averageMovement = movement / (frames.length - 1);
    return averageMovement > 0.5 && averageMovement < 5;
  }

  private calculateLandmarksDifference(landmarks1: any[], landmarks2: any[]): number {
    let totalDiff = 0;
    for (let i = 0; i < landmarks1.length; i++) {
      const dx = landmarks1[i].x - landmarks2[i].x;
      const dy = landmarks1[i].y - landmarks2[i].y;
      totalDiff += Math.sqrt(dx * dx + dy * dy);
    }
    return totalDiff / landmarks1.length;
  }

  private calculateConfidence(detection: any): number {
    // محاسبه میزان اطمینان بر اساس کیفیت تشخیص
    const { detection: { score }, landmarks } = detection;
    
    // بررسی کیفیت تشخیص نقاط کلیدی چهره
    const landmarkQuality = this.calculateLandmarkQuality(landmarks);
    
    // ترکیب امتیازها
    return (score + landmarkQuality) / 2;
  }

  private calculateLandmarkQuality(landmarks: any): number {
    // محاسبه کیفیت نقاط کلیدی چهره
    const positions = landmarks.positions;
    let quality = 1;

    // بررسی فاصله بین نقاط کلیدی
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i-1].x;
      const dy = positions[i].y - positions[i-1].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // کاهش کیفیت اگر فاصله‌ها غیرطبیعی باشد
      if (distance > 100 || distance < 1) {
        quality *= 0.9;
      }
    }

    return Math.max(0, Math.min(1, quality));
  }

  public async verifyImage(image1: HTMLImageElement, image2: HTMLImageElement): Promise<{
    isMatch: boolean;
    similarity: number;
  }> {
    if (!this.isInitialized) {
      throw new Error('Face verification system not initialized');
    }

    try {
      // استخراج ویژگی‌های چهره از هر دو تصویر
      const detection1 = await faceapi.detectSingleFace(image1)
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      const detection2 = await faceapi.detectSingleFace(image2)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection1 || !detection2) {
        throw new Error('چهره در یکی از تصاویر یافت نشد');
      }

      // محاسبه شباهت بین دو چهره
      const distance = faceapi.euclideanDistance(
        detection1.descriptor,
        detection2.descriptor
      );

      // تبدیل فاصله به درصد شباهت
      const similarity = Math.max(0, Math.min(1, 1 - distance));

      return {
        isMatch: similarity > 0.6,
        similarity
      };
    } catch (error) {
      console.error('Error comparing faces:', error);
      throw error;
    }
  }
}