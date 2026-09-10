'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminClient() {
  const [tab, setTab] = useState('import');
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent text-bg font-extrabold flex items-center justify-center">
              V
            </div>
            <span className="font-extrabold">Admin <span className="text-accent">Vidnesia</span></span>
          </div>
          <button
            onClick={logout}
            className="text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-2 rounded-lg btn-tap"
          >
            Logout
          </button>
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-2 flex gap-2">
          <TabBtn active={tab === 'import'} onClick={() => setTab('import')}>
            📥 Import Video
          </TabBtn>
          <TabBtn active={tab === 'manage'} onClick={() => setTab('manage')}>
            📋 Kelola
          </TabBtn>
          <TabBtn active={tab === 'ads'} onClick={() => setTab('ads')}>
            📢 Iklan
          </TabBtn>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {tab === 'import' && <ImportTab />}
        {tab === 'manage' && <ManageTab />}
        {tab === 'ads' && <AdsTab />}
      </main>
    </div>
  );
}

function TabBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors btn-tap ${
        active ? 'bg-accent text-bg' : 'bg-card text-muted hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function ImportTab() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const preview = lines.slice(0, 5).map((raw, i) => {
    const parts = raw.split('|').map((s) => s.trim());
    const valid = parts.length >= 4 && parts[0] && parts[1];
    return { raw, valid, parts, i };
  });

  const submit = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal import');
      setMsg({ type: 'ok', text: `✅ Berhasil menambahkan ${data.added} video. Total: ${data.total}` });
      setText('');
    } catch (e) {
      setMsg({ type: 'err', text: `❌ ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-white/5 rounded-2xl p-4">
        <h2 className="font-bold mb-2">📥 Batch Import Video</h2>
        <p className="text-xs text-muted mb-3 leading-relaxed">
          Paste banyak baris sekaligus. Format per baris:<br />
          <code className="bg-bg px-2 py-1 rounded text-accent text-[11px]">
            Judul | URL Video | URL Thumbnail | Kategori
          </code>
          <br />
          Data akan <b>ditambahkan</b> (append), bukan menimpa.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder={`Judul Video 1 | https://doodstream.com/e/xxx | https://img.com/1.jpg | Action\nJudul Video 2 | https://doodstream.com/e/yyy | https://img.com/2.jpg | Drama`}
          className="w-full bg-bg border border-white/10 rounded-xl px-3 py-3 text-sm outline-none focus:border-accent transition-colors font-mono resize-y"
        />

        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="text-muted">Total baris: <b className="text-white">{lines.length}</b></span>
          <span className="text-muted">Valid: <b className="text-accent">{preview.filter((p) => p.valid).length}/{preview.length}</b></span>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="bg-card border border-white/5 rounded-2xl p-4">
          <h3 className="font-bold text-sm mb-2">Preview (5 baris pertama)</h3>
          <div className="space-y-2">
            {preview.map((p, i) => (
              <div
                key={i}
                className={`text-xs p-2 rounded-lg border ${
                  p.valid ? 'border-accent/30 bg-accent/5' : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div className={p.valid ? 'text-accent' : 'text-red-400'}>
                  {p.valid ? '✓' : '✗'} Baris {i + 1}
                </div>
                {p.valid ? (
                  <div className="text-muted mt-1 break-all">
                    <b className="text-white">{p.parts[0]}</b> • {p.parts[3] || 'Umum'}
                  </div>
                ) : (
                  <div className="text-red-400 mt-1">Format tidak lengkap (butuh 4 bagian dengan | )</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {msg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            msg.type === 'ok'
              ? 'bg-accent/10 border border-accent/30 text-accent'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {msg.text}
        </div>
      )}

      <button
        onClick={submit}
        disabled={loading || lines.length === 0}
        className="w-full bg-accent text-bg font-bold py-4 rounded-xl btn-tap disabled:opacity-40 sticky bottom-4 shadow-lg shadow-accent/20"
      >
        {loading ? 'Mengunggah ke GitHub...' : `Import ${lines.length} Video`}
      </button>
    </div>
  );
}

function ManageTab() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/videos', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setVideos(data.data || []);
      else setMsg({ type: 'err', text: data.error });
    } catch (e) {
      setMsg({ type: 'err', text: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Hapus video ini?')) return;
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'ok', text: `✅ Video dihapus. Sisa: ${data.total}` });
      setVideos((v) => v.filter((x) => x.id !== id));
    } catch (e) {
      setMsg({ type: 'err', text: e.message });
    }
  };

  const filtered = q
    ? videos.filter((v) => v.title?.toLowerCase().includes(q.toLowerCase()))
    : videos;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-white/5 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">📋 Kelola Video</h2>
          <button onClick={load} className="text-xs text-accent font-semibold">
            ↻ Refresh
          </button>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari judul..."
          className="w-full bg-bg border border-white/10 rounded-xl px-3 py-3 text-sm outline-none focus:border-accent"
        />
        <p className="text-xs text-muted mt-2">
          Total: <b className="text-white">{videos.length}</b> video
        </p>
      </div>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm ${msg.type === 'ok' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'}`}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div className="text-center text-muted py-10">Memuat...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted py-10">Tidak ada video.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((v) => (
            <div key={v.id} className="bg-card border border-white/5 rounded-xl p-3 flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.thumbnailUrl || '/fallback-thumb.jpg'}
                alt=""
                className="w-20 h-12 object-cover rounded-md bg-bg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold line-clamp-2">{v.title}</div>
                <div className="text-[10px] text-accent mt-1">{v.category || 'Umum'}</div>
              </div>
              <button
                onClick={() => remove(v.id)}
                className="self-center text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg btn-tap"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdsTab() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok) setSettings(data.data);
        else setMsg({ type: 'err', text: data.error });
      } catch (e) {
        setMsg({ type: 'err', text: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (path, value) => {
    setSettings((prev) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = obj[keys[i]] || {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const jsonStr = JSON.stringify(settings);
      JSON.parse(jsonStr);

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: 'ok', text: '✅ Pengaturan tersimpan. Vercel akan rebuild otomatis.' });
    } catch (e) {
      setMsg({ type: 'err', text: `❌ ${e.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center text-muted py-10">Memuat pengaturan...</div>;
  if (!settings) return <div className="text-center text-red-400 py-10">Gagal memuat</div>;

  return (
    <div className="space-y-4">
      <Section title="📢 Adsterra Ads">
        <Field label="Head Pop-up Script (beforeInteractive)" value={settings.ads?.headPopup || ''} onChange={(v) => update('ads.headPopup', v)} rows={4} />
        <Field label="Header Banner HTML" value={settings.ads?.headerBanner || ''} onChange={(v) => update('ads.headerBanner', v)} rows={4} />
        <Field label="In-Feed Banner HTML (setelah video ke-4)" value={settings.ads?.inFeedBanner || ''} onChange={(v) => update('ads.inFeedBanner', v)} rows={4} />
        <Field label="Footer Banner HTML" value={settings.ads?.footerBanner || ''} onChange={(v) => update('ads.footerBanner', v)} rows={4} />
      </Section>

      <Section title="📊 Analytics">
        <Field label="Histats Script" value={settings.analytics?.histats || ''} onChange={(v) => update('analytics.histats', v)} rows={4} />
        <Field label="Google Analytics Measurement ID (G-XXXXXXX)" value={settings.analytics?.googleAnalytics || ''} onChange={(v) => update('analytics.googleAnalytics', v)} rows={2} />
      </Section>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm ${msg.type === 'ok' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'}`}>
          {msg.text}
        </div>
      )}

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-accent text-bg font-bold py-4 rounded-xl btn-tap disabled:opacity-50 sticky bottom-4 shadow-lg shadow-accent/20"
      >
        {saving ? 'Menyimpan...' : '💾 Simpan Pengaturan'}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-card border border-white/5 rounded-2xl p-4 space-y-3">
      <h2 className="font-bold">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1 font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-bg border border-white/10 rounded-xl px-3 py-3 text-xs outline-none focus:border-accent font-mono resize-y"
      />
    </div>
  );
}