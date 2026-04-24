'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BusinessProfile } from '@/types';

interface BusinessState {
  profile: BusinessProfile;
  setField: <K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) => void;
  setProfile: (data: Partial<BusinessProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: BusinessProfile = {
  nama_bisnis: '',
  jenis_bisnis: '',
  target_pembeli: '',
  warna_utama_brand: '',
  platform_penjualan: [],
  kebutuhan: [],
  gaya_promosi: '',
};

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      profile: { ...defaultProfile },
      setField: (key, value) =>
        set((state) => ({
          profile: { ...state.profile, [key]: value },
        })),
      setProfile: (data) =>
        set((state) => ({
          profile: { ...state.profile, ...data },
        })),
      resetProfile: () => set({ profile: { ...defaultProfile } }),
    }),
    {
      name: 'larisin-business',
    }
  )
);
