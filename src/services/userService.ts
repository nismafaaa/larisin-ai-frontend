import { api, USE_MOCK } from '@/lib/api';
import type { BusinessProfile, BusinessProfileResponse, User } from '@/types';

export const userService = {
  editProfile: async (data: Partial<User>): Promise<{ message: string }> => {
    if (!USE_MOCK) {
      return await api.post('/api/v1/user/edit_profile', data);
    }
    await new Promise((r) => setTimeout(r, 300));
    return { message: 'Edit profil berhasil' };
  },

  saveBusinessProfile: async (data: BusinessProfile): Promise<BusinessProfileResponse> => {
    if (!USE_MOCK) {
      return await api.put<BusinessProfileResponse>('/api/v1/user/business_profile', data);
    }
    await new Promise((r) => setTimeout(r, 300));
    return { status: true, message: 'Profil bisnis berhasil diperbarui' };
  },
};
