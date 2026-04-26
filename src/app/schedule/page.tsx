'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import GradientHeader from '@/components/layout/GradientHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useScheduleStore } from '@/stores/scheduleStore';
import { useChatStore } from '@/stores/chatStore';
import { RECOMMENDED_TIMES } from '@/lib/constants';

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function SchedulePage() {
  const router = useRouter();
  const { addItem, setSelectedDate: setStoredDate } = useScheduleStore();
  const { selectedCaption, selectedHashtags, resultImageUrl } = useChatStore();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  const allRecommendedDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const possibleOffsets = Array.from({ length: 30 }, (_, i) => i + 1);

    for (let i = 0; i < 4; i++) {
      const randIdx = Math.floor(Math.random() * possibleOffsets.length);
      const offset = possibleOffsets.splice(randIdx, 1)[0];
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      dates.push(d);
    }
    return dates;
  }, []);

  const recommendedDates = useMemo(() => {
    return allRecommendedDates
      .filter(d => d.getMonth() === currentMonth && d.getFullYear() === currentYear)
      .map(d => d.getDate());
  }, [allRecommendedDates, currentMonth, currentYear]);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const isTomorrow = (day: number) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return day === tomorrow.getDate() && currentMonth === tomorrow.getMonth() && currentYear === tomorrow.getFullYear();
  };

  const isAllowedDate = (day: number) => isToday(day) || isTomorrow(day) || recommendedDates.includes(day);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const handleDateSelect = (day: number) => {
    if (isAllowedDate(day)) {
      setSelectedDate(day);
    }
  };

  const handleSaveDate = () => {
    if (selectedDate) {
      setShowTimePicker(true);
    }
  };

  const handleSaveSchedule = () => {
    if (selectedDate && selectedTime) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      addItem({
        id: `schedule_${Date.now()}`,
        title: 'Upload Foto Produk di Instagram',
        caption: selectedCaption || 'Caption promosi akan ditampilkan di sini.',
        hashtags: selectedHashtags || [],
        image_url: resultImageUrl || '',
        date: dateStr,
        time: selectedTime,
        platform: 'Instagram',
        created_at: new Date().toISOString(),
      });
      setStoredDate(dateStr);
      setShowTimePicker(false);
      router.push('/schedule/view');
    }
  };

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <MobileLayout noPadding>
      <GradientHeader title="Jadwal" showBack />

      <div className="flex-1 px-6 pt-6 pb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Pilih tanggal upload!
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Kamu hanya bisa memilih hari ini atau besok
        </p>

        {/* Month label (no navigation — only today/tomorrow) */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-text-primary">
            {MONTHS[currentMonth]} {currentYear}
          </h3>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 mb-6">
          {DAYS.map((day) => (
            <div key={day} className="text-center py-2">
              <span className={`text-xs font-semibold ${day === 'Min' ? 'text-state-error' : 'text-text-secondary'}`}>
                {day}
              </span>
            </div>
          ))}
          {calendarDays.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;
            const isRec = recommendedDates.includes(day);
            const isSel = selectedDate === day;
            const isTod = isToday(day);

            return (
              <button
                key={day}
                onClick={() => handleDateSelect(day)}
                disabled={!isAllowedDate(day)}
                className={`flex flex-col items-center py-2 rounded-xl transition-all ${isSel
                  ? 'bg-accent-light text-white'
                  : isTod
                    ? 'bg-primary/10'
                    : !isAllowedDate(day)
                      ? 'opacity-30 cursor-not-allowed'
                      : ''
                  }`}
              >
                {isTod && (
                  <span className="text-[8px] text-state-error font-medium leading-none mb-0.5">
                    Hari Ini
                  </span>
                )}
                {isTomorrow(day) && !isSel && (
                  <span className="text-[8px] text-primary font-medium leading-none mb-0.5">
                    Besok
                  </span>
                )}
                {isRec && !isSel && !isTod && !isTomorrow(day) && (
                  <span className="text-[8px] text-state-success font-medium leading-none mb-0.5">
                    Rekomendasi
                  </span>
                )}
                <span className={`text-sm font-medium ${isSel ? 'text-white font-bold' : 'text-text-primary'
                  }`}>
                  {day}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          fullWidth
          size="lg"
          onClick={handleSaveDate}
          disabled={!selectedDate}
          className={!selectedDate ? 'bg-text-secondary' : ''}
        >
          Simpan
        </Button>
      </div>

      {/* Time Picker Modal */}
      <Modal
        isOpen={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        title=""
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Pilih jam upload!
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            Kami sudah pilihkan waktu terbaik untuk kamu
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {RECOMMENDED_TIMES.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 rounded-full font-semibold text-sm transition-all ${selectedTime === time
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-neutral-border text-text-primary hover:bg-neutral-border/80'
                  }`}
              >
                {time} WIB
              </button>
            ))}
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleSaveSchedule}
            disabled={!selectedTime}
          >
            Simpan
          </Button>
        </div>
      </Modal>
    </MobileLayout>
  );
}