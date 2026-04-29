'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SelectionChip from '@/components/ui/SelectionChip';
import Button from '@/components/ui/Button';
import { useBusinessStore } from '@/stores/businessStore';
import { NEEDS } from '@/lib/constants';

export default function NeedsPage() {
  const router = useRouter();
  const { profile, setField } = useBusinessStore();
  const [selected, setSelected] = useState<string[]>(profile.kebutuhan);

  const toggleNeed = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((n) => n !== id)
        : [...prev, id]
    );
  };

  const canContinue = selected.length > 0;

  const handleNext = () => {
    const labels = selected.map((id) => NEEDS.find((n) => n.id === id)?.label || id);
    setField('kebutuhan', labels);
    router.push('/onboarding/style');
  };

  return (
    <>
      <div className="mt-4 mb-8">
        <h1 className="text-[28px] font-bold text-text-primary leading-tight">
          Kamu perlu bantuan apa?
        </h1>
        <p className="text-text-secondary text-sm mt-3">
          Pilih hal apa yang ingin kami bantu<br />(boleh lebih dari satu)
        </p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-3.5 flex-1 content-start">
        {NEEDS.map((item) => (
          <SelectionChip
            key={item.id}
            emoji={item.emoji}
            label={item.label}
            selected={selected.includes(item.id)}
            onClick={() => toggleNeed(item.id)}
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