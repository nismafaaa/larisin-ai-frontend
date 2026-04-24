'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  gradient?: boolean;
}

export default function Card({ children, className = '', onClick, gradient }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[20px] shadow-card border transition-all duration-200 ${
        gradient
          ? 'gradient-header text-white border-transparent'
          : 'bg-white border-neutral-border/60'
      } ${onClick ? 'cursor-pointer hover:shadow-lg active:scale-[0.98]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
