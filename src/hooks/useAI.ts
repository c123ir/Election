import { useEffect, useState } from 'react';
import { initializeAI, faceVerification, contentModeration, cafeAnalytics } from '../lib/ai';

export const useAI = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const success = await initializeAI();
        setIsInitialized(success);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize AI'));
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    faceVerification,
    contentModeration,
    cafeAnalytics
  };
};