'use client';

import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  /** When true the container expands beyond 430 px on lg screens */
  desktopFull?: boolean;
  outerClassName?: string;
}

export default function MobileLayout({
  children,
  className = '',
  outerClassName = 'gradient-dashboard',
  noPadding = false,
  desktopFull = false,
}: MobileLayoutProps) {
  if (desktopFull) {
    return (
      <div className={`min-h-dvh flex justify-center ${outerClassName}`}>
        <div
          className={`relative w-full max-w-[430px] lg:max-w-5xl xl:max-w-6xl min-h-dvh bg-white lg:bg-white/60 lg:backdrop-blur-xl lg:shadow-[0_8px_32px_rgba(0,0,0,0.05)] lg:border-x lg:border-white/50 flex flex-col ${className}`}
        >
          <div className={`flex-1 flex flex-col ${noPadding ? '' : 'px-6 lg:px-10'}`}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-dvh flex justify-center ${outerClassName}`}>
      <div
        className={`relative w-full max-w-[430px] md:max-w-[520px] min-h-dvh bg-white md:bg-white/60 md:backdrop-blur-xl md:shadow-[0_8px_32px_rgba(0,0,0,0.05)] md:border-x md:border-white/50 flex flex-col ${className}`}
      >
        <div className={`flex-1 flex flex-col ${noPadding ? '' : 'px-6 md:px-8'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
