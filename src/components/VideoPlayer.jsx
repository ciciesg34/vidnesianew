'use client';
import { useState } from 'react';

// Deteksi jenis sumber video dari URL
function detectSourceType(url) {
  if (!url || typeof url !== 'string') return 'unknown';
  const u = url.toLowerCase().trim();

  // File video langsung
  if (u.endsWith('.mp4') || u.includes('.mp4?')) return 'mp4';
  if (u.endsWith('.webm') || u.includes('.webm?')) return 'webm';
  if (u.endsWith('.m3u8') || u.includes('.m3u8?')) return 'hls';

  // Platform embed yang umum
  if (u.includes('vstr.in') ||
      u.includes('vstr.to') ||
      u.includes('voe.sx') ||
      u.includes('doodstream') ||
      u.includes('streamtape') ||
      u.includes('mixdrop') ||
      u.includes('filemoon') ||
      u.includes('streamhub') ||
      u.includes('mp4upload') ||
      u.includes('upstream') ||
      u.includes('netu.tv') ||
      u.includes('vidmonstr.com')) {
    return 'iframe';
  }

  // Deteksi umum format embed
  if (u.includes('/e/') ||
      u.includes('/embed') ||
      u.includes('/v/') ||
      u.includes('/d/') ||
      u.includes('/player/') ||
      u.includes('/iframe/')) {
    return 'iframe';
  }

  // Default: coba iframe
  return 'iframe';
}

export default function VideoPlayer({ video }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Prioritas: embedUrl → videoUrl → kosong
  const embedSource = (video.embedUrl || video.videoUrl || '').trim();
  const sourceType = detectSourceType(embedSource);

  // Kalau tidak ada URL sama sekali
  if (!embedSource) {
    return (
      <div className="bg-card rounded-xl overflow-hidden border border-white/5">
        <div className="aspect-video bg-bg flex items-center justify-center text-center p-6">
          <div>
            <div className="text-5xl mb-3">📭</div>
            <p className="text-muted">Video belum tersedia</p>
          </div>
        </div>
      </div>
    );
  }

  // Kalau error
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
              href={video.videoUrl || embedSource}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent text-bg font-bold px-5 py-3 rounded-lg btn-tap"
            >
              🔗 Buka di Sumber Asli
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

        {/* MP4 / WebM — pakai tag video */}
        {(sourceType === 'mp4' || sourceType === 'webm') && (
          <video
            src={embedSource}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full relative z-20"
            onLoadedData={() => setLoading(false)}
            onError={() => setError(true)}
          >
            Browser Anda tidak mendukung video.
          </video>
        )}

        {/* HLS — pakai video tag dengan hls.js fallback */}
        {sourceType === 'hls' && (
          <video
            src={embedSource}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full relative z-20"
            onLoadedData={() => setLoading(false)}
            onError={() => setError(true)}
          >
            Browser Anda tidak mendukung HLS.
          </video>
        )}

        {/* Iframe — untuk semua hosting embed */}
        {sourceType === 'iframe' && (
          <iframe
            src={embedSource}
            className="w-full h-full relative z-20"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
          />
        )}
      </div>

      {/* Bar bawah dengan tombol fallback */}
      <div className="p-3 bg-card border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs text-muted">
          Video tidak muncul? Coba buka di tab baru.
        </p>
        <a
          href={video.videoUrl || embedSource}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold bg-accent/10 hover:bg-accent text-accent hover:text-bg px-3 py-2 rounded-lg transition-colors btn-tap"
        >
          🔗 Buka di Sumber Asli
        </a>
      </div>
    </div>
  );
}