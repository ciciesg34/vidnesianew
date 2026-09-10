import videos from '@/data/videos.json';

export const VIDEOS_PER_PAGE = 12;

export function getAllVideos() {
  return Array.isArray(videos) ? videos : [];
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

export function getVideoById(id) {
  return getAllVideos().find((v) => v.id === id) || null;
}