'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (isAuthenticated && isOnboarded) {
          router.replace('/dashboard');
        } else if (isAuthenticated) {
          router.replace('/welcome');
        } else {
          router.replace('/signin');
        }
      }, 400);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded, router]);

  return (
    <div className="min-h-dvh flex justify-center gradient-splash">
      <div
        className={`relative w-full max-w-[430px] md:max-w-[520px] lg:max-w-[600px] min-h-dvh flex flex-col items-center justify-center bg-transparent transition-opacity duration-400 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center animate-fade-in">
          <Image
            src="/logo/logo-splash.png"
            alt="LarisinAi — AI untuk UMKM, Jualan Makin Laris!"
            width={280}
            height={100}
            style={{ width: 'auto', height: 'auto', maxWidth: '280px' }}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
