export const metadata = {
  title: 'Verifikasi Keamanan - Vidnesia',
  description: 'Halaman verifikasi keamanan Vidnesia',
  robots: { index: false, follow: false }
};

// Layout ini BERSIH — tidak ada Adsterra / Social Bar / Analytics
export default function VerifyLayout({ children }) {
  return <>{children}</>;
}