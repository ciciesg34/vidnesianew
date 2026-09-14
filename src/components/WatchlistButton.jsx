'use client';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'vidnesia_watchlist';

export function getWatchlist() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(video) {
  if (typeof window === 'undefined') return;
  const list = getWatchlist();
  if (!list.find((v) => v.id === video.id)) {
    list.unshift({
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('watchlist-updated'));
  }
}

export function removeFromWatchlist(id) {
  if (typeof window === 'undefined') return;
  const list = getWatchlist().filter((v) => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('watchlist-updated'));
}

export default function WatchlistButton({ video }) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => {
      const list = getWatchlist();
      setSaved(!!list.find((v) => v.id === video.id));
    };
    check();
    window.addEventListener('watchlist-updated', check);
    return () => window.removeEventListener('watchlist-updated', check);
  }, [video.id]);

  const toggle = () => {
    if (saved) {
      removeFromWatchlist(video.id);
    } else {
      addToWatchlist(video);
    }
    setSaved(!saved);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className={`text-xs font-bold px-4 py-3 rounded-xl btn-tap transition-colors ${
        saved
          ? 'bg-accent text-bg'
          : 'bg-card border border-white/10 text-white hover:border-accent'
      }`}
    >
      {saved ? '⭐ Tersimpan' : '☆ Simpan'}
    </button>
  );
}