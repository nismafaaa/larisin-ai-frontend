'use client';

import React from 'react';

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
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1">
          <span className="text-sm">🤖</span>
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isAI
            ? 'bubble-ai text-text-primary'
            : 'bubble-user text-text-primary'
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
