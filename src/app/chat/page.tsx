'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import ChatBubble from '@/components/ui/ChatBubble';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { useChatStore } from '@/stores/chatStore';
import { aiService } from '@/services/aiService';
import { CONTENT_RATIOS, EDIT_FUNCTIONS } from '@/lib/constants';
import { ChevronLeft, Download } from 'lucide-react';
import type { ChatStep } from '@/types';

const RadioIcon = ({ checked }: { checked: boolean }) => {
  if (checked) {
    return (
      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full border-2 border-neutral-border flex-shrink-0" />
  );
};

export default function ChatPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useBusinessStore((s) => s.profile);
  const {
    currentStep, setStep,
    selectedRatio, setSelectedRatio,
    selectedFunction, setSelectedFunction,
    selectedImage, setSelectedImage, selectedImageUrl,
    resultImageUrl, setResultImageUrl,
    selectedCaption, setSelectedCaption,
    selectedHashtags, setSelectedHashtags,
    retryCountImage, incrementRetryImage,
    retryCountCaption, incrementRetryCaption,
    resetChat,
  } = useChatStore();

  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentStep, isProcessing, isCaptionLoading, captions, isTyping, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    resetChat();
  }, []);

  useEffect(() => {
    if (currentStep === 'ratio-intro') {
      const t = setTimeout(() => {
        advanceStep('ratio-select', 800);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [currentStep]);
  const advanceStep = (next: ChatStep, delay = 600) => {
    setIsTyping(true);
    scrollToBottom();
    setTimeout(() => {
      setStep(next);
      setIsTyping(false);
      scrollToBottom();
    }, delay);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(file, url);
    }
  };

  const startProgressBar = () => {
    setImageProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    const startTime = Date.now();
    const totalDuration = 40000;
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min(elapsed / totalDuration, 1);
      const eased = 1 - Math.pow(1 - raw, 2);
      const progress = Math.min(eased * 90, 90);
      setImageProgress(progress);
    }, 200);
  };

  const completeProgressBar = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setImageProgress(100);
  };

  const handleGenerateImage = async () => {
    setIsProcessing(true);
    advanceStep('processing', 0);
    startProgressBar();
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('file', selectedImage);
      }
      formData.append('ukuran_rasio', selectedRatio);
      formData.append('fungsi_edit', selectedFunction);
      formData.append('instruksi_tambahan', userInput);
      formData.append('business_jenis', profile.jenis_bisnis);
      formData.append('business_target', profile.target_pembeli);
      formData.append('business_warna', profile.warna_utama_brand);
      formData.append('business_gaya_promosi', profile.gaya_promosi);

      const result = await aiService.generateImage(formData);
      completeProgressBar();
      setResultImageUrl(result.result_image_url);
      await new Promise(r => setTimeout(r, 500));
      advanceStep('result-review', 600);
    } catch {
      completeProgressBar();
      advanceStep('upload', 600);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCaption = async () => {
    setIsProcessing(true);
    setIsCaptionLoading(true);
    setStep('caption-display');
    try {
      const result = await aiService.generateCaption({
        image_url: resultImageUrl,
        fokus_promosi: userInput || 'Promosi produk',
        business_jenis: profile.jenis_bisnis,
        business_target: profile.target_pembeli,
        business_gaya_promosi: profile.gaya_promosi,
        business_platform: profile.platform_penjualan,
      });
      setCaptions(result.captions);
      setSelectedHashtags(result.hashtags);
    } catch {
      setStep('result-review');
    } finally {
      setIsProcessing(false);
      setIsCaptionLoading(false);
    }
  };

  const pastStep = (step: ChatStep) => {
    const order: ChatStep[] = ['profile-review', 'ratio-intro', 'ratio-select', 'function-select', 'color-confirm', 'upload', 'processing', 'result-review', 'focus-select', 'caption-display', 'schedule-prompt', 'complete'];
    return order.indexOf(currentStep) > order.indexOf(step);
  };

  const atOrPast = (step: ChatStep) => currentStep === step || pastStep(step);

  return (
    <MobileLayout noPadding className="md:!max-w-[680px]">
      {/* Gradient header — extra bottom padding creates the overlap zone */}
      <div className="gradient-header px-5 pb-10 pt-6 safe-top flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white">LarisinAi</h1>
      </div>

      {/* Chat Messages — slides up over header with rounded-t-3xl for inverted corner */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-5 pb-6 space-y-5 bg-neutral-bg rounded-t-3xl -mt-5 relative z-10"
      >
        {/* Step 1: Profile Review */}
        <ChatBubble role="ai">
          <p className="font-semibold mb-1">Hai {user?.name || 'Mawar'}! 👋</p>
          <p className="mb-4">Aku sudah rangkum bisnismu ya, coba dicek dulu 😊</p>

          <div className="bg-neutral-card/50 rounded-xl p-3 mb-4 text-xs">
            <p className="font-medium mb-2 flex items-center gap-1.5">📊 Data Bisnis Kamu</p>
            <ul className="space-y-1.5 text-text-secondary">
              <li className="flex gap-2"><span className="w-4 text-center">🍔</span> <span>Jenis Bisnis: <span className="font-medium text-text-primary">{profile.jenis_bisnis || '-'}</span></span></li>
              <li className="flex gap-2"><span className="w-4 text-center">👩</span> <span>Target Pembeli: <span className="font-medium text-text-primary">{profile.target_pembeli || '-'}</span></span></li>
              <li className="flex gap-2"><span className="w-4 text-center">📍</span> <span>Tempat Jualan: <span className="font-medium text-text-primary">{profile.platform_penjualan.join(', ') || '-'}</span></span></li>
              <li className="flex gap-2"><span className="w-4 text-center">🎯</span> <span>Kebutuhan: <span className="font-medium text-text-primary">{profile.kebutuhan.join(', ') || '-'}</span></span></li>
              <li className="flex gap-2"><span className="w-4 text-center">💬</span> <span>Gaya Promosi: <span className="font-medium text-text-primary">{profile.gaya_promosi || '-'}</span></span></li>
              <li className="flex gap-2"><span className="w-4 text-center">🎨</span> <span>Warna Brand: <span className="font-medium text-text-primary">{profile.warna_utama_brand || '-'}</span></span></li>
            </ul>
          </div>

          <p className="font-medium mb-3">Sudah sesuai, atau mau diubah dulu?</p>

          {currentStep === 'profile-review' ? (
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="profile-check"
                  onChange={() => advanceStep('ratio-intro')}
                  className="hidden"
                />
                <RadioIcon checked={false} />
                <span className="text-sm">Sudah sesuai</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="profile-check"
                  onChange={() => router.push('/profile/business?from=chat')}
                  className="hidden"
                />
                <RadioIcon checked={false} />
                <span className="text-sm">Mau ubah dulu</span>
              </label>
            </div>
          ) : (
            <div className="space-y-3 opacity-60 pointer-events-none">
              <div className="flex items-center gap-3">
                <RadioIcon checked={true} />
                <span className="text-sm">Sudah sesuai</span>
              </div>
              <div className="flex items-center gap-3">
                <RadioIcon checked={false} />
                <span className="text-sm">Mau ubah dulu</span>
              </div>
            </div>
          )}
        </ChatBubble>

        {/* Step 2a: Ratio Intro bubble */}
        {atOrPast('ratio-intro') && (
          <ChatBubble role="ai">
            <p className="font-medium">Oke, kita lanjut bikin konten promosi kamu ya! 🚀</p>
          </ChatBubble>
        )}

        {/* Step 2b: Ratio Selection */}
        {atOrPast('ratio-select') && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-1">Konten ini mau dipakai di mana?</p>
            <p className="text-text-secondary text-xs mb-3">Pilih sesuai kebutuhan kamu ya 👇</p>
            <div className="space-y-3">
              {CONTENT_RATIOS.map((r) => (
                <label key={r.id} className={`flex items-center gap-3 ${pastStep('ratio-select') ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name="ratio"
                    value={r.id}
                    checked={selectedRatio === r.id}
                    onChange={() => {
                      setSelectedRatio(r.id);
                      advanceStep('function-select');
                    }}
                    className="hidden"
                  />
                  <RadioIcon checked={selectedRatio === r.id} />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>
          </ChatBubble>
        )}

        {/* Step 3: Function Selection */}
        {atOrPast('function-select') && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-3">Mau bikin konten seperti apa? 👇</p>
            <div className="space-y-3">
              {EDIT_FUNCTIONS.map((f) => (
                <label key={f.id} className={`flex items-center gap-3 ${pastStep('function-select') ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name="function"
                    value={f.id}
                    checked={selectedFunction === f.id}
                    onChange={() => {
                      setSelectedFunction(f.id);
                      advanceStep('upload');
                    }}
                    className="hidden"
                  />
                  <RadioIcon checked={selectedFunction === f.id} />
                  <span className="text-sm">{f.label}</span>
                </label>
              ))}
            </div>
          </ChatBubble>
        )}

        {/* Step 4: Upload */}
        {atOrPast('upload') && (
          <>
            <ChatBubble role="ai">
              <p className="font-semibold mb-3">
                Upload foto produk kamu ya! 📷
              </p>
              {currentStep === 'upload' && !selectedImageUrl && (
                <Button fullWidth onClick={() => fileInputRef.current?.click()}>
                  Upload Foto
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </ChatBubble>

            {selectedImageUrl && (
              <ChatBubble role="user" className="!p-1.5 !pr-1.5">
                <div className="bg-white rounded-xl overflow-hidden mb-0 border border-neutral-border/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedImageUrl} alt="Uploaded product" className="w-full h-48 object-cover" />
                </div>
                {currentStep === 'upload' ? (
                  <div className="p-3 pb-1">
                    <p className="text-[13px] text-text-secondary mb-2 leading-relaxed">
                      Ada yang mau ditambahkan? (boleh dikosongkan)<br />
                      Contoh:<br />
                      - background putih / estetik<br />
                      - tulisan promo potongan harga<br />
                      - tambahkan gambar bunga
                    </p>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-card rounded-lg p-2.5 text-xs text-text-primary border border-transparent focus:border-primary/30 resize-none"
                    />
                    <Button
                      fullWidth
                      size="sm"
                      className="mt-3"
                      onClick={handleGenerateImage}
                    >
                      Kirim
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-accent-chat rounded-b-xl border-t border-primary/10">
                    <p className="text-sm font-medium">{userInput || 'Lanjutkan tanpa tambahan'}</p>
                    <Button fullWidth size="sm" className="mt-3 pointer-events-none opacity-90">Kirim</Button>
                  </div>
                )}
              </ChatBubble>
            )}
          </>
        )}

        {/* Step 5: Processing */}
        {currentStep === 'processing' && (
          <ChatBubble role="ai">
            <p className="text-sm font-medium mb-3">
              Lagi dibuat sesuai keinginan kamu ya... silakan tunggu sebentar 🎨
            </p>

            {/* Processing steps with staggered fade-in */}
            <div className="space-y-2.5 text-sm font-semibold mb-4">
              {[
                { label: 'Mempercantik foto produk ✨', delay: '0.4s' },
                { label: 'Menyesuaikan warna 🎨', delay: '8s' },
                { label: 'Menyiapkan desain promosi 🔥', delay: '18s' },
              ].map(({ label, delay }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 animate-fade-in"
                  style={{ animationDelay: delay, animationFillMode: 'both' }}
                >
                  <span className="text-xs">•</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* JS-driven progress bar synced with actual request */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-neutral-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent-light progress-bar-animated"
                  style={{ width: `${imageProgress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-text-secondary tabular-nums w-8 text-right">
                {Math.round(imageProgress)}%
              </span>
            </div>
          </ChatBubble>
        )}

        {/* Step 6: Result Review */}
        {atOrPast('result-review') && resultImageUrl && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-3">Ini hasilnya 👇</p>
            <div className="rounded-xl overflow-hidden mb-3 bg-neutral-card/50 border border-neutral-border/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultImageUrl} alt="Hasil gambar AI" className="w-full max-h-64 object-contain" />
            </div>

            {/* Download button */}
            <a
              href={resultImageUrl}
              download="larisin-ai-result.png"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 mb-4 rounded-xl bg-gradient-to-r from-primary to-accent-light text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download Gambar
            </a>

            <p className="font-semibold mb-3">Sudah sesuai, atau mau diperbaiki?</p>
            {currentStep === 'result-review' ? (
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="result-check"
                    onChange={() => handleGenerateCaption()}
                    className="hidden"
                  />
                  <RadioIcon checked={false} />
                  <span className="text-sm">Sudah cukup</span>
                </label>
                {retryCountImage < 1 && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="result-check"
                      onChange={() => { incrementRetryImage(); setStep('upload'); }}
                      className="hidden"
                    />
                    <RadioIcon checked={false} />
                    <span className="text-sm">Mau perbaiki (1 kali kesempatan)</span>
                  </label>
                )}
              </div>
            ) : (
              <div className="space-y-3 opacity-60 pointer-events-none">
                <div className="flex items-center gap-3">
                  <RadioIcon checked={true} />
                  <span className="text-sm">Sudah cukup</span>
                </div>
                {retryCountImage < 1 && (
                  <div className="flex items-center gap-3">
                    <RadioIcon checked={false} />
                    <span className="text-sm">Mau perbaiki (1 kali kesempatan)</span>
                  </div>
                )}
              </div>
            )}
          </ChatBubble>
        )}

        {/* Step 8: Caption Display */}
        {atOrPast('caption-display') && (
          <ChatBubble role="ai">
            {isCaptionLoading && captions.length === 0 ? (
              <div>
                <p className="text-sm font-medium mb-3">
                  ✍️ AI lagi menulis caption terbaik buat kamu...
                </p>

                <div className="space-y-2 text-sm font-semibold mb-4">
                  {[
                    { label: 'Menganalisis gambar 🖼️', delay: '0.3s' },
                    { label: 'Menulis caption menarik ✨', delay: '1.5s' },
                  ].map(({ label, delay }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 animate-fade-in"
                      style={{ animationDelay: delay, animationFillMode: 'both' }}
                    >
                      <span className="text-xs">•</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Caption progress bar (~5s) */}
                <div className="h-1.5 rounded-full bg-neutral-border overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-light progress-bar-caption" />
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl overflow-hidden mb-4 border border-neutral-border/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultImageUrl} alt="Hasil gambar AI" className="w-full max-h-48 object-cover" />
                </div>
                <p className="font-semibold mb-1">Ini beberapa pilihan caption 👇</p>
                <p className="text-sm mb-4 font-medium text-text-secondary">Pilih salah satu ya! 😊</p>

                <div className="space-y-3 mb-4">
                  {captions.map((caption, idx) => {
                    const isSelected = selectedCaption === caption;
                    return (
                      <label key={idx} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${isSelected ? 'border-primary bg-accent-chat/20' : 'border-transparent bg-neutral-card/50 hover:bg-neutral-card'} ${pastStep('caption-display') ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}`}>
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="caption-select"
                            checked={isSelected}
                            onChange={() => { if (currentStep === 'caption-display') setSelectedCaption(caption); }}
                            className="hidden"
                          />
                          <RadioIcon checked={isSelected} />
                        </div>
                        <div className="flex-1 text-sm text-text-primary leading-relaxed">
                          <span className="font-semibold block mb-1 text-text-secondary text-xs uppercase tracking-wider">CAPTION {idx + 1}</span>
                          <span className="text-[13px]">{caption}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {currentStep === 'caption-display' && (
                  <>
                    <Button
                      fullWidth
                      className={`mb-4 transition-colors ${!selectedCaption ? '!bg-gray-500 hover:!bg-gray-500 opacity-90' : ''}`}
                      onClick={() => {
                        if (selectedCaption) advanceStep('schedule-prompt');
                      }}
                    >
                      Lanjut
                    </Button>

                    {retryCountCaption < 1 && (
                      <div className="pt-3 border-t border-neutral-border/50">
                        <p className="font-semibold mb-3">Mau coba caption lain?</p>
                        <Button
                          fullWidth
                          className="mb-4 !bg-text-secondary hover:!bg-text-primary"
                          onClick={() => { incrementRetryCaption(); setCaptions([]); setSelectedCaption(''); handleGenerateCaption(); }}
                        >
                          Buat ulang
                        </Button>
                        <div className="text-xs text-text-secondary leading-snug">
                          <span className="font-bold text-text-primary">Catatan:</span><br />
                          Kamu hanya bisa buat ulang caption sekali lagi ya 😉
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </ChatBubble>
        )}

        {/* Step 9: Schedule Prompt */}
        {atOrPast('schedule-prompt') && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-4 text-[15px]">Yuk tentukan jadwal uploadnya ⏰</p>
            <Button fullWidth onClick={() => router.push('/schedule')}>
              Buat Jadwal
            </Button>
          </ChatBubble>
        )}

        {isTyping && (
          <ChatBubble role="ai">
            <div className="flex items-center gap-1 h-5 px-1">
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </ChatBubble>
        )}
      </div>
    </MobileLayout>
  );
}