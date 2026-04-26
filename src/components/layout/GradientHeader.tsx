'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GradientHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function GradientHeader({ title, showBack, onBack }: GradientHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="gradient-header px-5 pb-4 pt-6 safe-top rounded-b-3xl">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
    </div>
  );
}
