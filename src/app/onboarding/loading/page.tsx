'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-10">
      {/* Animated spinner */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-border" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-3xl">🚀</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Bisnismu siap kami bantu!
        </h2>
        <p className="text-text-secondary text-sm">
          Sedang menyiapkan asisten AI untukmu...
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}