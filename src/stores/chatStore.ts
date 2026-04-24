'use client';

import { create } from 'zustand';
import type { ChatMessage, ChatStep } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  currentStep: ChatStep;
  selectedRatio: string;
  selectedFunction: string;
  selectedImage: File | null;
  selectedImageUrl: string;
  resultImageUrl: string;
  selectedCaption: string;
  selectedHashtags: string[];
  retryCountImage: number;
  retryCountCaption: number;
  addMessage: (message: ChatMessage) => void;
  setStep: (step: ChatStep) => void;
  setSelectedRatio: (ratio: string) => void;
  setSelectedFunction: (fn: string) => void;
  setSelectedImage: (file: File | null, url: string) => void;
  setResultImageUrl: (url: string) => void;
  setSelectedCaption: (caption: string) => void;
  setSelectedHashtags: (hashtags: string[]) => void;
  incrementRetryImage: () => void;
  incrementRetryCaption: () => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  currentStep: 'profile-review',
  selectedRatio: '',
  selectedFunction: '',
  selectedImage: null,
  selectedImageUrl: '',
  resultImageUrl: '',
  selectedCaption: '',
  selectedHashtags: [],
  retryCountImage: 0,
  retryCountCaption: 0,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setStep: (step) => set({ currentStep: step }),
  setSelectedRatio: (ratio) => set({ selectedRatio: ratio }),
  setSelectedFunction: (fn) => set({ selectedFunction: fn }),
  setSelectedImage: (file, url) => set({ selectedImage: file, selectedImageUrl: url }),
  setResultImageUrl: (url) => set({ resultImageUrl: url }),
  setSelectedCaption: (caption) => set({ selectedCaption: caption }),
  setSelectedHashtags: (hashtags) => set({ selectedHashtags: hashtags }),
  incrementRetryImage: () =>
    set((state) => ({ retryCountImage: state.retryCountImage + 1 })),
  incrementRetryCaption: () =>
    set((state) => ({ retryCountCaption: state.retryCountCaption + 1 })),
  resetChat: () =>
    set({
      messages: [],
      currentStep: 'profile-review',
      selectedRatio: '',
      selectedFunction: '',
      selectedImage: null,
      selectedImageUrl: '',
      resultImageUrl: '',
      selectedCaption: '',
      selectedHashtags: [],
      retryCountImage: 0,
      retryCountCaption: 0,
    }),
}));
