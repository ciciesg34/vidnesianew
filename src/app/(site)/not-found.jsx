import Link from 'next/link';
import Header from '@/components/Header';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h1 className="text-3xl font-extrabold mb-2">
          Halaman <span className="text-accent">Tidak Ditemukan</span>
        </h1>
        <p className="text-muted mb-6">
          Video atau halaman yang Anda cari tidak tersedia.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent text-bg font-bold px-6 py-3 rounded-xl btn-tap"
        >
          Kembali ke Beranda
        </Link>
      </main>
    </>
  );
}