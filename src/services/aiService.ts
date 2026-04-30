import { api } from '@/lib/api';
import type {
  GenerateImageResponse,
  GenerateCaptionRequest,
  GenerateCaptionResponse,
} from '@/types';

export const aiService = {
  generateImage: async (formData: FormData): Promise<GenerateImageResponse> => {
    return await api.postFormData<GenerateImageResponse>('/api/v1/ai/generate-image', formData);
  },

  generateCaption: async (data: GenerateCaptionRequest): Promise<GenerateCaptionResponse> => {
    return await api.post<GenerateCaptionResponse>('/api/v1/ai/generate-caption', data);
  },
};
