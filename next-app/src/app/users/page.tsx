'use client';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';

interface TeamUser {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'cashier';
  active: boolean;
}

export default function TeamPage() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'cashier'>('cashier');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const r = await fetch('/api/users');
    if (r.ok) setUsers((await r.json()).users ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      alert('Isi nama, email valid, dan password minimal 6 karakter.');
      return;
    }
    setBusy(true);
    try {
      const r = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        alert(d.error || 'Gagal menambah user.');
        return;
      }
      setUsers((prev) => [...prev, d.user]);
      setName(''); setEmail(''); setPassword(''); setRole('cashier');
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (u: TeamUser) => {
    const r = await fetch(`/api/users/${u.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !u.active }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      alert(d.error || 'Gagal mengubah status.');
      return;
    }
    setUsers((prev) => prev.map((x) => (x.id === u.id ? d.user : x)));
  };

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-6 lg:px-10 py-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Team</h1>
          <p className="text-sm text-stone-500 mt-1 mb-6">Owner only. Tambah kasir baru, nonaktifkan akun yang tidak dipakai.</p>
          <div className="stagger grid grid-cols-1 sm:grid-cols-2 gap-3">
            {users.map((u) => (
              <div key={u.id} className={`card-hover bg-white rounded-2xl p-5 border ${u.active ? 'border-black/[0.06]' : 'border-black/[0.06] opacity-60'}`}>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-semibold leading-snug">{u.name}</h3>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full ${u.role === 'owner' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'}`}>
                    {u.role}
                  </span>
                </div>
                <div className="font-mono text-xs text-stone-400 mb-3">{u.email}</div>
                <button onClick={() => toggle(u)}
                  className={`btn-press px-3 py-2 rounded-full text-xs font-semibold min-h-[40px] ${u.active ? 'bg-stone-100 hover:bg-stone-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}>
                  {u.active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </div>
            ))}
          </div>
        </section>
        <aside className="bg-white rounded-3xl border border-black/[0.06] p-6 lg:sticky lg:top-6">
          <h2 className="font-semibold mb-4">Tambah user</h2>
          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Nama</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Budi"
            className="mt-1 mb-3 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm" />
          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="budi@kopisenja.id" type="email"
            className="mt-1 mb-3 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm" />
          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Password (min 6)</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" type="password"
            className="mt-1 mb-3 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm" />
          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Role</label>
          <div className="grid grid-cols-2 gap-2 mt-1 mb-4">
            {(['cashier', 'owner'] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)} aria-pressed={role === r}
                className={`btn-press py-2.5 rounded-xl text-xs font-semibold border capitalize min-h-[44px] ${role === r ? 'bg-[#111] text-white border-[#111]' : 'bg-white border-black/10'}`}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={submit} disabled={busy}
            className="btn-press w-full py-3 rounded-full bg-[#111] text-white text-sm font-semibold min-h-[44px] disabled:opacity-40">
            {busy ? 'Menyimpan...' : 'Tambah'}
          </button>
        </aside>
      </main>
    </Shell>
  );
}
