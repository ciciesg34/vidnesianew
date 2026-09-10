'use client';
import { useState } from 'react';

export default function VideoCard({ video }) {
  const [imgError, setImgError] = useState(false);
  const shareText = encodeURIComponent(
    `🎬 ${video.title}\n\nTonton di Vidnesia:\n${video.videoUrl}`
  );
  const waShare = `https://wa.me/?text=${shareText}`;

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-white/5 card-hover">
      <a
        href={video.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-video bg-bg overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgError || !video.thumbnailUrl ? '/fallback-thumb.jpg' : video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-bg ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <span className="absolute top-2 left-2 bg-black/70 backdrop-blur text-[10px] font-semibold text-accent px-2 py-1 rounded-md uppercase tracking-wide">
          {video.category || 'Umum'}
        </span>
      </a>

      <div className="p-3">
        <h3 className="text-sm font-bold leading-snug line-clamp-2 min-h-[2.5rem]">
          {video.title}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-2">
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-semibold bg-accent/10 hover:bg-accent text-accent hover:text-bg py-2 rounded-lg transition-colors btn-tap"
          >
            ▶ Tonton
          </a>
          <a
            href={waShare}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share ke WhatsApp"
            className="w-9 h-9 shrink-0 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-colors btn-tap"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}