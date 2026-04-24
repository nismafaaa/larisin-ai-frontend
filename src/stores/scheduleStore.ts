'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScheduleItem } from '@/types';

interface ScheduleState {
  items: ScheduleItem[];
  selectedDate: string | null;
  addItem: (item: ScheduleItem) => void;
  removeItem: (id: string) => void;
  getItemsByDate: (date: string) => ScheduleItem[];
  setSelectedDate: (date: string | null) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedDate: null,
      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      getItemsByDate: (date) =>
        get().items.filter((item) => item.date === date),
      setSelectedDate: (date) => set({ selectedDate: date }),
    }),
    {
      name: 'larisin-schedule',
    }
  )
);
