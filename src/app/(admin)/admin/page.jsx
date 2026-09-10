import AdminClient from './AdminClient';

export const metadata = {
  title: 'Dashboard Admin',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return <AdminClient />;
}