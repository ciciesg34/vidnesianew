import videos from '@/data/videos.json';

export const VIDEOS_PER_PAGE = 12;

// Extract kode dari URL video
// Contoh: https://tribunvideo.com/e/8vo8sl1ii631 → 8vo8sl1ii631
export function extractCodeFromUrl(url) {
  if (!url || typeof url !== 'string') return '';
  try {
    const cleaned = url.split('?')[0].split('#')[0];
    const parts = cleaned.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    return last.replace(/\.[^.]*$/, '').toLowerCase();
  } catch {
    return '';
  }
}

// Bersihkan judul dari simbol & ekstensi
// Contoh: "▶ 1000248000.mp4" → "1000248000"
export function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/[▶►●•·◆★☆✓✔⬤◆]/g, '')
    .replace(/\.(mp4|mkv|avi|mov|webm|flv|wmv|m4v)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate slug kategori
function slugifyCategory(cat) {
  return (cat || 'umum')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'umum';
}

export function getAllVideos() {
  if (!Array.isArray(videos)) return [];
  return [...videos].reverse();
}

export function getPaginatedVideos(page = 1, perPage = VIDEOS_PER_PAGE) {
  const all = getAllVideos();
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  const items = all.slice(start, start + perPage);
  return { items, total, totalPages, currentPage: current };
}

export function getVideosByCategory(category, page = 1, perPage = VIDEOS_PER_PAGE) {
  const all = getAllVideos().filter(
    (v) => v.category?.toLowerCase() === category?.toLowerCase()
  );
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: all.slice(start, start + perPage),
    total,
    totalPages,
    currentPage: current,
    category
  };
}

export function searchVideos(query, page = 1, perPage = VIDEOS_PER_PAGE) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return { items: [], total: 0, totalPages: 1, currentPage: 1, query: '' };
  const all = getAllVideos().filter(
    (v) =>
      v.title?.toLowerCase().includes(q) ||
      v.category?.toLowerCase().includes(q)
  );
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: all.slice(start, start + perPage),
    total,
    totalPages,
    currentPage: current,
    query
  };
}

export function getAllCategories() {
  const set = new Set();
  getAllVideos().forEach((v) => v.category && set.add(v.category));
  return Array.from(set).sort();
}

// Cari video by id (kode baru) ATAU id lama (backward compatible)
export function getVideoById(id) {
  if (!id) return null;
  const all = getAllVideos();
  return all.find((v) => v.id === id) || null;
}

// Tampilkan judul: pakai title asli, atau fallback ke "Video [KATEGORI]"
export function getDisplayTitle(video) {
  if (!video) return '';
  const cleaned = cleanTitle(video.title || '');
  if (cleaned) return cleaned;
  return `Video ${video.category || 'Umum'}`;
}