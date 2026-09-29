import '../globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
});

export const metadata = {
  title: 'Verifikasi Keamanan - Vidnesia',
  description: 'Halaman verifikasi keamanan Vidnesia',
  robots: { index: false, follow: false }
};

export const viewport = {
  themeColor: '#0B0C10',
  width: 'device-width',
  initialScale: 1
};

// ⚠️ Layout ini BERSIH dari iklan (Adsterra, Social Bar, Histats)
// Hanya untuk halaman captcha /verify
export default function VerifyLayout({ children }) {
  return (
    <html lang="id" className={inter.className}>
      <body className="bg-bg text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}