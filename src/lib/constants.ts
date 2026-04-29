// ==================== Business Types ====================
export const BUSINESS_TYPES = [
  { id: 'makanan', label: 'Makanan & Minuman', emoji: '🍔' },
  { id: 'fashion', label: 'Fashion / Pakaian', emoji: '👚' },
  { id: 'kecantikan', label: 'Kecantikan / Skincare', emoji: '💄' },
  { id: 'rumah', label: 'Kebutuhan Rumah', emoji: '🏠' },
];

// ==================== Target Buyers ====================
export const TARGET_BUYERS = [
  { id: 'keluarga', label: 'Keluarga', emoji: '👨‍👩‍👧' },
  { id: 'muda', label: 'Mahasiswa / Anak muda', emoji: '🎓' },
  { id: 'ibu', label: 'Ibu rumah tangga', emoji: '🧕' },
  { id: 'semua', label: 'Semua kalangan', emoji: '🌍' },
];

// ==================== Brand Colors ====================
export const BRAND_COLORS = [
  { id: 'merah', label: 'Merah', hex: '#EF4444' },
  { id: 'jingga', label: 'Jingga', hex: '#F97316' },
  { id: 'kuning', label: 'Kuning', hex: '#EAB308' },
  { id: 'hijau', label: 'Hijau', hex: '#22C55E' },
  { id: 'biru', label: 'Biru', hex: '#3B82F6' },
  { id: 'ungu', label: 'Ungu', hex: '#A855F7' },
];

// ==================== Platforms ====================
export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '/social-media/instagram.png' },
  { id: 'tiktok', label: 'TikTok', icon: '/social-media/tiktok-shop.png' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '/social-media/whatsapp.png' },
  { id: 'facebook', label: 'Facebook', icon: '/social-media/facebook.png' },
  { id: 'shopee', label: 'Shopee/Tokopedia', icon: '/social-media/shopee-tokopedia.png' },
  { id: 'gofood', label: 'GoFood/GrabFood', icon: '/social-media/gofood-grabfood.png' },
  { id: 'toko', label: 'Toko/Outlet', icon: '/social-media/toko-outlet.png' },
  { id: 'none', label: 'Belum jual online', icon: '/social-media/belum-jual-online.png' },
];

// ==================== Needs ====================
export const NEEDS = [
  { id: 'foto', label: 'Memperbagus foto produk', emoji: '📸' },
  { id: 'tulisan', label: 'Membuat tulisan promosi', emoji: '✍️' },
  { id: 'waktu', label: 'Menentukan waktu posting', emoji: '📅' },
  { id: 'panduan', label: 'Panduan mulai berjualan', emoji: '🚀' },
  { id: 'penjualan', label: 'Mau meningkatkan penjualan', emoji: '📈' },
];

// ==================== Promotion Styles ====================
export const PROMO_STYLES = [
  { id: 'santai', label: 'Santai seperti ngobrol', emoji: '😄', example: 'Contoh: "Lagi laper? Yuk cobain ini!"' },
  { id: 'profesional', label: 'Rapi dan profesional', emoji: '💼', example: 'Contoh: "Produk berkualitas, harga terbaik"' },
  { id: 'promo', label: 'Fokus jualan dan promosi', emoji: '🔥', example: 'Contoh: "Diskon hari ini, buruan order!"' },
  { id: 'ramah', label: 'Ramah dan hangat', emoji: '🧡', example: 'Contoh: "Dibuat dengan kasih sayang"' },
  { id: 'lucu', label: 'Lucu dan menarik perhatian', emoji: '😂', example: 'Contoh: "Awas ketagihan!"' },
];

// ==================== Content Ratios ====================
export const CONTENT_RATIOS = [
  { id: '9:16', label: 'IG Story/WhatsApp/TikTok (9:16)' },
  { id: '3:4', label: 'IG Feed (3:4)' },
  { id: '1:1', label: 'Facebook (1:1)' },
  { id: '16:9', label: 'Banner (16:9)' },
];

// ==================== Edit Functions ====================
export const EDIT_FUNCTIONS = [
  { id: 'studio', label: 'Foto produk (lebih rapi & menarik)' },
  { id: 'promo', label: 'Post promosi (siap upload)' },
  { id: 'background', label: 'Hapus / ganti background' },
];

// ==================== Caption Focus ====================
export const CAPTION_FOCUS = [
  { id: 'promo', label: 'Promo' },
  { id: 'kualitas', label: 'Kualitas' },
  { id: 'branding', label: 'Branding' },
];

// ==================== Recommended Times ====================
export const RECOMMENDED_TIMES = ['09:30', '10:30', '12:00', '15:30'];

// ==================== News Feed ====================
export const NEWS_ARTICLES = [
  {
    id: '1',
    title: 'Strategi Digital Marketing untuk UMKM di Era Persaingan Online',
    date: '27 Maret 2026',
    source: 'Kompasiana',
    thumbnail: '/article-thumbnail/artikel-1.png',
    link: 'https://www.kompasiana.com/prfeducationmitramediatama/69c5ac7bed6415223c280992/strategi-digital-marketing-untuk-umkm-di-era-persaingan-online',
    color: '#5B6DFF',
  },
  {
    id: '2',
    title: 'Strategi Digital Marketing yang Efektif: Kunci Bertahan dan Bertumbuh di Era Digital',
    date: '19 Februari 2026',
    source: 'Kompasiana',
    thumbnail: '/article-thumbnail/artikel-2.png',
    link: 'https://www.kompasiana.com/prfeducationmitramediatama/699677cd34777c32f11d7d02/strategi-digital-marketing-yang-efektif-kunci-bertahan-dan-bertumbuh-di-era-digital',
    color: '#4E8FF3',
  },
  {
    id: '3',
    title: 'Kementerian UMKM Dorong Adopsi AI untuk Perkuat Ekonomi Inklusif',
    date: '21 April 2026',
    source: 'umkm.go.id',
    thumbnail: '/article-thumbnail/artikel-3.png',
    link: 'https://umkm.go.id/news/y3vlf19kvx1zcemwdxewows1',
    color: '#69D1F4',
  },
  {
    id: '4',
    title: 'AI Generatif Sebagai Solusi Inovatif Bisnis UMKM',
    date: '22 November 2024',
    source: 'ioh.co.id',
    thumbnail: '/article-thumbnail/artikel-4.png',
    link: 'https://ioh.co.id/portal/id/iohcorparticledetail/ai-generatif-sebagai-solusi-inovatif-bisnis-umkm',
    color: '#5B6DFF',
  },
];