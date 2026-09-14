import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { getVideoById } from '@/lib/videos';

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

  const shareText = encodeURIComponent(
    `🎬 ${video.title}\n\nTonton di Vidnesia:\nhttps://vidnesia.web.id/video/${video.id}`
  );

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-5">
        <VideoPlayer video={video} />

        <div className="mt-4 bg-card rounded-xl p-4 border border-white/5">
          <span className="inline-block text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded uppercase tracking-wide mb-2">
            {video.category || 'Umum'}
          </span>

          <h1 className="text-lg sm:text-2xl font-extrabold leading-snug mb-4">
            {video.title}
          </h1>

          <div className="flex gap-2 flex-wrap">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] text-center text-sm font-bold bg-[#25D366] text-white py-3 rounded-xl btn-tap"
            >
              📱 Share WhatsApp
            </a>
            <Link
              href="/"
              className="flex-1 min-w-[140px] text-center text-sm font-bold bg-card border border-white/10 text-white py-3 rounded-xl btn-tap hover:border-accent transition-colors"
            >
              🏠 Beranda
            </Link>
          </div>
        </div>

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