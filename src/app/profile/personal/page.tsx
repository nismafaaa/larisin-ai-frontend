'use client';

import { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import GradientHeader from '@/components/layout/GradientHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/userService';
import { User } from 'lucide-react';

export default function PersonalDataPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nama: user?.name || '',
    tanggal_lahir: user?.tanggal_lahir || '',
    nomor_hp: user?.nomor_hp || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.editProfile({
        name: form.nama,
        email: form.email,
        tanggal_lahir: form.tanggal_lahir,
        nomor_hp: form.nomor_hp,
      });
      setUser({
        name: form.nama,
        email: form.email,
        tanggal_lahir: form.tanggal_lahir,
        nomor_hp: form.nomor_hp,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout noPadding>
      <GradientHeader title="Data Diri" showBack />

      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        {/* Avatar */}
        <div className="flex flex-col items-center pt-8 pb-8">
          <div className="relative w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <User className="w-14 h-14 text-primary/60" />
            <button className="absolute bottom-1 right-1 bg-white rounded-full px-2.5 py-1 text-[10px] font-medium text-primary shadow-md border border-neutral-border">
              Ganti Foto
            </button>
          </div>
          <h3 className="font-bold text-lg text-text-primary">{form.nama || 'Nama'}</h3>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-border/50 mb-6" />

        <h3 className="font-bold text-text-primary text-lg mb-5">Data Diri</h3>

        <div className="flex flex-col gap-5">
          <Input
            label="Nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
          <Input
            label="Tanggal Lahir"
            type="date"
            value={form.tanggal_lahir}
            onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
          />
          <Input
            label="Nomor Handphone"
            type="tel"
            value={form.nomor_hp}
            onChange={(e) => setForm({ ...form, nomor_hp: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mt-10">
          <Button fullWidth size="lg" onClick={handleSave} loading={loading}>
            {saved ? '✅ Tersimpan!' : 'Simpan'}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}