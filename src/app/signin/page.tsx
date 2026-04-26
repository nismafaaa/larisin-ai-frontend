'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

export default function SignInPage() {
  const router = useRouter();
  const { setAuth, isOnboarded } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};

    // Email validation
    if (!form.email.trim()) {
      e.email = 'Email wajib diisi';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      e.email = 'Format email tidak valid (contoh: nama@email.com)';
    }

    // Password validation
    if (!form.password) {
      e.password = 'Kata sandi wajib diisi';
    } else if (form.password.length < 8) {
      e.password = 'Minimal 8 karakter';
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.password)) {
      e.password = 'Kata sandi harus mengandung angka dan karakter spesial (!@#$%^&*)';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.login({
        email: form.email,
        password: form.password,
      });
      setAuth(
        res.user || { name: 'Pengguna', email: form.email },
        res.token
      );
      if (isOnboarded) {
        router.push('/dashboard');
      } else {
        router.push('/welcome');
      }
    } catch {
      setErrors({ email: 'Login gagal. Periksa email dan password kamu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout noPadding className="!bg-transparent">
      {/* Gradient Header - tall, matching mockup */}
      <div className="gradient-brand px-6 pt-16 pb-28 flex flex-col items-center relative">
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

      {/* Form area */}
      <div className="flex-1 bg-white rounded-t-[28px] -mt-6 relative z-10 px-7 pt-10 pb-10">
        <h1 className="text-2xl font-bold text-text-primary mb-10">
          Ayo Larisin Bisnismu!
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Email"
            type="email"
            placeholder="Masukkan email kamu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password kamu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />

          <div className="mt-10 flex flex-col gap-4">
            <Button type="submit" fullWidth size="lg" loading={loading} className="!rounded-full">
              Masuk
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
                Masuk dengan Google
              </span>
            </Button>
          </div>

          <p className="text-center text-sm text-text-secondary mt-6">
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-primary font-semibold hover:underline"
            >
              Daftar
            </button>
          </p>
        </form>
      </div>
    </MobileLayout>
  );
}