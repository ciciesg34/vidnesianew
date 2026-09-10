import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryChips from '@/components/CategoryChips';
import VideoGrid from '@/components/VideoGrid';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import AdBanner from '@/components/AdBanner';
import { getAllCategories, searchVideos } from '@/lib/videos';
import { getAds } from '@/lib/settings';

export async function generateMetadata({ searchParams }) {
  const q = searchParams.q || '';
  return {
    title: q ? `Pencarian: ${q}` : 'Pencarian',
    description: q
      ? `Hasil pencarian untuk "${q}" di Vidnesia.`
      : 'Cari video di Vidnesia.'
  };
}

export default function SearchPage({ searchParams }) {
  const q = (searchParams.q || '').toString();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const result = searchVideos(q, page);
  const categories = getAllCategories();
  const ads = getAds();

  return (
    <>
      <Header />
      <CategoryChips categories={categories} active="Semua" />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        <AdBanner code={ads.headerBanner} label="Iklan" />

        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-extrabold">
            Hasil Pencarian
          </h1>
          <p className="text-sm text-muted mt-1">
            {q ? (
              <>Kata kunci: <span className="text-accent font-semibold">"{q}"</span> — {result.total} video ditemukan</>
            ) : (
              'Masukkan kata kunci untuk mencari video.'
            )}
          </p>
        </div>

        {!q ? (
          <EmptyState
            icon="🔍"
            title="Mulai pencarian"
            subtitle="Gunakan tombol pencarian di atas untuk menemukan video favorit Anda."
          />
        ) : result.items.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Pencarian tidak ditemukan"
            subtitle={`Tidak ada video yang cocok dengan "${q}". Coba kata kunci lain.`}
          />
        ) : (
          <>
            <VideoGrid videos={result.items} adCode={ads.inFeedBanner} adAfter={4} />
            <Pagination
              currentPage={result.currentPage}
              totalPages={result.totalPages}
              basePath="search"
              query={q}
            />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}