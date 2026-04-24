export const USE_MOCK = true;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private getHeaders(isFormData = false): HeadersInit {
    const headers: HeadersInit = {};
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      throw error;
    }
    return res.json();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      throw error;
    }
    return res.json();
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      throw error;
    }
    return res.json();
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      throw error;
    }
    return res.json();
  }
}

export const api = new ApiClient(BASE_URL);