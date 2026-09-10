import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { getVideoById } from '@/lib/videos';
import { getAds } from '@/lib/settings';

export async function generateMetadata({ params }) {
  const video = getVideoById(params.id);
  if (!video) return { title: 'Video tidak ditemukan' };
  return {
    title: video.title,
    description: `Tonton ${video.title} di Vidnesia.`,
    openGraph: {
      title: video.title,
      description: `Tonton ${video.title} di Vidnesia.`,
      images: video.thumbnailUrl ? [video.thumbnailUrl] : ['/logo.png']
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      images: video.thumbnailUrl ? [video.thumbnailUrl] : ['/logo.png']
    }
  };
}

export default function VideoDetail({ params }) {
  const video = getVideoById(params.id);
  if (!video) notFound();
  const ads = getAds();

  const shareText = encodeURIComponent(
    `🎬 ${video.title}\n\nTonton di Vidnesia:\n${video.videoUrl}`
  );

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-3 sm:px-6 py-5">
        <div className="bg-card rounded-xl overflow-hidden border border-white/5">
          <div className="aspect-video bg-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnailUrl || '/fallback-thumb.jpg'}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <span className="inline-block text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded uppercase tracking-wide mb-2">
              {video.category || 'Umum'}
            </span>
            <h1 className="text-lg sm:text-2xl font-extrabold leading-snug mb-3">
              {video.title}
            </h1>

            <div className="flex gap-2 flex-wrap">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] text-center font-bold bg-accent text-bg py-3 rounded-xl btn-tap"
              >
                ▶ Tonton Sekarang
              </a>
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] text-center font-bold bg-[#25D366] text-white py-3 rounded-xl btn-tap"
              >
                Share WhatsApp
              </a>
            </div>
          </div>
        </div>

        <AdBanner code={ads.inFeedBanner} label="Iklan" />

        <div className="mt-4">
          <Link
            href="/"
            className="inline-block text-sm text-muted hover:text-accent transition-colors"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}