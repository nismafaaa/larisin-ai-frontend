'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative bg-white rounded-3xl shadow-lg w-full max-w-sm p-7 animate-slide-up z-10">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-card flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
