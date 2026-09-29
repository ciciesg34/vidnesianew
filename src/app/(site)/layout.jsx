import { getSettings } from '@/lib/settings';
import SocialBarRenderer from '@/components/SocialBarRenderer';

export const metadata = {
  title: {
    default: 'Vidnesia - Katalog Video Streaming',
    template: '%s | Vidnesia'
  },
  description: 'Vidnesia - Katalog video streaming modern dengan koleksi lengkap.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Vidnesia',
    statusBarStyle: 'black-translucent'
  },
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

export default function SiteLayout({ children }) {
  const settings = getSettings();
  const headPopup = settings?.ads?.headPopup || '';
  const socialBar = settings?.ads?.socialBar || '';
  const histats = settings?.analytics?.histats || '';
  const ga = settings?.analytics?.googleAnalytics || '';

  return (
    <>
      {headPopup && (
        <div
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{ __html: headPopup }}
        />
      )}

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

      {histats && (
        <div
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{ __html: histats }}
        />
      )}

      {children}

      <SocialBarRenderer html={socialBar} />
    </>
  );
}