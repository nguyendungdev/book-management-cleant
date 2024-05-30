import { UserLoginResponse } from '@/typings/auth';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AuthStore {
  authState?: UserLoginResponse;
  setAuth: (payload: UserLoginResponse) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        authState: undefined,
        setAuth: (payload) => set(() => ({ authState: payload })),
        logout: () =>
          set(() => ({
            authState: undefined,
          })),
      }),
      {
        name: 'authStore',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export default useAuthStore;
