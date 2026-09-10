import AdBanner from './AdBanner';
import { getAds } from '@/lib/settings';

export default function Footer() {
  const ads = getAds();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <AdBanner code={ads.footerBanner} label="Iklan" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center font-extrabold text-bg text-sm">
              V
            </div>
            <span className="font-bold text-sm">
              Vid<span className="text-accent">nesia</span>
            </span>
          </div>
          <p className="text-xs text-muted">
            © {year} Vidnesia. Semua video adalah milik pemiliknya masing-masing.
          </p>
        </div>
      </div>
    </footer>
  );
}