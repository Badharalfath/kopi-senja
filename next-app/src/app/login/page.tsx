'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login gagal.');
        return;
      }
      router.push(data.user.role === 'owner' ? '/dashboard' : '/');
      router.refresh();
    } catch {
      setError('Tidak bisa menghubungi server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-6 bg-[#F7F6F3]">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Kopi Senja</h1>
          <p className="text-sm text-stone-500 mt-2">Masuk untuk mulai shift kasir.</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-3xl border border-black/[0.06] p-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Email</label>
            <input id="email" type="email" autoComplete="username" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="kasir@kopisenja.id"
              className="mt-1 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B45309]/20" />
          </div>
          <div>
            <label htmlFor="password" className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Password</label>
            <input id="password" type="password" autoComplete="current-password" required value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••"
              className="mt-1 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B45309]/20" />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy}
            className="btn-press w-full py-3 rounded-full bg-[#111] text-white text-sm font-semibold min-h-[48px] disabled:opacity-40">
            {busy ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
        <div className="mt-4 bg-white rounded-2xl border border-black/[0.06] p-4 text-xs text-stone-500 leading-relaxed">
          <p className="font-semibold text-stone-700 mb-1">Demo</p>
          <p className="font-mono">owner@kopisenja.id / owner123</p>
          <p className="font-mono">kasir@kopisenja.id / kasir123</p>
        </div>
      </div>
    </main>
  );
}
