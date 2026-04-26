'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import GradientHeader from '@/components/layout/GradientHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useScheduleStore } from '@/stores/scheduleStore';

const DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function ScheduleViewPage() {
  const router = useRouter();
  const { items, selectedDate: storedDate, setSelectedDate: setStoredDate } = useScheduleStore();
  const today = new Date();

  const initialDate = useMemo(() => {
    if (storedDate) {
      const [y, m, d] = storedDate.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return today;
  }, []);

  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    if (storedDate) setStoredDate(null);
  }, []);

  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const dayItems = items.filter((item) => item.date === selectedDateStr);

  return (
    <MobileLayout noPadding>
      <GradientHeader title="Jadwal" showBack onBack={() => router.push('/dashboard')} />

      <div className="flex-1 pb-6">
        {/* Month label */}
        <div className="px-6 pt-4 pb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">
            {MONTHS[selectedDate.getMonth()]}
          </h3>
        </div>

        {/* Week scroller */}
        <div className="px-5 pb-4">
          <div className="flex justify-between">
            {weekDays.map((day) => {
              const isSelected =
                day.getDate() === selectedDate.getDate() &&
                day.getMonth() === selectedDate.getMonth();
              const isToday =
                day.getDate() === today.getDate() &&
                day.getMonth() === today.getMonth() &&
                day.getFullYear() === today.getFullYear();

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(new Date(day))}
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-2xl transition-all ${isSelected
                    ? 'bg-primary text-white'
                    : isToday
                      ? 'bg-primary/10'
                      : ''
                    }`}
                >
                  <span className={`text-[10px] font-semibold ${isSelected ? 'text-white/80' : 'text-text-secondary'
                    }`}>
                    {DAYS_SHORT[day.getDay()]}
                  </span>
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text-primary'
                    }`}>
                    {day.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule items */}
        <div className="px-6 space-y-4">
          {dayItems.length > 0 ? (
            dayItems.map((item) => (
              <Card key={item.id} className="p-5 bg-accent-chat/30">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-center">
                    <p className="text-lg font-bold text-state-error">{item.time} <span className="text-xs font-normal text-text-secondary">WIB</span></p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-primary text-sm mb-3">
                      {item.title}
                    </h4>
                    <div className="flex gap-3">
                      <div className="w-14 h-14 bg-accent-chat rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-4">
                          Caption: {item.caption}
                        </p>
                        {item.hashtags.length > 0 && (
                          <p className="text-xs text-state-error mt-1.5">
                            {item.hashtags.slice(0, 3).join(' ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-5 block">📅</span>
              <p className="text-text-secondary text-sm">
                Belum ada jadwal untuk hari ini
              </p>
              <p className="text-text-secondary/60 text-xs mt-1.5 mb-5">
                Buat konten dan jadwalkan uploadmu!
              </p>
              <Button
                size="sm"
                onClick={() => router.push('/chat')}
              >
                ✨ Buat Konten dengan AI
              </Button>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}