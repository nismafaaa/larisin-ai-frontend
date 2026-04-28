// ==================== User & Auth ====================
export interface User {
  name: string;
  email: string;
  avatar?: string;
  tanggal_lahir?: string;
  nomor_hp?: string;
  lokasi?: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
  user?: User;
}

// ==================== Business Profile ====================
export interface BusinessProfile {
  nama_bisnis: string;
  jenis_bisnis: string;
  target_pembeli: string;
  warna_utama_brand: string;
  platform_penjualan: string[];
  kebutuhan: string[];
  gaya_promosi: string;
}

export interface BusinessProfileResponse {
  status: boolean;
  message: string;
}

// ==================== AI Features ====================
export interface GenerateImageRequest {
  file: File;
  ukuran_rasio: string;
  fungsi_edit: string;
  instruksi_tambahan?: string;
  business_jenis: string;
  business_target: string;
  business_warna: string;
  business_gaya_promosi: string;
}

export interface GenerateImageResponse {
  job_id: string;
  result_image_url: string;
  message: string;
}

export interface GenerateCaptionRequest {
  image_url: string;
  fokus_promosi: string;
  business_jenis: string;
  business_target: string;
  business_gaya_promosi: string;
  business_platform: string[];
}

export interface GenerateCaptionResponse {
  captions: string[];
  hashtags: string[];
}

// ==================== Schedule ====================
export interface ScheduleItem {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  image_url: string;
  date: string; // ISO date string
  time: string; // "HH:mm"
  platform: string;
  created_at: string;
}

// ==================== Chat ====================
export type ChatRole = 'ai' | 'user';

export type ChatContentType =
  | 'text'
  | 'profile-summary'
  | 'ratio-select'
  | 'function-select'
  | 'color-confirm'
  | 'upload-prompt'
  | 'image-uploaded'
  | 'processing'
  | 'result-image'
  | 'focus-select'
  | 'captions-display'
  | 'caption-selected'
  | 'schedule-prompt'
  | 'buttons';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  type: ChatContentType;
  content: string;
  options?: string[];
  selectedOption?: string;
  imageUrl?: string;
  captions?: string[];
  hashtags?: string[];
  buttons?: { label: string; value: string; variant?: 'primary' | 'secondary' }[];
  timestamp: Date;
}

export type ChatStep =
  | 'profile-review'
  | 'ratio-intro'
  | 'ratio-select'
  | 'function-select'
  | 'color-confirm'
  | 'upload'
  | 'processing'
  | 'result-review'
  | 'focus-select'
  | 'caption-display'
  | 'schedule-prompt'
  | 'complete';


// ==================== News ====================
export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  source: string;
  color: string;
}

// ==================== API Error ====================
export interface ApiError {
  message: string;
  status?: number;
}