'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

export default function SignUpPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: '',
    umur: '',
    namaBisnis: '',
    lokasi: '',
    nomorHp: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nama.trim()) e.nama = 'Nama wajib diisi';
    if (!form.email.trim()) e.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.password) e.password = 'Kata sandi wajib diisi';
    else if (form.password.length < 6) e.password = 'Minimal 6 karakter';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.signup({
        name: form.nama,
        email: form.email,
        password: form.password,
      });
      setAuth(
        { name: form.nama, email: form.email, nomor_hp: form.nomorHp, lokasi: form.lokasi },
        res.token
      );
      router.push('/welcome');
    } catch {
      setErrors({ email: 'Registrasi gagal. Coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout noPadding className="!bg-transparent">
      {/* Gradient Header - tall, matching mockup */}
      <div className="gradient-brand px-6 pt-14 pb-24 flex flex-col items-center relative">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
          <Image
            src="/logo/logo-only.png"
            alt="Larisin AI"
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
      </div>

      {/* Form area - overlapping white card with rounded top */}
      <div className="flex-1 bg-white rounded-t-[28px] -mt-6 relative z-10 px-7 pt-10 pb-10 overflow-y-auto hide-scrollbar">
        <h1 className="text-2xl font-bold text-text-primary mb-8">
          Ayo Daftarkan Bisnismu!
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nama Lengkap"
            placeholder="contoh: Sri Ayu"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            error={errors.nama}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Umur</label>
            <div className="relative">
              <input
                type="date"
                value={form.umur}
                onChange={(e) => setForm({ ...form, umur: e.target.value })}
                className="w-full px-4 py-3.5 rounded-full border border-neutral-border bg-white text-text-primary text-sm appearance-none"
                placeholder="01/01/2026"
              />
            </div>
          </div>
          <Input
            label="Nama Bisnis"
            placeholder="contoh: Lalapan Sri"
            value={form.namaBisnis}
            onChange={(e) => setForm({ ...form, namaBisnis: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Lokasi Bisnis</label>
            <select
              value={form.lokasi}
              onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
              className="w-full px-4 py-3.5 rounded-full border border-neutral-border bg-white text-text-primary text-sm appearance-none cursor-pointer"
            >
              <option value="">Kota Malang</option>
              {['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Medan', 'Makassar', 'Malang', 'Denpasar', 'Palembang', 'Solo', 'Bekasi', 'Tangerang', 'Depok', 'Bogor'].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <Input
            label="Nomor Handphone"
            type="tel"
            placeholder="contoh: 081234567890"
            value={form.nomorHp}
            onChange={(e) => setForm({ ...form, nomorHp: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="contoh: sriayu@gmail.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="Kata Sandi"
            type="password"
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />

          <div className="mt-2 flex flex-col gap-4">
            <Button type="submit" fullWidth size="lg" loading={loading} className="!rounded-full">
              Daftar
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-border" />
              <span className="text-xs text-text-secondary">atau</span>
              <div className="flex-1 h-px bg-neutral-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              className="!rounded-full"
              onClick={() => {/* Google Auth placeholder */ }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Daftar dengan Google
              </span>
            </Button>
          </div>

          <p className="text-center text-sm text-text-secondary mt-3 pb-6">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="text-primary font-semibold hover:underline"
            >
              Masuk
            </button>
          </p>
        </form>
      </div>
    </MobileLayout>
  );
}