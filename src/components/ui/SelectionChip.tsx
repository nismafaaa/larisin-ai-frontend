'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface SelectionChipProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export default function SelectionChip({
  label,
  emoji,
  selected,
  onClick,
  className = '',
}: SelectionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-200 active:scale-[0.98] shadow-sm ${selected
          ? 'bg-accent-chat border-2 border-primary'
          : 'bg-white border-2 border-neutral-border/50 hover:border-primary/30'
        } ${className}`}
    >
      {emoji && <span className="text-2xl flex-shrink-0">{emoji}</span>}
      <span className="flex-1 font-semibold text-text-primary text-[15px]">{label}</span>
      {selected && (
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </span>
      )}
    </button>
  );
}
