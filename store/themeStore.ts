// store/themeStore.ts
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.className = newTheme;
      return { theme: newTheme };
    }),

  loadTheme: () => {
    const stored = localStorage.getItem('theme');
    const finalTheme = stored || 'light';
    document.documentElement.className = finalTheme;
    set({ theme: finalTheme });
  },
}));
