'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SelectionChip from '@/components/ui/SelectionChip';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useBusinessStore } from '@/stores/businessStore';
import { BUSINESS_TYPES } from '@/lib/constants';

export default function BusinessTypePage() {
  const router = useRouter();
  const { profile, setField } = useBusinessStore();
  const [selected, setSelected] = useState(profile.jenis_bisnis);
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
    const value = selected === 'custom' ? custom.trim() : BUSINESS_TYPES.find((b) => b.id === selected)?.label || selected;
    setField('jenis_bisnis', value);
    router.push('/onboarding/target');
  };

  return (
    <>
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-bold text-text-primary leading-tight">
          Apa jenis bisnismu?
        </h1>
        <p className="text-text-secondary text-sm mt-3">
          Pilih sesuai dengan apa yang kamu jual!
        </p>
      </div>

      <div className="flex flex-col gap-3.5 flex-1">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-3.5">
          {BUSINESS_TYPES.map((item) => (
            <SelectionChip
              key={item.id}
              emoji={item.emoji}
              label={item.label}
              selected={selected === item.id}
              onClick={() => handleSelect(item.id)}
            />
          ))}
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-text-primary mb-2">
            Tidak ada yang sesuai?
          </p>
          <Input
            placeholder="Tulis bisnismu sendiri!"
            value={custom}
            onChange={(e) => handleCustom(e.target.value)}
            hint="Contoh: Pupuk kompos"
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