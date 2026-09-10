'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/admin';

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Login gagal');
      }
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card rounded-2xl border border-white/5 p-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent text-bg font-extrabold text-2xl flex items-center justify-center mx-auto mb-3">
            V
          </div>
          <h1 className="text-xl font-extrabold">Admin Vidnesia</h1>
          <p className="text-sm text-muted mt-1">Masukkan password untuk lanjut</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password admin"
            autoFocus
            className="w-full bg-bg border border-white/10 rounded-xl px-4 py-4 text-base outline-none focus:border-accent transition-colors"
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-accent text-bg font-bold py-4 rounded-xl btn-tap disabled:opacity-50"
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}