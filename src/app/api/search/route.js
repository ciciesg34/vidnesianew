import { NextResponse } from 'next/server';
import { searchVideos } from '@/lib/videos';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const result = searchVideos(q, page);
  return NextResponse.json({
    items: result.items,
    total: result.total,
    totalPages: result.totalPages,
    currentPage: result.currentPage
  });
}