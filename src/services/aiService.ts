import { api, USE_MOCK } from '@/lib/api';
import type {
  GenerateImageResponse,
  GenerateCaptionRequest,
  GenerateCaptionResponse,
} from '@/types';

export const aiService = {
  generateImage: async (formData: FormData): Promise<GenerateImageResponse> => {
    if (!USE_MOCK) {
      return await api.postFormData<GenerateImageResponse>('/api/v1/ai/generate_image', formData);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      job_id: 'mock_job_' + Date.now(),
      result_image_url: '/nastar-enhanced.png',
      message: 'Gambar berhasil dibuat',
    };
  },

  generateCaption: async (data: GenerateCaptionRequest): Promise<GenerateCaptionResponse> => {
    if (!USE_MOCK) {
      return await api.post<GenerateCaptionResponse>('/api/v1/ai/generate-caption', data);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      captions: [
        '✨ Produk terbaik untuk keluarga Indonesia! Kualitas premium, harga bersahabat. Yuk, cobain sekarang! 💛',
        '🔥 PROMO SPESIAL! Dapatkan produk unggulan kami dengan diskon hingga 30%! Buruan sebelum kehabisan! 🛒',
        '💝 Dibuat dengan cinta untuk pelanggan setia. Setiap produk kami jaminan kualitas terbaik. Order sekarang! ✅',
      ],
      hashtags: ['#UMKMIndonesia', '#ProdukLokal', '#BeliLokal', '#PromoHariIni', '#ShopLocal'],
    };
  },
};
