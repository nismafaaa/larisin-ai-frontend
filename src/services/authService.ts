import { api, USE_MOCK } from '@/lib/api';
import type { SignUpRequest, LoginRequest, AuthResponse } from '@/types';

export const authService = {
  signup: async (data: SignUpRequest): Promise<AuthResponse> => {
    if (!USE_MOCK) {
      return await api.post<AuthResponse>('/api/v1/auth/signup', data);
    }
    await new Promise((r) => setTimeout(r, 500));
    return {
      token: 'mock_jwt_token_' + Date.now(),
      message: 'Registrasi berhasil',
      user: {
        name: data.name,
        email: data.email,
      },
    };
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (!USE_MOCK) {
      return await api.post<AuthResponse>('/api/v1/auth/login', data);
    }
    await new Promise((r) => setTimeout(r, 500));
    const localPart = data.email.split('@')[0];
    const firstName = localPart.split(/[._-]/)[0];
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    return {
      token: 'mock_jwt_token_' + Date.now(),
      message: 'Login berhasil',
      user: {
        name: displayName,
        email: data.email,
      },
    };
  },
};