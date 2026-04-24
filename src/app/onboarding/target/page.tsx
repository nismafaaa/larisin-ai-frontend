'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SelectionChip from '@/components/ui/SelectionChip';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useBusinessStore } from '@/stores/businessStore';
import { TARGET_BUYERS } from '@/lib/constants';

export default function TargetPage() {
  const router = useRouter();
  const { profile, setField } = useBusinessStore();
  const [selected, setSelected] = useState(profile.target_pembeli);
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
    const value = selected === 'custom' ? custom.trim() : TARGET_BUYERS.find((b) => b.id === selected)?.label || selected;
    setField('target_pembeli', value);
    router.push('/onboarding/color');
  };

  return (
    <>
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-bold text-text-primary leading-tight">
          Siapa target pembelimu?
        </h1>
        <p className="text-text-secondary text-sm mt-3">
          Pilih siapa yang harus beli produkmu!
        </p>
      </div>

      <div className="flex flex-col gap-3.5 flex-1">
        {TARGET_BUYERS.map((item) => (
          <SelectionChip
            key={item.id}
            emoji={item.emoji}
            label={item.label}
            selected={selected === item.id}
            onClick={() => handleSelect(item.id)}
          />
        ))}

        <div className="mt-6">
          <p className="text-sm font-semibold text-text-primary mb-2">
            Tidak ada yang sesuai?
          </p>
          <Input
            placeholder="Tulis target pembelimu sendiri!"
            value={custom}
            onChange={(e) => handleCustom(e.target.value)}
            hint="Contoh: Seniman"
          />
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button fullWidth size="lg" onClick={handleNext} disabled={!canContinue}>
          Lanjut
        </Button>
      </div>
    </>
  );
}
