'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex justify-center gradient-splash">
      <div className="relative w-full max-w-[430px] md:max-w-[520px] lg:max-w-[600px] min-h-dvh flex items-center justify-center bg-transparent lg:bg-white/10 lg:backdrop-blur-sm p-8 shadow-2xl">
        <div className="bg-white rounded-3xl p-10 w-full text-center animate-slide-up shadow-xl">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Selamat Datang!
          </h1>
          <p className="text-text-secondary text-sm mb-10 leading-relaxed">
            Yuk, kita kenali bisnismu dulu<br />
            biar bisa bantu lebih tepat!
          </p>
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push('/onboarding/business-type')}
          >
            Lanjut
          </Button>
        </div>
      </div>
    </div>
  );
}