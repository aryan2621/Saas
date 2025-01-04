import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

interface AuthState {
    authCode: string | null;
    setAuthCode: (code: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                authCode: null,
                setAuthCode: (code) => set({ authCode: code }),
            }),
            {
                name: 'auth-store',
                storage: createJSONStorage(() => localStorage),
            },
        ),
    ),
);
