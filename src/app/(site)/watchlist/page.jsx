'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmptyState from '@/components/EmptyState';

const STORAGE_KEY = 'vidnesia_watchlist';

export default function WatchlistPage() {
  const [list, setList] = useState([]);
  const [mounted, setMounted] = useState(false);

  const load = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      setList(data ? JSON.parse(data) : []);
    } catch {
      setList([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    load();
    window.addEventListener('watchlist-updated', load);
    return () => window.removeEventListener('watchlist-updated', load);
  }, []);

  const remove = (id) => {
    const next = list.filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setList(next);
  };

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-10 text-center text-muted">
          Memuat...
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        <h1 className="text-lg sm:text-xl font-extrabold mb-4">
          ⭐ Watchlist <span className="text-accent">Saya</span>
        </h1>

        {list.length === 0 ? (
          <EmptyState
            icon="⭐"
            title="Belum ada video tersimpan"
            subtitle="Klik tombol ☆ Simpan di halaman video untuk menambahkan ke watchlist."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {list.map((v) => (
              <div key={v.id} className="bg-card rounded-xl overflow-hidden border border-white/5">
                <Link href={`/video/${v.id}`} className="block aspect-video bg-bg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.thumbnailUrl || '/fallback-thumb.jpg'}
                    alt={v.title}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="p-3">
                  <Link href={`/video/${v.id}`}>
                    <h3 className="text-sm font-bold line-clamp-2 mb-2 hover:text-accent transition-colors">
                      {v.title}
                    </h3>
                  </Link>
                  <div className="flex gap-2">
                    <Link
                      href={`/video/${v.id}`}
                      className="flex-1 text-center text-xs font-semibold bg-accent/10 hover:bg-accent text-accent hover:text-bg py-2 rounded-lg transition-colors btn-tap"
                    >
                      ▶ Tonton
                    </Link>
                    <button
                      onClick={() => remove(v.id)}
                      className="w-9 h-9 shrink-0 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-colors btn-tap"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}