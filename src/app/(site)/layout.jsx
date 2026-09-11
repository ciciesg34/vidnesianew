import '../globals.css';
import { Inter } from 'next/font/google';
import { getSettings } from '@/lib/settings';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
});

export const metadata = {
  title: {
    default: 'Vidnesia - Katalog Video Streaming',
    template: '%s | Vidnesia'
  },
  description: 'Vidnesia - Katalog video streaming modern dengan koleksi lengkap.',
  metadataBase: new URL('https://vidnesia.web.id'),
  openGraph: {
    title: 'Vidnesia',
    description: 'Katalog video streaming modern',
    siteName: 'Vidnesia',
    type: 'website',
    images: ['/logo.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vidnesia',
    description: 'Katalog video streaming modern',
    images: ['/logo.png']
  }
};

export const viewport = {
  themeColor: '#0B0C10',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function SiteLayout({ children }) {
  const settings = getSettings();
  const headPopup = settings?.ads?.headPopup || '';
  const histats = settings?.analytics?.histats || '';
  const ga = settings?.analytics?.googleAnalytics || '';

  return (
    <html lang="id" className={inter.className}>
      <head>
        {/* Adsterra Pop-up — pakai script tag biasa, bukan next/script */}
        {headPopup && (
          <div
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: headPopup }}
          />
        )}

        {/* Google Analytics */}
        {ga && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${ga}');
                `
              }}
            />
          </>
        )}

        {/* Histats */}
        {histats && (
          <div
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: histats }}
          />
        )}
      </head>
      <body className="bg-bg text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}