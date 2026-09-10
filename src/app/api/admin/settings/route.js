import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'vidnesia_admin';
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const PATH = 'src/data/settings.json';

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
  if (!res.ok) throw new Error('Gagal membaca settings.json');
  const data = await res.json();
  return { sha: data.sha, content: Buffer.from(data.content, 'base64').toString('utf-8') };
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
    const body = await request.json();
    const jsonStr = JSON.stringify(body, null, 2);
    JSON.parse(jsonStr);

    const { sha } = await getFile();
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
          message: 'chore(settings): update via admin',
          content: Buffer.from(jsonStr, 'utf-8').toString('base64'),
          sha,
          branch: BRANCH
        })
      }
    );
    if (!res.ok) throw new Error(await res.text());
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}