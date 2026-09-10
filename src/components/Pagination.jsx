import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, basePath = '', query = '' }) {
  if (totalPages <= 1) return null;

  const makeHref = (p) => {
    if (basePath === 'search') {
      return `/search?q=${encodeURIComponent(query)}&page=${p}`;
    }
    if (basePath && basePath !== 'home') {
      return `${basePath}${basePath.includes('?') ? '&' : '?'}page=${p}`;
    }
    return p === 1 ? '/' : `/page/${p}`;
  };

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = Array.from(pages).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push('...');
    items.push(p);
    prev = p;
  }

  return (
    <nav className="flex justify-center items-center gap-1.5 mt-8 flex-wrap">
      {currentPage > 1 && (
        <Link
          href={makeHref(currentPage - 1)}
          className="px-3 h-10 min-w-[40px] flex items-center justify-center rounded-lg bg-card border border-white/5 text-sm font-medium hover:border-accent hover:text-accent transition-colors btn-tap"
        >
          ‹
        </Link>
      )}

      {items.map((it, i) =>
        it === '...' ? (
          <span key={`e${i}`} className="px-2 text-muted select-none">
            …
          </span>
        ) : (
          <Link
            key={it}
            href={makeHref(it)}
            className={`px-3 h-10 min-w-[40px] flex items-center justify-center rounded-lg text-sm font-semibold border transition-colors btn-tap ${
              it === currentPage
                ? 'bg-accent text-bg border-accent'
                : 'bg-card border-white/5 text-white hover:border-accent hover:text-accent'
            }`}
          >
            {it}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={makeHref(currentPage + 1)}
          className="px-3 h-10 min-w-[40px] flex items-center justify-center rounded-lg bg-card border border-white/5 text-sm font-medium hover:border-accent hover:text-accent transition-colors btn-tap"
        >
          ›
        </Link>
      )}
    </nav>
  );
}