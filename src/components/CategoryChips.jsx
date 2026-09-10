'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CategoryChips({ categories = [], active }) {
  const pathname = usePathname();
  const all = ['Semua', ...categories];

  return (
    <div className="sticky top-[60px] z-40 bg-bg/85 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 sm:px-6 py-3">
          {all.map((cat) => {
            const isSemua = cat === 'Semua';
            const href = isSemua ? '/' : `/kategori/${encodeURIComponent(cat.toLowerCase())}`;
            const isActive =
              active === cat ||
              (!active && isSemua) ||
              (pathname === href);
            return (
              <Link
                key={cat}
                href={href}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all btn-tap ${
                  isActive
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-card text-muted border-white/5 hover:text-white hover:border-accent/50'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}