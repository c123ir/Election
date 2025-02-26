import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => {
        const newDarkMode = !state.isDarkMode;
        // اعمال کلاس dark به المنت html
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newDarkMode };
      }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

// اعمال تم ذخیره شده در هنگام لود اولیه
if (typeof window !== 'undefined') {
  const isDarkMode = JSON.parse(localStorage.getItem('theme-storage') || '{}')?.state?.isDarkMode;
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  }
}