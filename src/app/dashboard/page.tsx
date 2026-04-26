'use client';

import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { useScheduleStore } from '@/stores/scheduleStore';
import { NEWS_ARTICLES } from '@/lib/constants';

function getNameFromEmail(email?: string): string {
  if (!email) return 'Pengguna';
  const local = email.split('@')[0];
  const first = local.split(/[._-]/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useBusinessStore((s) => s.profile);
  const items = useScheduleStore((s) => s.items);
  const nextSchedule = items.length > 0 ? items[items.length - 1] : null;

  const displayName = user?.name && user.name !== 'Pengguna'
    ? user.name
    : getNameFromEmail(user?.email);

  return (
    <MobileLayout noPadding className="!bg-transparent">
      <div className="flex-1 overflow-y-auto hide-scrollbar gradient-dashboard">
        {/* Top greeting bar — profile pic LEFT of text */}
        <div className="px-6 pt-12 pb-5 safe-top">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/profile')}
              className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 shadow-lg flex items-center justify-center overflow-hidden backdrop-blur-sm flex-shrink-0"
            >
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </button>
            <div>
              <h1 className="text-[22px] font-bold text-black leading-tight">
                Halo, {displayName}!
              </h1>
              <p className="text-sm text-black/60 mt-0.5">
                Selamat datang di LarisinAi <span className="text-yellow-300">✨</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 pb-10">
          {/* Create Photo Section */}
          <div className="mb-7">
            <h3 className="text-[17px] font-bold text-black mb-3">
              🎨 Kreasikan Foto Produkmu!
            </h3>
            <Card className="p-5 min-h-[120px] flex flex-col justify-between">
              <p className="text-[15px] text-text-secondary mb-4">
                Buat foto produk profesional dengan bantuan AI
              </p>
              <Button
                size="sm"
                onClick={() => router.push('/chat')}
                className="self-start"
              >
                Coba sekarang!
              </Button>
            </Card>
          </div>

          {/* Schedule Section */}
          <div className="mb-7">
            <h3 className="text-[17px] font-bold text-black mb-3">
              📅 Lihat Jadwal Promosimu!
            </h3>
            <Card className="p-5 min-h-[110px] flex flex-col justify-between">
              {nextSchedule ? (
                <div>
                  <p className="text-sm text-text-secondary mb-1">
                    Selasa · {nextSchedule.date}
                  </p>
                  <p className="text-2xl font-bold text-text-primary">{nextSchedule.time} <span className="text-sm font-normal text-text-secondary">WIB</span></p>
                  <p className="text-[15px] font-semibold text-text-primary mt-2">{nextSchedule.title}</p>
                </div>
              ) : (
                <div className="py-1">
                  <p className="text-lg font-bold text-text-primary mb-1">
                    Belum ada jadwal
                  </p>
                  <p className="text-[15px] text-text-secondary mb-3">
                    Jadwalkan posting kontenmu disini
                  </p>
                  <Button
                    size="sm"
                    onClick={() => router.push('/chat')}
                    className="self-start"
                  >
                    ✨ Buat Konten dengan AI
                  </Button>
                </div>
              )}
              <Button
                size="sm"
                onClick={() => router.push('/schedule/view')}
                className="self-start mt-4"
              >
                Lihat Jadwal
              </Button>
            </Card>
          </div>

          {/* News Section */}
          <div className="mb-4">
            <h3 className="text-[17px] font-bold text-black mb-3">
              📰 Informasi Terkini
            </h3>
            <div className="flex flex-col gap-3">
              {NEWS_ARTICLES.map((article) => (
                <Card key={article.id} className="p-4">
                  <div className="flex gap-3 items-start">
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: article.color + '20' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary mb-1">
                        {article.source} · {article.date}
                      </p>
                      <p className="text-[15px] font-semibold text-text-primary leading-snug">
                        {article.title}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}