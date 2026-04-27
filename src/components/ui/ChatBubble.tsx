'use client';

import React from 'react';
import Image from 'next/image';

interface ChatBubbleProps {
  role: 'ai' | 'user';
  children: React.ReactNode;
  className?: string;
}

export default function ChatBubble({ role, children, className = '' }: ChatBubbleProps) {
  const isAI = role === 'ai';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2 shadow-sm overflow-hidden border border-neutral-border/30">
          <Image src="/logo/logo-only.png" alt="AI" width={20} height={20} className="object-contain" />
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isAI
            ? 'bubble-ai bg-white shadow-sm text-text-primary'
            : 'bubble-user text-text-primary'
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
