'use client';

import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import GradientHeader from '@/components/layout/GradientHeader';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { User, Briefcase, LogOut, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const profile = useBusinessStore((s) => s.profile);

  const handleLogout = () => {
    logout();
    router.replace('/signin');
  };

  const menuItems = [
    {
      icon: User,
      label: 'Data Diri',
      subtitle: 'Edit data dirimu',
      href: '/profile/personal',
    },
    {
      icon: Briefcase,
      label: 'Data Bisnis',
      subtitle: 'Edit Data Bisnismu',
      href: '/profile/business',
    },
  ];

  return (
    <MobileLayout noPadding className="!bg-white">
      {/* Gradient Header with back button */}
      <GradientHeader title="Profil" showBack />

      <div className="flex-1 pb-8 bg-white rounded-t-3xl -mt-6 relative z-10">
        <div className="flex flex-col items-center pt-10 pb-8">
          <div className="w-28 h-28 rounded-full bg-accent-chat flex items-center justify-center mb-5 shadow-lg border-4 border-white overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-14 h-14 text-primary/50" />
            )}
          </div>
          <h2 className="text-xl font-bold text-text-primary">
            {user?.name || 'Pengguna'}
          </h2>
          {profile.nama_bisnis && (
            <p className="text-sm text-text-secondary mt-1.5">
              {profile.nama_bisnis}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-neutral-border/60 mb-5" />

        {/* Menu Items */}
        <div className="px-6">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.href}>
                <button
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center gap-5 py-5 px-2 hover:bg-neutral-card rounded-2xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-accent-chat/60 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-secondary mt-1">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-secondary/40" />
                </button>
                {idx < menuItems.length - 1 && (
                  <div className="mx-2 h-px bg-neutral-border/40 my-2" />
                )}
              </div>
            );
          })}

          {/* Divider before logout */}
          <div className="h-px bg-neutral-border/40 my-4" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-5 py-5 px-2 hover:bg-state-error/5 rounded-2xl transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-state-error/10 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-state-error" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-state-error">Keluar</p>
              <p className="text-xs text-text-secondary mt-1">Keluar dari akunmu</p>
            </div>
            <ChevronRight className="w-5 h-5 text-text-secondary/40" />
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}