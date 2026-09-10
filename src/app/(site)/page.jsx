import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryChips from '@/components/CategoryChips';
import VideoGrid from '@/components/VideoGrid';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import AdBanner from '@/components/AdBanner';
import { getAllCategories, getPaginatedVideos } from '@/lib/videos';
import { getAds } from '@/lib/settings';

export const metadata = {
  title: 'Vidnesia - Katalog Video Streaming',
  description: 'Katalog video streaming modern dengan koleksi lengkap.'
};

export default function HomePage() {
  const { items, totalPages, currentPage } = getPaginatedVideos(1);
  const categories = getAllCategories();
  const ads = getAds();

  return (
    <>
      <Header />
      <CategoryChips categories={categories} active="Semua" />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        <AdBanner code={ads.headerBanner} label="Iklan" />

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-xl font-extrabold">
            Video <span className="text-accent">Terbaru</span>
          </h1>
          <span className="text-xs text-muted">
            Hal {currentPage} / {totalPages}
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <VideoGrid videos={items} adCode={ads.inFeedBanner} adAfter={4} />
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="home" />
      </main>

      <Footer />
    </>
  );
}