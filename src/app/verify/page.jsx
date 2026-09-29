'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();
  const [num1] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const expectedAnswer = num1 + num2;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (parseInt(answer, 10) !== expectedAnswer) {
        setError('❌ Jawaban salah. Coba lagi.');
        setAnswer('');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: parseInt(answer, 10), expected: expectedAnswer })
      });

      if (!res.ok) {
        throw new Error('Verifikasi gagal');
      }

      // Redirect ke homepage
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('❌ Terjadi kesalahan. Coba lagi.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-extrabold text-bg text-lg">
              V
            </div>
            <span className="font-extrabold text-2xl tracking-tight">
              Vid<span className="text-accent">nesia</span>
            </span>
          </div>
        </div>

        {/* Card Captcha */}
        <div className="bg-card rounded-2xl border border-white/5 p-6">
          <div className="text-center mb-5">
            <div className="text-4xl mb-2">🛡️</div>
            <h1 className="text-lg font-extrabold mb-1">
              Verifikasi Keamanan
            </h1>
          </div>

          {/* Note / Keterangan */}
          <div className="bg-bg/50 border border-white/5 rounded-xl p-4 mb-5 space-y-2">
            <p className="text-xs text-muted leading-relaxed">
              Halaman ini dilindungi untuk mencegah <b className="text-white">bot otomatis</b> dan <b className="text-white">spam</b>.
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Dengan mengisi captcha, Anda membantu kami menjaga kualitas layanan <b className="text-accent">Vidnesia</b> agar tetap nyaman untuk semua pengunjung.
            </p>
            <p className="text-xs text-muted leading-relaxed">
              ⏱️ Kunjungan Anda akan diingat selama <b className="text-white">24 jam</b>, jadi Anda tidak perlu mengisi captcha lagi.
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Terima kasih atas pengertiannya! 🙏
            </p>
          </div>

          {/* Form Captcha */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-white">
                Berapa hasil dari:
              </label>
              <div className="bg-bg rounded-xl p-4 text-center mb-3 border border-white/10">
                <span className="text-2xl font-extrabold text-accent">
                  {num1} + {num2} = ?
                </span>
              </div>
              <input
                type="number"
                inputMode="numeric"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Masukkan jawaban"
                autoFocus
                required
                className="w-full bg-bg border border-white/10 rounded-xl px-4 py-4 text-base text-center font-bold outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !answer}
              className="w-full bg-accent text-bg font-bold py-4 rounded-xl btn-tap disabled:opacity-50"
            >
              {loading ? 'Memverifikasi...' : '✓ Masuk ke Vidnesia'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-6">
          © {new Date().getFullYear()} Vidnesia. Semua video adalah milik pemiliknya masing-masing.
        </p>
      </div>
    </main>
  );
}