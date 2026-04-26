'use client';

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

interface PlatformCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function PlatformCard({
  icon,
  label,
  selected,
  onClick,
}: PlatformCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 active:scale-95 relative ${
        selected
          ? 'bg-accent-light/30 border-2 border-accent-light shadow-sm'
          : 'bg-neutral-card border-2 border-transparent hover:border-neutral-border'
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}
      {icon.startsWith('/') ? (
        <Image src={icon} alt={label} width={36} height={36} className="object-contain" />
      ) : (
        <span className="text-3xl">{icon}</span>
      )}
      <span className="text-xs font-medium text-text-primary text-center leading-tight">{label}</span>
    </button>
  );
}
