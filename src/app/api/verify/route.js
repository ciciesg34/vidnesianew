import { NextResponse } from 'next/server';

const VERIFY_COOKIE = 'vidnesia_verified';
const MAX_AGE = 60 * 60 * 24; // 24 jam

export async function POST(request) {
  try {
    const body = await request.json();
    const { answer, expected } = body;

    // Validasi: pastikan answer = expected (angka)
    if (typeof answer !== 'number' || typeof expected !== 'number' || answer !== expected) {
      return NextResponse.json({ error: 'Jawaban salah' }, { status: 400 });
    }

    // Set cookie verifikasi
    const res = NextResponse.json({ ok: true });
    res.cookies.set(VERIFY_COOKIE, 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: MAX_AGE
    });

    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}