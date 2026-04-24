'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="w-full h-2.5 bg-neutral-border/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-text-secondary font-medium">
        Langkah {currentStep} dari {totalSteps}
      </p>
    </div>
  );
}
