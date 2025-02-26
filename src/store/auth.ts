import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, BusinessCategory } from '../types';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { loginUser, logoutUser } from '../lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  register: (data: {
    phone: string;
    full_name: string;
    business_category: BusinessCategory;
    business_name: string;
    logo_url?: string;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      
      register: async (data) => {
        set({ loading: true });
        try {
          // در محیط واقعی: ثبت‌نام کاربر در Supabase
          if (import.meta.env.PROD) {
            const { data: userId, error } = await supabase.rpc('register_user', {
              phone_number: data.phone,
              name: data.full_name,
              business_cat: data.business_category,
              business_name: data.business_name
            });
            
            if (error) {
              console.error('خطا در ثبت‌نام کاربر:', error);
              toast.error('خطا در ثبت‌نام');
              return;
            }
            
            // دریافت اطلاعات کاربر
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (userError) {
              console.error('خطا در دریافت اطلاعات کاربر:', userError);
              toast.error('خطا در دریافت اطلاعات کاربر');
              return;
            }
            
            set({ user: userData as User });
          } else {
            // در محیط توسعه: ایجاد کاربر آزمایشی
            const newUser: User = {
              id: Math.random().toString(36).substr(2, 9),
              ...data,
              role: 'member',
              created_at: new Date().toISOString(),
              is_approved: false,
              privacy_settings: {
                hide_identity: false,
                hide_business_info: false,
                anonymous_chat: false,
                anonymous_voting: false,
                notification_preferences: {
                  email: true,
                  sms: true,
                  webinar_reminders: true,
                  vote_confirmations: true
                }
              }
            };
            
            set({ user: newUser });
          }
          
          toast.success('ثبت‌نام با موفقیت انجام شد. لطفا منتظر تایید مدیر بمانید.');
        } catch (error) {
          console.error('خطا در ثبت‌نام:', error);
          toast.error('خطا در ثبت‌نام');
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      login: async (phone) => {
        set({ loading: true });
        try {
          const success = await loginUser(phone);
          
          if (!success) {
            toast.error('خطا در ورود به سیستم');
          }
        } catch (error) {
          console.error('خطا در ورود به سیستم:', error);
          toast.error('خطا در ورود به سیستم');
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateUser: async (data) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          // در محیط واقعی: بروزرسانی اطلاعات کاربر در Supabase
          if (import.meta.env.PROD) {
            const { error } = await supabase
              .from('users')
              .update(data)
              .eq('id', currentUser.id);
            
            if (error) {
              console.error('خطا در بروزرسانی اطلاعات کاربر:', error);
              toast.error('خطا در بروزرسانی تنظیمات');
              return;
            }
          }
          
          const updatedUser = {
            ...currentUser,
            ...data
          };
          
          set({ user: updatedUser });
          toast.success('تنظیمات با موفقیت بروزرسانی شد');
        } catch (error) {
          console.error('خطا در بروزرسانی تنظیمات:', error);
          toast.error('خطا در بروزرسانی تنظیمات');
          throw error;
        }
      },

      logout: async () => {
        try {
          const success = await logoutUser();
          
          if (!success) {
            toast.error('خطا در خروج از سیستم');
          }
        } catch (error) {
          console.error('خطا در خروج از سیستم:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);