import Link from 'next/link';
import { getAllVideos } from '@/lib/videos';

export default function TrendingSection() {
  const all = getAllVideos();
  // Ambil 8 video terbaru sebagai "trending"
  const trending = all.slice(0, 8);

  if (trending.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-extrabold">
          🔥 Trending <span className="text-accent">Minggu Ini</span>
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3">
        {trending.map((v) => (
          <Link
            key={v.id}
            href={`/video/${v.id}`}
            className="shrink-0 w-40 sm:w-48 bg-card rounded-xl overflow-hidden border border-white/5 card-hover group"
          >
            <div className="aspect-video bg-bg relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.thumbnailUrl || '/fallback-thumb.jpg'}
                alt={v.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1 left-1 bg-accent text-bg text-[9px] font-bold px-1.5 py-0.5 rounded">
                #{v.category || 'Umum'}
              </span>
            </div>
            <div className="p-2">
              <h3 className="text-xs font-bold leading-snug line-clamp-2 min-h-[2rem]">
                {v.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}