'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ColorChipProps {
  color: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function ColorChip({
  color,
  label,
  selected,
  onClick,
}: ColorChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 active:scale-95 ${
        selected
          ? 'bg-accent-chat border-2 border-primary shadow-sm'
          : 'bg-neutral-card border-2 border-transparent hover:border-neutral-border'
      }`}
    >
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full shadow-md transition-transform duration-200"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}88, ${color})`,
          }}
        />
        {selected && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
            <Check className="w-3.5 h-3.5 text-white" />
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </button>
  );
}
