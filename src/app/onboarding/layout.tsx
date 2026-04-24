'use client';

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import ProgressBar from '@/components/ui/ProgressBar';
import { usePathname } from 'next/navigation';

const STEPS = [
  '/onboarding/business-type',
  '/onboarding/target',
  '/onboarding/color',
  '/onboarding/platform',
  '/onboarding/needs',
  '/onboarding/style',
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = STEPS.findIndex((s) => pathname?.includes(s)) + 1;

  return (
    <MobileLayout>
      <div className="pt-10 pb-4">
        <ProgressBar currentStep={currentStep || 1} totalSteps={STEPS.length} />
      </div>
      <div className="flex-1 flex flex-col pb-10">
        {children}
      </div>
    </MobileLayout>
  );
}
