import { User } from '@/model/user';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    getUser: () => User | null;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user: User) => set({ user }),
            getUser: () => get().user,
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
