'use client';

import { useState, useRef } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import GradientHeader from '@/components/layout/GradientHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LocationPicker from '@/components/ui/LocationPicker';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/userService';
import { User, Camera } from 'lucide-react';

export default function PersonalDataPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nama: user?.name || '',
    tanggal_lahir: user?.tanggal_lahir || '',
    nomor_hp: user?.nomor_hp || '',
    email: user?.email || '',
    lokasi: user?.lokasi || '',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.editProfile({
        name: form.nama,
        email: form.email,
        tanggal_lahir: form.tanggal_lahir,
        nomor_hp: form.nomor_hp,
        lokasi: form.lokasi,
      });
      setUser({
        name: form.nama,
        email: form.email,
        tanggal_lahir: form.tanggal_lahir,
        nomor_hp: form.nomor_hp,
        lokasi: form.lokasi,
        avatar: avatarPreview || undefined,
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
          <div className="relative mb-3">
            <div className="w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-14 h-14 text-primary/60" />
              )}
            </div>
            {/* Camera badge — outside the image overflow */}
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center border-3 border-white shadow-md hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <h3 className="font-bold text-lg text-text-primary">{form.nama || 'Nama'}</h3>
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="text-xs text-primary font-medium mt-1.5 hover:underline"
          >
            Ganti Foto
          </button>
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary">Lokasi</label>
            <LocationPicker
              value={form.lokasi}
              onChange={(loc) => setForm({ ...form, lokasi: loc })}
            />
          </div>
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