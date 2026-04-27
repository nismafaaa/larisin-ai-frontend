'use client';

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

interface PlatformCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  prominent?: boolean;
}

export default function PlatformCard({
  icon,
  label,
  selected,
  onClick,
  prominent,
}: PlatformCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 active:scale-95 relative z-10 ${
        prominent && !selected ? 'shadow-md scale-[1.02] bg-gradient-to-br from-white to-accent-chat/30 border-2 border-primary/30' : ''
      } ${
        selected
          ? 'bg-accent-light/30 border-2 border-accent-light shadow-sm'
          : prominent
          ? ''
          : 'bg-neutral-card border-2 border-transparent hover:border-neutral-border'
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}
      {icon.startsWith('/') ? (
        <Image src={icon} alt={label} width={prominent ? 44 : 36} height={prominent ? 44 : 36} className="object-contain drop-shadow-sm" />
      ) : (
        <span className={`${prominent ? 'text-4xl drop-shadow-sm' : 'text-3xl'}`}>{icon}</span>
      )}
      <span className={`text-xs font-medium text-center leading-tight ${prominent ? 'text-[13px] font-bold text-primary-dark' : 'text-text-primary'}`}>{label}</span>
    </button>
  );
}
