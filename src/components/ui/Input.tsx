'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-5 py-3.5 rounded-2xl border border-neutral-border bg-neutral-card text-text-primary placeholder:text-text-secondary/50 text-sm transition-all duration-200 ${
          error ? 'border-state-error ring-2 ring-state-error/20' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-state-error ml-1">{error}</p>}
      {hint && !error && <p className="text-xs text-text-secondary ml-1">{hint}</p>}
    </div>
  );
}
