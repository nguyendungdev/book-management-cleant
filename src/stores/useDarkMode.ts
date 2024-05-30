import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface DarkModeStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const useDarkModeStore = create<DarkModeStore>()(
  devtools(
    persist(
      (set) => ({
        darkMode: false,
        toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      }),
      {
        name: 'darkModeStore',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export default useDarkModeStore;
