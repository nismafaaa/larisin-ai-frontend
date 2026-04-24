'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: Partial<User>) => void;
  setOnboarded: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isOnboarded: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
        set({ user, token, isAuthenticated: true });
      },
      setUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setOnboarded: (value) => set({ isOnboarded: value }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        set({ user: null, token: null, isAuthenticated: false, isOnboarded: false });
      },
    }),
    {
      name: 'larisin-auth',
    }
  )
);
