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
import { CONTENT_RATIOS, EDIT_FUNCTIONS, CAPTION_FOCUS } from '@/lib/constants';
import { Upload, Send, ChevronLeft } from 'lucide-react';
import type { ChatStep } from '@/types';

export default function ChatPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useBusinessStore((s) => s.profile);
  const {
    currentStep, setStep,
    selectedRatio, setSelectedRatio,
    selectedFunction, setSelectedFunction,
    setSelectedImage, selectedImageUrl,
    resultImageUrl, setResultImageUrl,
    selectedCaption, setSelectedCaption,
    setSelectedHashtags,
    retryCountImage, incrementRetryImage,
    retryCountCaption, incrementRetryCaption,
    resetChat,
  } = useChatStore();

  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [focusSelection, setFocusSelection] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentStep, isProcessing, captions, scrollToBottom]);

  useEffect(() => {
    resetChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(file, url);
    }
  };

  const handleGenerateImage = async () => {
    setIsProcessing(true);
    setStep('processing');
    try {
      const formData = new FormData();
      formData.append('ukuran_rasio', selectedRatio);
      formData.append('fungsi_edit', selectedFunction);
      formData.append('instruksi_tambahan', userInput);
      formData.append('business_jenis', profile.jenis_bisnis);
      formData.append('business_target', profile.target_pembeli);
      formData.append('business_warna', profile.warna_utama_brand);
      formData.append('business_gaya_promosi', profile.gaya_promosi);

      const result = await aiService.generateImage(formData);
      setResultImageUrl(result.result_image_url);
      setStep('result-review');
    } catch {
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCaption = async () => {
    setIsProcessing(true);
    try {
      const result = await aiService.generateCaption({
        image_url: resultImageUrl,
        fokus_promosi: focusSelection,
        business_jenis: profile.jenis_bisnis,
        business_target: profile.target_pembeli,
        business_gaya_promosi: profile.gaya_promosi,
        business_platform: profile.platform_penjualan,
      });
      setCaptions(result.captions);
      setHashtags(result.hashtags);
      setStep('caption-display');
    } catch {
      setStep('focus-select');
    } finally {
      setIsProcessing(false);
    }
  };

  const advanceStep = (next: ChatStep) => {
    setStep(next);
    scrollToBottom();
  };

  const pastStep = (step: ChatStep) => {
    const order: ChatStep[] = ['profile-review', 'ratio-select', 'function-select', 'color-confirm', 'upload', 'processing', 'result-review', 'focus-select', 'caption-display', 'schedule-prompt', 'complete'];
    return order.indexOf(currentStep) > order.indexOf(step);
  };

  const atOrPast = (step: ChatStep) => currentStep === step || pastStep(step);

  return (
    <MobileLayout noPadding className="!bg-white">
      {/* Header */}
      <div className="gradient-header px-5 pb-4 pt-6 safe-top flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white">LarisinAi</h1>
      </div>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto hide-scrollbar px-5 py-5 space-y-4 bg-white"
      >
        {/* Step 1: Profile Review */}
        <ChatBubble role="ai">
          <p className="font-semibold mb-3">Hai {user?.name || 'Kawan'}! 👋</p>
          <p className="mb-3 font-medium">📊 Data Bisnis Kamu</p>
          <ul className="text-xs space-y-2.5 mb-4 pl-1">
            <li>🍽️ Jenis Bisnis: <span className="font-medium">{profile.jenis_bisnis || '-'}</span></li>
            <li>👥 Target Pembeli: <span className="font-medium">{profile.target_pembeli || '-'}</span></li>
            <li>📍 Tempat Jualan: <span className="font-medium">{profile.platform_penjualan.join(', ') || '-'}</span></li>
            <li>🎯 Kebutuhan: <span className="font-medium">{profile.kebutuhan.join(', ') || '-'}</span></li>
            <li>💬 Gaya Promosi: <span className="font-medium">{profile.gaya_promosi || '-'}</span></li>
            <li>🎨 Warna Brand: <span className="font-medium">{profile.warna_utama_brand || '-'}</span></li>
          </ul>
          <p className="font-medium mb-3 mt-2">Ada yang ingin diubah?</p>
          {currentStep === 'profile-review' && (
            <div className="flex gap-3 mt-3">
              <Button size="sm" variant="secondary" onClick={() => router.push('/profile/business?from=chat')}>
                Ya
              </Button>
              <Button size="sm" onClick={() => advanceStep('ratio-select')}>
                Tidak
              </Button>
            </div>
          )}
        </ChatBubble>

        {/* Step 2: Ratio Selection */}
        {atOrPast('ratio-select') && (
          <>
            <ChatBubble role="user">
              <p>Oke, kita lanjut bikin konten promosi kamu ya! 🚀</p>
            </ChatBubble>

            <ChatBubble role="ai">
              <p className="font-semibold mb-3">Konten ini mau dipakai di mana?</p>
              <div className="space-y-3">
                {CONTENT_RATIOS.map((r) => (
                  <label key={r.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="ratio"
                      value={r.id}
                      checked={selectedRatio === r.id}
                      onChange={() => setSelectedRatio(r.id)}
                      className="w-4 h-4 accent-primary"
                      disabled={pastStep('ratio-select')}
                    />
                    <span className="text-sm">{r.label}</span>
                  </label>
                ))}
              </div>
              {currentStep === 'ratio-select' && selectedRatio && (
                <Button size="sm" className="mt-5" onClick={() => advanceStep('function-select')}>
                  Lanjut
                </Button>
              )}
            </ChatBubble>
          </>
        )}

        {/* Step 3: Function Selection */}
        {atOrPast('function-select') && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-3 text-state-error">Mau bikin seperti apa?</p>
            <div className="space-y-3">
              {EDIT_FUNCTIONS.map((f) => (
                <label key={f.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="function"
                    value={f.id}
                    checked={selectedFunction === f.id}
                    onChange={() => setSelectedFunction(f.id)}
                    className="w-4 h-4 accent-primary"
                    disabled={pastStep('function-select')}
                  />
                  <span className="text-sm">{f.label}</span>
                </label>
              ))}
            </div>
            {currentStep === 'function-select' && selectedFunction && (
              <Button size="sm" className="mt-5" onClick={() => advanceStep('upload')}>
                Lanjut
              </Button>
            )}
          </ChatBubble>
        )}

        {/* Step 4: Upload */}
        {atOrPast('upload') && (
          <>
            <ChatBubble role="ai">
              <p className="font-semibold text-state-success mb-2">
                Silakan upload foto produk kamu ya!
              </p>
              {currentStep === 'upload' && !selectedImageUrl && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 rounded-full bg-accent-light/40 text-primary font-semibold flex items-center justify-center gap-2 hover:bg-accent-light/60 transition-colors mt-3"
                >
                  <Upload className="w-5 h-5" />
                  Upload Foto Produk
                </button>
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
              <ChatBubble role="user">
                <div className="rounded-xl overflow-hidden mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedImageUrl} alt="Uploaded product" className="w-full max-h-52 object-cover rounded-xl" />
                </div>
                <p className="text-xs text-text-secondary mb-2">
                  Ada yang mau ditambahkan? (opsional)
                </p>
                {currentStep === 'upload' && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Contoh: background putih"
                      className="flex-1 px-4 py-2.5 rounded-full border border-neutral-border text-xs"
                    />
                    <button
                      onClick={handleGenerateImage}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </ChatBubble>
            )}
          </>
        )}

        {/* Step 5: Processing */}
        {currentStep === 'processing' && (
          <ChatBubble role="ai">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" style={{ aspectRatio: '1 / 1' }} />
              <p className="text-sm">
                Lagi dibuat sesuai keinginan kamu ya... silakan tunggu sebentar ⏳
              </p>
            </div>
          </ChatBubble>
        )}

        {/* Step 6: Result Review */}
        {atOrPast('result-review') && resultImageUrl && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-3">Ini hasilnya! 🎉</p>
            <div className="rounded-xl overflow-hidden mb-4 bg-accent-chat/30 p-4">
              <div className="w-full h-52 bg-gradient-to-br from-accent-chat/50 to-accent-light/30 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl">🖼️</span>
                  <p className="text-xs text-text-secondary mt-2">Hasil gambar AI</p>
                </div>
              </div>
            </div>
            {currentStep === 'result-review' && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => advanceStep('focus-select')}>
                  Sudah OK ✅
                </Button>
                {retryCountImage < 1 && (
                  <Button size="sm" variant="secondary" onClick={() => { incrementRetryImage(); setStep('upload'); }}>
                    Ulangi 🔄
                  </Button>
                )}
              </div>
            )}
          </ChatBubble>
        )}

        {/* Step 7: Focus Selection */}
        {atOrPast('focus-select') && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-3">Fokus konten kamu apa?</p>
            <div className="flex gap-2 flex-wrap">
              {CAPTION_FOCUS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { if (currentStep === 'focus-select') setFocusSelection(f.id); }}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    focusSelection === f.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-neutral-border text-text-primary'
                  } ${pastStep('focus-select') ? 'opacity-60' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {currentStep === 'focus-select' && focusSelection && (
              <Button size="sm" className="mt-5" onClick={handleGenerateCaption} loading={isProcessing}>
                Buat Caption
              </Button>
            )}
          </ChatBubble>
        )}

        {/* Step 8: Caption Display */}
        {atOrPast('caption-display') && captions.length > 0 && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-3">Rekomendasi Caption:</p>
            <div className="space-y-4">
              {captions.map((caption, idx) => (
                <button
                  key={idx}
                  onClick={() => { if (currentStep === 'caption-display') { setSelectedCaption(caption); setSelectedHashtags(hashtags); } }}
                  className={`w-full text-left p-4 rounded-xl text-xs leading-relaxed transition-all ${
                    selectedCaption === caption
                      ? 'bg-accent-chat border-2 border-primary'
                      : 'bg-white border-2 border-neutral-border/50'
                  } ${pastStep('caption-display') ? 'opacity-60' : 'hover:border-primary/50'}`}
                >
                  <p className="font-semibold text-text-secondary mb-1.5">Opsi {idx + 1}</p>
                  <p className="text-text-primary">{caption}</p>
                </button>
              ))}
            </div>
            {hashtags.length > 0 && (
              <p className="text-xs text-primary font-medium mt-3">
                {hashtags.join(' ')}
              </p>
            )}
            {currentStep === 'caption-display' && selectedCaption && (
              <Button size="sm" className="mt-5" onClick={() => advanceStep('schedule-prompt')}>
                Lanjut
              </Button>
            )}
            {currentStep === 'caption-display' && retryCountCaption < 1 && (
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => { incrementRetryCaption(); setCaptions([]); setSelectedCaption(''); setStep('focus-select'); }}>
                Generate ulang 🔄
              </Button>
            )}
          </ChatBubble>
        )}

        {/* Step 9: Schedule Prompt */}
        {atOrPast('schedule-prompt') && (
          <ChatBubble role="ai">
            <p className="font-semibold mb-3">Ayo jadwalkan upload fotomu! 📅</p>
            <Button size="sm" onClick={() => router.push('/schedule')}>
              Buat Jadwal
            </Button>
          </ChatBubble>
        )}
      </div>
    </MobileLayout>
  );
}
