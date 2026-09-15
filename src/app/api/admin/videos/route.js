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

// Extract kode dari URL video
function extractCode(url) {
  if (!url) return '';
  try {
    const cleaned = url.split('?')[0].split('#')[0];
    const parts = cleaned.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    return last.replace(/\.[^.]*$/, '').toLowerCase();
  } catch {
    return '';
  }
}

// Slugify kategori
function slugifyCategory(cat) {
  return (cat || 'umum')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'umum';
}

// Bersihkan judul dari simbol
function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/[▶►●•·◆★☆✓✔]/g, '')
    .replace(/\.(mp4|mkv|avi|mov|webm|flv|wmv|m4v)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate ID: [kategori]-[kodeURL]
function generateId(category, videoUrl, existingIds = []) {
  const cat = slugifyCategory(category);
  const code = extractCode(videoUrl);
  
  let base;
  if (code) {
    base = `${cat}-${code}`;
  } else {
    base = `${cat}-${Date.now().toString(36)}`;
  }
  
  // Cek duplikat
  let finalId = base;
  let counter = 2;
  while (existingIds.includes(finalId)) {
    finalId = `${base}-${counter}`;
    counter++;
  }
  
  return finalId;
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

    // Ambil data existing dulu
    const { content, sha } = await getFile();
    let existing = [];
    try {
      existing = JSON.parse(content);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    const existingIds = existing.map((v) => v.id);

    const newVideos = [];
    for (let i = 0; i < lines.length; i++) {
      const raw = (lines[i] || '').trim();
      if (!raw) continue;

      const parts = raw.split('|').map((s) => s.trim());

      // Support 3 format:
      // 1. [Judul] | URL | Thumb | Kategori | EmbedURL
      // 2. | URL | Thumb | Kategori | EmbedURL
      // 3. [Judul] | URL | Thumb | Kategori
      
      let title = '', videoUrl = '', thumbnailUrl = '', category = '', embedUrl = '';

      if (parts.length >= 5) {
        [title, videoUrl, thumbnailUrl, category, embedUrl] = parts;
      } else if (parts.length === 4) {
        [title, videoUrl, thumbnailUrl, category] = parts;
      } else if (parts.length === 3) {
        [videoUrl, thumbnailUrl, category] = parts;
      } else {
        return NextResponse.json(
          { error: `Baris ${i + 1} tidak valid. Format: Judul | URL | Thumb | Kategori | EmbedURL` },
          { status: 400 }
        );
      }

      if (!videoUrl) {
        return NextResponse.json(
          { error: `Baris ${i + 1}: URL Video wajib diisi.` },
          { status: 400 }
        );
      }

      // Bersihkan judul
      title = cleanTitle(title);

      // Auto-generate ID dari kategori + kode URL
      const id = generateId(category || 'Umum', videoUrl, [...existingIds, ...newVideos.map((v) => v.id)]);

      newVideos.push({
        id,
        title: title || '', // Boleh kosong
        videoUrl,
        embedUrl: embedUrl || videoUrl,
        thumbnailUrl: thumbnailUrl || '',
        category: category || 'Umum'
      });
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