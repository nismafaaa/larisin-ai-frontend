'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlatformCard from '@/components/ui/PlatformCard';
import Button from '@/components/ui/Button';
import { useBusinessStore } from '@/stores/businessStore';
import { PLATFORMS } from '@/lib/constants';

export default function PlatformPage() {
  const router = useRouter();
  const { profile, setField } = useBusinessStore();
  const [selected, setSelected] = useState<string[]>(profile.platform_penjualan);

  const togglePlatform = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const canContinue = selected.length > 0;

  const handleNext = () => {
    const labels = selected.map((id) => PLATFORMS.find((p) => p.id === id)?.label || id);
    setField('platform_penjualan', labels);
    router.push('/onboarding/needs');
  };

  return (
    <>
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-bold text-text-primary leading-tight">
          Kamu biasa jualan di mana?
        </h1>
        <p className="text-text-secondary text-sm mt-3">
          Pilih yang kamu pakai (boleh lebih dari satu)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
        {PLATFORMS.map((item) => (
          <PlatformCard
            key={item.id}
            icon={item.icon}
            label={item.label}
            selected={selected.includes(item.id)}
            onClick={() => togglePlatform(item.id)}
            prominent={item.id === 'shopee' || item.id === 'gofood'}
          />
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button fullWidth size="lg" onClick={handleNext} disabled={!canContinue}>
          Lanjut
        </Button>
      </div>
    </>
  );
}
