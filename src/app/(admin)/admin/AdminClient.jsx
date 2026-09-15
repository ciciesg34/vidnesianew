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
        <Field
          label="Head Pop-up Script (muncul di <head>)"
          value={settings.ads?.headPopup || ''}
          onChange={(v) => update('ads.headPopup', v)}
          rows={4}
        />
        <Field
          label="Header Banner HTML"
          value={settings.ads?.headerBanner || ''}
          onChange={(v) => update('ads.headerBanner', v)}
          rows={4}
        />
        <Field
          label="In-Feed Banner HTML (setelah video ke-4)"
          value={settings.ads?.inFeedBanner || ''}
          onChange={(v) => update('ads.inFeedBanner', v)}
          rows={4}
        />
        <Field
          label="Footer Banner HTML"
          value={settings.ads?.footerBanner || ''}
          onChange={(v) => update('ads.footerBanner', v)}
          rows={4}
        />
        <Field
          label="⭐ Social Bar Script (TIDAK tampil di admin & detail video)"
          value={settings.ads?.socialBar || ''}
          onChange={(v) => update('ads.socialBar', v)}
          rows={5}
        />
      </Section>

      <Section title="📊 Analytics">
        <Field
          label="Histats Script"
          value={settings.analytics?.histats || ''}
          onChange={(v) => update('analytics.histats', v)}
          rows={4}
        />
        <Field
          label="Google Analytics Measurement ID (G-XXXXXXX)"
          value={settings.analytics?.googleAnalytics || ''}
          onChange={(v) => update('analytics.googleAnalytics', v)}
          rows={2}
        />
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