'use client';
import { useState } from 'react';

export default function VideoPlayer({ video }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const embedSource = video.embedUrl || video.videoUrl;

  if (error) {
    return (
      <div className="bg-card rounded-xl overflow-hidden border border-white/5">
        <div className="aspect-video bg-bg flex items-center justify-center text-center p-6">
          <div>
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-red-400 font-bold mb-1">Video gagal dimuat</p>
            <p className="text-muted text-sm mb-4">
              Silakan buka di tab baru
            </p>
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent text-bg font-bold px-5 py-3 rounded-lg btn-tap"
            >
              🔗 Buka di VSTR
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl overflow-hidden border border-white/5">
      <div className="aspect-video bg-bg relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-muted text-sm">Memuat video...</p>
            </div>
          </div>
        )}

        <iframe
          src={embedSource}
          className="w-full h-full relative z-20"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />
      </div>

      <div className="p-3 bg-card border-t border-white/5 flex items-center justify-between gap-2">
        <p className="text-xs text-muted">
          Video tidak muncul? Coba buka di tab baru.
        </p>
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold bg-accent/10 hover:bg-accent text-accent hover:text-bg px-3 py-2 rounded-lg transition-colors btn-tap"
        >
          🔗 Buka di VSTR
        </a>
      </div>
    </div>
  );
}