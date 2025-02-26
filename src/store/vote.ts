import { create } from 'zustand';
import toast from 'react-hot-toast';
import { votesApi } from '../lib/api';
import { useAuthStore } from './auth';

interface VoteState {
  votes: Record<string, number>;
  userVote: string | null;
  loading: boolean;
  submitVote: (candidateId: string) => Promise<void>;
  getResults: () => { candidateId: string; votes: number }[];
  fetchUserVote: () => Promise<void>;
  fetchResults: () => Promise<void>;
}

export const useVoteStore = create<VoteState>((set, get) => ({
  votes: {},
  userVote: null,
  loading: false,

  submitVote: async (candidateId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      toast.error('لطفا ابتدا وارد سیستم شوید');
      return;
    }
    
    set({ loading: true });
    try {
      // در محیط واقعی: ثبت رأی در Supabase
      if (import.meta.env.PROD) {
        const success = await votesApi.castVote(user.id, candidateId);
        
        if (!success) {
          toast.error('خطا در ثبت رأی');
          return;
        }
      } else {
        // در محیط توسعه: شبیه‌سازی ثبت رأی
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const currentVotes = get().votes;
      set({
        votes: {
          ...currentVotes,
          [candidateId]: (currentVotes[candidateId] || 0) + 1
        },
        userVote: candidateId
      });
      
      toast.success('رأی شما با موفقیت ثبت شد');
    } catch (error) {
      console.error('خطا در ثبت رأی:', error);
      toast.error('خطا در ثبت رأی');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getResults: () => {
    const { votes } = get();
    return Object.entries(votes).map(([candidateId, count]) => ({
      candidateId,
      votes: count
    }));
  },
  
  fetchUserVote: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;
    
    try {
      // در محیط واقعی: دریافت رأی کاربر از Supabase
      if (import.meta.env.PROD) {
        const candidateId = await votesApi.getUserVote(user.id);
        set({ userVote: candidateId });
      }
    } catch (error) {
      console.error('خطا در دریافت رأی کاربر:', error);
    }
  },
  
  fetchResults: async () => {
    try {
      // در محیط واقعی: دریافت نتایج رأی‌گیری از Supabase
      if (import.meta.env.PROD) {
        const results = await votesApi.getResults();
        
        const votesMap: Record<string, number> = {};
        results.forEach(result => {
          votesMap[result.candidate_id] = result.votes_count;
        });
        
        set({ votes: votesMap });
      }
    } catch (error) {
      console.error('خطا در دریافت نتایج رأی‌گیری:', error);
    }
  }
}));