'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
          {/* Video Tutorial Section */}
          <div className="mb-7">
            <h3 className="text-[17px] font-bold text-black mb-3">
              📹 Belajar LarisinAi
            </h3>
            <Card className="p-0 overflow-hidden relative group cursor-pointer shadow-card">
              <div className="h-[140px] w-full bg-gradient-to-br from-primary-main to-accent-light relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                  <h4 className="text-white font-bold text-[15px] drop-shadow-md leading-tight">Cara Pakai LarisinAi</h4>
                  <p className="text-white/90 text-[13px] drop-shadow-md mt-0.5">Tonton video tutorial 1 menit ini</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Create Photo Section */}
          <div className="mb-7">
            <h3 className="text-[17px] font-bold text-black mb-3">
              🎨 Kreasikan Foto Produkmu!
            </h3>
            <Card className="p-0 overflow-hidden min-h-[140px]">
              <div className="flex justify-between items-stretch h-full">
                <div className="p-4 sm:p-5 flex flex-col justify-center flex-1 pr-2">
                  <p className="text-[14px] sm:text-[15px] text-text-secondary mb-4 leading-snug">
                    Buat foto produk profesional dengan bantuan AI
                  </p>
                  <Button
                    size="sm"
                    onClick={() => router.push('/chat')}
                    className="self-start text-[13px] sm:text-sm"
                  >
                    Coba sekarang!
                  </Button>
                </div>
                <div className="w-[45%] relative flex-shrink-0 bg-transparent flex items-center justify-center p-3">
                  <Image src="/dashboard-component/card-image-gen.png" alt="AI Image Generation" width={160} height={160} className="object-contain w-full h-full" />
                </div>
              </div>
            </Card>
          </div>

          {/* Schedule Section */}
          <div className="mb-7">
            <h3 className="text-[17px] font-bold text-black mb-3">
              📅 Lihat Jadwal Promosimu!
            </h3>
            <Card className="p-0 overflow-hidden min-h-[140px]">
              <div className="flex justify-between items-stretch h-full">
                <div className="p-4 sm:p-5 flex flex-col justify-center flex-1 pr-2">
                  {nextSchedule ? (
                    <div className="flex flex-col justify-center h-full">
                      <p className="text-[13px] sm:text-sm text-text-secondary mb-1">
                        Selasa · {nextSchedule.date}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-text-primary leading-tight">{nextSchedule.time} <span className="text-[12px] sm:text-sm font-normal text-text-secondary">WIB</span></p>
                      <p className="text-[14px] sm:text-[15px] font-semibold text-text-primary mt-1 line-clamp-2">{nextSchedule.title}</p>
                      <Button
                        size="sm"
                        onClick={() => router.push('/schedule/view')}
                        className="self-start mt-3 text-[13px] sm:text-sm"
                      >
                        Lihat Jadwal
                      </Button>
                    </div>
                  ) : (
                    <div className="py-1 flex flex-col justify-center h-full">
                      <p className="text-[15px] sm:text-lg font-bold text-text-primary mb-1">
                        Belum ada jadwal
                      </p>
                      <p className="text-[13px] sm:text-[15px] text-text-secondary mb-3 leading-snug">
                        Jadwalkan posting kontenmu disini
                      </p>
                      <Button
                        size="sm"
                        onClick={() => router.push('/chat')}
                        className="self-start text-[13px] sm:text-sm"
                      >
                        ✨ Buat Konten
                      </Button>
                    </div>
                  )}
                </div>
                <div className="w-[45%] relative flex-shrink-0 bg-transparent flex items-center justify-center p-3">
                  <Image src="/dashboard-component/card-calendar.png" alt="Calendar" width={160} height={160} className="object-contain w-full h-full" />
                </div>
              </div>
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