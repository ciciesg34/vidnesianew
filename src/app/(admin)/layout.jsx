export const metadata = {
  title: 'Admin - Vidnesia',
  description: 'Dashboard admin Vidnesia',
  robots: { index: false, follow: false }
};

// TIDAK ADA script Adsterra / Analytics di sini.
// Halaman admin 100% bersih dari iklan.
export default function AdminLayout({ children }) {
  return <>{children}</>;
}