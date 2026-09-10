import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryChips from '@/components/CategoryChips';
import VideoGrid from '@/components/VideoGrid';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import AdBanner from '@/components/AdBanner';
import { getAllCategories, getVideosByCategory } from '@/lib/videos';
import { getAds } from '@/lib/settings';

export async function generateMetadata({ params }) {
  const cat = decodeURIComponent(params.slug);
  return {
    title: `Kategori: ${cat}`,
    description: `Koleksi video kategori ${cat} di Vidnesia.`
  };
}

export default function CategoryPage({ params, searchParams }) {
  const cat = decodeURIComponent(params.slug);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const result = getVideosByCategory(cat, page);
  const categories = getAllCategories();

  if (result.total === 0 && !categories.some((c) => c.toLowerCase() === cat.toLowerCase())) {
    notFound();
  }

  const ads = getAds();

  return (
    <>
      <Header />
      <CategoryChips categories={categories} active={cat} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        <AdBanner code={ads.headerBanner} label="Iklan" />

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-xl font-extrabold">
            Kategori <span className="text-accent">{cat}</span>
          </h1>
          <span className="text-xs text-muted">
            {result.total} video
          </span>
        </div>

        {result.items.length === 0 ? (
          <EmptyState
            icon="📂"
            title="Video belum tersedia"
            subtitle={`Belum ada video di kategori ${cat}.`}
          />
        ) : (
          <VideoGrid videos={result.items} adCode={ads.inFeedBanner} adAfter={4} />
        )}

        <Pagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
          basePath={`/kategori/${encodeURIComponent(cat.toLowerCase())}`}
        />
      </main>

      <Footer />
    </>
  );
}