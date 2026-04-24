'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ColorChip from '@/components/ui/ColorChip';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useBusinessStore } from '@/stores/businessStore';
import { BRAND_COLORS } from '@/lib/constants';

export default function ColorPage() {
  const router = useRouter();
  const { profile, setField } = useBusinessStore();
  const [selected, setSelected] = useState(profile.warna_utama_brand);
  const [custom, setCustom] = useState('');

  const handleSelect = (id: string) => {
    setSelected(id);
    setCustom('');
  };

  const handleCustom = (value: string) => {
    setCustom(value);
    if (value.trim()) setSelected('custom');
    else setSelected('');
  };

  const canContinue = selected !== '' && (selected !== 'custom' || custom.trim() !== '');

  const handleNext = () => {
    const value = selected === 'custom' ? custom.trim() : BRAND_COLORS.find((c) => c.id === selected)?.label || selected;
    setField('warna_utama_brand', value);
    router.push('/onboarding/platform');
  };

  return (
    <>
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-bold text-text-primary leading-tight">
          Apa warna utama<br />brand kamu?
        </h1>
        <p className="text-text-secondary text-sm mt-3">
          Pilih sesuai dengan apa yang kamu jual!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1">
        {BRAND_COLORS.map((item) => (
          <ColorChip
            key={item.id}
            color={item.hex}
            label={item.label}
            selected={selected === item.id}
            onClick={() => handleSelect(item.id)}
          />
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-text-primary mb-2">
          Tidak ada yang cocok?
        </p>
        <Input
          placeholder="Tulis warnamu sendiri!"
          value={custom}
          onChange={(e) => handleCustom(e.target.value)}
          hint="Contoh: pink dan hitam"
        />
      </div>

      <div className="mt-auto pt-6">
        <Button fullWidth size="lg" onClick={handleNext} disabled={!canContinue}>
          Lanjut
        </Button>
      </div>
    </>
  );
}
