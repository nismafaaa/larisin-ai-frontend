'use client';

import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function MobileLayout({
  children,
  className = '',
  noPadding = false,
}: MobileLayoutProps) {
  return (
    <div className="min-h-dvh flex justify-center bg-gray-100">
      <div
        className={`relative w-full max-w-[430px] min-h-dvh bg-white shadow-2xl flex flex-col ${className}`}
      >
        <div className={`flex-1 flex flex-col ${noPadding ? '' : 'px-6'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
