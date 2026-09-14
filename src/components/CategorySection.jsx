import Link from 'next/link';
import { getAllVideos } from '@/lib/videos';

export default function CategorySection() {
  const all = getAllVideos();

  // Group by kategori
  const grouped = {};
  all.forEach((v) => {
    const cat = v.category || 'Umum';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(v);
  });

  // Ambil 3 kategori dengan video terbanyak
  const topCategories = Object.keys(grouped)
    .sort((a, b) => grouped[b].length - grouped[a].length)
    .slice(0, 3);

  if (topCategories.length === 0) return null;

  return (
    <>
      {topCategories.map((cat) => {
        const items = grouped[cat].slice(0, 4);
        return (
          <section key={cat} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-extrabold">
                🔥 Populer di <span className="text-accent">{cat}</span>
              </h2>
              <Link
                href={`/kategori/${encodeURIComponent(cat.toLowerCase())}`}
                className="text-xs text-accent font-semibold hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {items.map((v) => (
                <Link
                  key={v.id}
                  href={`/video/${v.id}`}
                  className="bg-card rounded-xl overflow-hidden border border-white/5 card-hover group"
                >
                  <div className="aspect-video bg-bg relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.thumbnailUrl || '/fallback-thumb.jpg'}
                      alt={v.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-xs font-bold leading-snug line-clamp-2">
                      {v.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}