import '../globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
});

export const metadata = {
  title: 'Admin - Vidnesia',
  description: 'Dashboard admin Vidnesia',
  robots: { index: false, follow: false }
};

export const viewport = {
  themeColor: '#0B0C10',
  width: 'device-width',
  initialScale: 1
};

// TIDAK ADA script Adsterra / Analytics di sini.
// Halaman admin 100% bersih dari iklan.
export default function AdminRootLayout({ children }) {
  return (
    <html lang="id" className={inter.className}>
      <body className="bg-bg text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}