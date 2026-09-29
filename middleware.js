import { NextResponse } from 'next/server';

const COOKIE_NAME = 'vidnesia_admin';
const VERIFY_COOKIE = 'vidnesia_verified';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. PROTEKSI ADMIN
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

  // 2. PROTEKSI CAPTCHA HOMEPAGE
  // Match: '/' saja (homepage)
  // Tapi TIDAK match: /verify, /admin, /api, /_next, /search, /kategori, /video, /watchlist
  if (pathname === '/') {
    const verified = request.cookies.get(VERIFY_COOKIE)?.value;

    if (!verified || verified !== 'true') {
      const url = request.nextUrl.clone();
      url.pathname = '/verify';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match semua path KECUALI yang di-exclude
    '/((?!api|_next/static|_next/image|favicon.ico|verify|admin|search|kategori|video|watchlist|logo.png|fallback-thumb.jpg|manifest.json|sitemap.xml|robots.txt).*)',
  ]
};