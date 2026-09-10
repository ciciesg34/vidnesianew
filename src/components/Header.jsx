'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
      setQ('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-extrabold text-bg">
            V
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            Vid<span className="text-accent">nesia</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <form
            onSubmit={submit}
            className="hidden md:flex items-center bg-card rounded-xl px-3 py-2 w-72 border border-white/5 focus-within:border-accent transition-colors"
          >
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari video..."
              className="bg-transparent outline-none ml-2 text-sm w-full placeholder:text-muted"
            />
          </form>

          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Search"
            className="md:hidden w-10 h-10 rounded-xl bg-card flex items-center justify-center border border-white/5 btn-tap"
          >
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-3 pb-3">
          <form onSubmit={submit} className="flex items-center bg-card rounded-xl px-3 py-3 border border-white/5 focus-within:border-accent transition-colors">
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari video..."
              className="bg-transparent outline-none ml-2 text-sm w-full placeholder:text-muted"
            />
            <button type="submit" className="text-accent text-sm font-semibold px-2">
              Cari
            </button>
          </form>
        </div>
      )}
    </header>
  );
}