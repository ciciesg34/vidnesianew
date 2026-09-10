import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'vidnesia_admin';
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const PATH = 'src/data/videos.json';

function authCheck() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token && token === process.env.ADMIN_SESSION_SECRET;
}

async function getFile() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json'
      },
      cache: 'no-store'
    }
  );
  if (!res.ok) throw new Error('Gagal membaca file dari GitHub');
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { sha: data.sha, content };
}

async function putFile(content, sha, message) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        sha,
        branch: BRANCH
      })
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Gagal commit ke GitHub: ' + err);
  }
  return res.json();
}

export async function GET() {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { content } = await getFile();
    return NextResponse.json({ data: JSON.parse(content) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { lines } = await request.json();
    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data untuk diimport' }, { status: 400 });
    }

    const newVideos = [];
    for (let i = 0; i < lines.length; i++) {
      const raw = (lines[i] || '').trim();
      if (!raw) continue;
      const parts = raw.split('|').map((s) => s.trim());
      if (parts.length < 4) {
        return NextResponse.json(
          { error: `Baris ${i + 1} tidak valid. Format: Judul | URL Video | URL Thumbnail | Kategori` },
          { status: 400 }
        );
      }
      const [title, videoUrl, thumbnailUrl, category] = parts;
      if (!title || !videoUrl) {
        return NextResponse.json(
          { error: `Baris ${i + 1}: Judul dan URL Video wajib diisi.` },
          { status: 400 }
        );
      }
      newVideos.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        videoUrl,
        thumbnailUrl: thumbnailUrl || '',
        category: category || 'Umum'
      });
    }

    const { content, sha } = await getFile();
    let existing = [];
    try {
      existing = JSON.parse(content);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    const merged = [...existing, ...newVideos];

    await putFile(
      JSON.stringify(merged, null, 2),
      sha,
      `chore(data): import ${newVideos.length} video via admin`
    );

    return NextResponse.json({ ok: true, added: newVideos.length, total: merged.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await request.json();
    const { content, sha } = await getFile();
    let list = JSON.parse(content);
    const before = list.length;
    list = list.filter((v) => v.id !== id);
    if (list.length === before) {
      return NextResponse.json({ error: 'Video tidak ditemukan' }, { status: 404 });
    }
    await putFile(JSON.stringify(list, null, 2), sha, `chore(data): hapus video ${id}`);
    return NextResponse.json({ ok: true, total: list.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}