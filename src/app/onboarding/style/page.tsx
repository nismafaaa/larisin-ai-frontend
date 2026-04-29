'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SelectionChip from '@/components/ui/SelectionChip';
import Button from '@/components/ui/Button';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/userService';
import { PROMO_STYLES } from '@/lib/constants';

export default function StylePage() {
  const router = useRouter();
  const { profile, setField } = useBusinessStore();
  const { setOnboarded } = useAuthStore();
  const [selected, setSelected] = useState(profile.gaya_promosi);
  const [loading, setLoading] = useState(false);

  const canContinue = selected !== '';

  const handleNext = async () => {
    const value = PROMO_STYLES.find((s) => s.id === selected)?.label || selected;
    setField('gaya_promosi', value);
    
    setLoading(true);
    try {
      await userService.saveBusinessProfile({
        ...profile,
        gaya_promosi: value,
      });
    } catch (err) {
      console.error('Failed to save business profile:', err);
    }
    setOnboarded(true);
    router.push('/onboarding/loading');
  };

  return (
    <>
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-bold text-text-primary leading-tight">
          Gaya promosi seperti<br />apa yang kamu suka?
        </h1>
        <p className="text-text-secondary text-sm mt-3">
          Pilih sesuai dengan keinginan brand kamu
        </p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-3.5 flex-1 content-start">
        {PROMO_STYLES.map((item) => (
          <SelectionChip
            key={item.id}
            emoji={item.emoji}
            label={item.label}
            example={'example' in item ? item.example : undefined}
            selected={selected === item.id}
            onClick={() => setSelected(item.id)}
          />
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button fullWidth size="lg" onClick={handleNext} disabled={!canContinue} loading={loading}>
          Lanjut
        </Button>
      </div>
    </>
  );
}
