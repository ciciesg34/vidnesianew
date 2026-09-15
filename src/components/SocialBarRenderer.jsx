'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function SocialBarRenderer({ html }) {
  const pathname = usePathname();

  // Halaman yang TIDAK boleh render Social Bar
  const isBlocked =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/video/');

  // Kalau diblokir atau HTML kosong → jangan render
  if (isBlocked || !html || !html.trim()) return null;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}