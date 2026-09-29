import { NextResponse } from 'next/server';

const COOKIE_NAME = 'vidnesia_admin';
const VERIFY_COOKIE = 'vidnesia_verified';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ========================================
  // 1. PROTEKSI ADMIN (yang sudah ada)
  // ========================================
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!token || token !== secret) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ========================================
  // 2. PROTEKSI CAPTCHA HOMEPAGE (BARU)
  // ========================================
  // Hanya proteksi homepage (pathname === '/')
  if (pathname === '/') {
    const verified = request.cookies.get(VERIFY_COOKIE)?.value;

    // Kalau belum verifikasi → redirect ke /verify
    if (!verified || verified !== 'true') {
      const url = request.nextUrl.clone();
      url.pathname = '/verify';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  // Kalau sudah verifikasi atau bukan homepage → lanjut normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/'
  ]
};