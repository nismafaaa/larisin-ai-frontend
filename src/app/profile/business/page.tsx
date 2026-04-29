'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import GradientHeader from '@/components/layout/GradientHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectionChip from '@/components/ui/SelectionChip';
import ColorChip from '@/components/ui/ColorChip';
import PlatformCard from '@/components/ui/PlatformCard';
import Modal from '@/components/ui/Modal';
import { useBusinessStore } from '@/stores/businessStore';
import { userService } from '@/services/userService';
import {
  BUSINESS_TYPES,
  TARGET_BUYERS,
  BRAND_COLORS,
  PLATFORMS,
  NEEDS,
  PROMO_STYLES,
} from '@/lib/constants';

function labelToId(label: string, items: { id: string; label: string }[]): string {
  const match = items.find((i) => i.label === label);
  return match ? match.id : label ? 'custom' : '';
}

function labelsToIds(labels: string[], items: { id: string; label: string }[]): string[] {
  return labels.map((l) => {
    const match = items.find((i) => i.label === l);
    return match ? match.id : l;
  });
}

// ── component ────────────────────────────────────────────────────────────────
function BusinessDataContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromChat = searchParams.get('from') === 'chat';
  const { profile, setProfile } = useBusinessStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // ── form state ─────────────────────────────────────────────────────────────
  const [namaBisnis, setNamaBisnis] = useState(profile.nama_bisnis);

  // jenis bisnis — single select + custom
  const [jenisBisnisId, setJenisBisnisId] = useState(() => labelToId(profile.jenis_bisnis, BUSINESS_TYPES));
  const [jenisBisnisCustom, setJenisBisnisCustom] = useState(() =>
    BUSINESS_TYPES.find((b) => b.label === profile.jenis_bisnis) ? '' : profile.jenis_bisnis
  );

  // target pembeli — single select + custom
  const [targetId, setTargetId] = useState(() => labelToId(profile.target_pembeli, TARGET_BUYERS));
  const [targetCustom, setTargetCustom] = useState(() =>
    TARGET_BUYERS.find((b) => b.label === profile.target_pembeli) ? '' : profile.target_pembeli
  );

  // warna brand — single select + custom
  const [warnaId, setWarnaId] = useState(() => labelToId(profile.warna_utama_brand, BRAND_COLORS));
  const [warnaCustom, setWarnaCustom] = useState(() =>
    BRAND_COLORS.find((c) => c.label === profile.warna_utama_brand) ? '' : profile.warna_utama_brand
  );

  // platform — multi-select
  const [platformIds, setPlatformIds] = useState<string[]>(() =>
    labelsToIds(profile.platform_penjualan, PLATFORMS)
  );

  // kebutuhan — multi-select
  const [kebutuhanIds, setKebutuhanIds] = useState<string[]>(() =>
    labelsToIds(profile.kebutuhan, NEEDS)
  );

  // gaya promosi — single select
  const [gayaId, setGayaId] = useState(() => labelToId(profile.gaya_promosi, PROMO_STYLES));

  // ── derived values ─────────────────────────────────────────────────────────
  const jenisBisnisValue = jenisBisnisId === 'custom'
    ? jenisBisnisCustom.trim()
    : BUSINESS_TYPES.find((b) => b.id === jenisBisnisId)?.label || '';

  const targetValue = targetId === 'custom'
    ? targetCustom.trim()
    : TARGET_BUYERS.find((b) => b.id === targetId)?.label || '';

  const warnaValue = warnaId === 'custom'
    ? warnaCustom.trim()
    : BRAND_COLORS.find((c) => c.id === warnaId)?.label || '';

  const platformLabels = platformIds.map(
    (id) => PLATFORMS.find((p) => p.id === id)?.label || id
  );

  const kebutuhanLabels = kebutuhanIds.map(
    (id) => NEEDS.find((n) => n.id === id)?.label || id
  );

  const gayaValue = PROMO_STYLES.find((s) => s.id === gayaId)?.label || '';

  const requiredFilled = namaBisnis.trim() && jenisBisnisValue && targetValue;

  // ── change detection ───────────────────────────────────────────────────────
  const hasChanges = useMemo(() => {
    return (
      namaBisnis !== profile.nama_bisnis ||
      jenisBisnisValue !== profile.jenis_bisnis ||
      targetValue !== profile.target_pembeli ||
      warnaValue !== profile.warna_utama_brand ||
      gayaValue !== profile.gaya_promosi ||
      JSON.stringify(platformLabels) !== JSON.stringify(profile.platform_penjualan) ||
      JSON.stringify(kebutuhanLabels) !== JSON.stringify(profile.kebutuhan)
    );
  }, [namaBisnis, jenisBisnisValue, targetValue, warnaValue, gayaValue, platformLabels, kebutuhanLabels, profile]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedProfile = {
        nama_bisnis: namaBisnis.trim(),
        jenis_bisnis: jenisBisnisValue,
        target_pembeli: targetValue,
        warna_utama_brand: warnaValue,
        platform_penjualan: platformLabels,
        kebutuhan: kebutuhanLabels,
        gaya_promosi: gayaValue,
      };
      await userService.saveBusinessProfile(updatedProfile);
      setProfile(updatedProfile);
      setSaved(true);
      if (fromChat) {
        setTimeout(() => router.push('/chat'), 600);
      } else {
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save business profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      setShowUnsavedModal(true);
    } else {
      router.back();
    }
  };

  const toggleMulti = (
    id: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <MobileLayout noPadding>
      <GradientHeader title="Data Bisnis" showBack onBack={handleBack} />

      <div className="flex-1 px-6 pt-7 pb-8 overflow-y-auto hide-scrollbar bg-white rounded-t-3xl -mt-6 relative z-10">

        {/* ── Nama Bisnis ──────────────────────────── */}
        <section className="mb-7">
          <Input
            label="Nama Bisnis"
            value={namaBisnis}
            onChange={(e) => setNamaBisnis(e.target.value)}
          />
        </section>

        {/* ── Jenis Bisnis (single + custom) ───────── */}
        <section className="mb-7">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Jenis Bisnis</h3>
          <div className="flex flex-col gap-2.5">
            {BUSINESS_TYPES.map((item) => (
              <SelectionChip
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={jenisBisnisId === item.id}
                onClick={() => { setJenisBisnisId(item.id); setJenisBisnisCustom(''); }}
              />
            ))}
          </div>
          <div className="mt-3">
            <Input
              placeholder="Tulis bisnismu sendiri"
              value={jenisBisnisCustom}
              onChange={(e) => {
                setJenisBisnisCustom(e.target.value);
                setJenisBisnisId(e.target.value.trim() ? 'custom' : '');
              }}
              hint="Contoh: Pupuk kompos"
            />
          </div>
        </section>

        {/* ── Target Pembeli (single + custom) ─────── */}
        <section className="mb-7">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Target Pembeli</h3>
          <div className="flex flex-col gap-2.5">
            {TARGET_BUYERS.map((item) => (
              <SelectionChip
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={targetId === item.id}
                onClick={() => { setTargetId(item.id); setTargetCustom(''); }}
              />
            ))}
          </div>
          <div className="mt-3">
            <Input
              placeholder="Tulis target pembelimu sendiri"
              value={targetCustom}
              onChange={(e) => {
                setTargetCustom(e.target.value);
                setTargetId(e.target.value.trim() ? 'custom' : '');
              }}
              hint="Contoh: Seniman"
            />
          </div>
        </section>

        {/* ── Warna Brand (single + custom) ────────── */}
        <section className="mb-7">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Warna Brand</h3>
          <div className="grid grid-cols-3 gap-3">
            {BRAND_COLORS.map((item) => (
              <ColorChip
                key={item.id}
                color={item.hex}
                label={item.label}
                selected={warnaId === item.id}
                onClick={() => { setWarnaId(item.id); setWarnaCustom(''); }}
              />
            ))}
          </div>
          <div className="mt-3">
            <Input
              placeholder="Tulis warnamu sendiri"
              value={warnaCustom}
              onChange={(e) => {
                setWarnaCustom(e.target.value);
                setWarnaId(e.target.value.trim() ? 'custom' : '');
              }}
              hint="Contoh: pink dan hitam"
            />
          </div>
        </section>

        {/* ── Platform (multi-select) ──────────────── */}
        <section className="mb-7">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Tempat Jualan</h3>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((item) => (
              <PlatformCard
                key={item.id}
                icon={item.icon}
                label={item.label}
                selected={platformIds.includes(item.id)}
                onClick={() => toggleMulti(item.id, platformIds, setPlatformIds)}
                prominent={item.id === 'shopee' || item.id === 'gofood'}
              />
            ))}
          </div>
        </section>

        {/* ── Kebutuhan (multi-select) ─────────────── */}
        <section className="mb-7">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Kebutuhan</h3>
          <div className="flex flex-col gap-2.5">
            {NEEDS.map((item) => (
              <SelectionChip
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                selected={kebutuhanIds.includes(item.id)}
                onClick={() => toggleMulti(item.id, kebutuhanIds, setKebutuhanIds)}
              />
            ))}
          </div>
        </section>

        {/* ── Gaya Promosi (single select) ─────────── */}
        <section className="mb-7">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Gaya Promosi</h3>
          <div className="flex flex-col gap-2.5">
            {PROMO_STYLES.map((item) => (
              <SelectionChip
                key={item.id}
                emoji={item.emoji}
                label={item.label}
                example={'example' in item ? item.example : undefined}
                selected={gayaId === item.id}
                onClick={() => setGayaId(item.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Save button ─────────────────────────── */}
        <div className="mt-4 pb-2">
          <Button
            fullWidth
            size="lg"
            onClick={handleSave}
            loading={loading}
            disabled={!requiredFilled}
          >
            {saved ? '✅ Tersimpan!' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>

      {/* Unsaved changes modal */}
      <Modal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        title="Perubahan Belum Disimpan"
      >
        <p className="text-sm text-text-secondary mb-8">
          Kamu punya perubahan yang belum disimpan. Yakin ingin keluar?
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setShowUnsavedModal(false);
              router.back();
            }}
          >
            Keluar
          </Button>
          <Button fullWidth onClick={() => setShowUnsavedModal(false)}>
            Tetap di Sini
          </Button>
        </div>
      </Modal>
    </MobileLayout>
  );
}

// ── page export with Suspense boundary for useSearchParams ───────────────────
export default function BusinessDataPage() {
  return (
    <Suspense>
      <BusinessDataContent />
    </Suspense>
  );
}
