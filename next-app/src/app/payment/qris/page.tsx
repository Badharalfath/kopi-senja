'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Shell from '@/components/Shell';
import { useApp } from '@/lib/context';

function DummyQR({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 997;
    const grid: boolean[] = [];
    for (let i = 0; i < 225; i++) {
      h = (h * 1103515245 + 12345) % 2147483648;
      grid.push(h % 3 !== 0);
    }
    return grid;
  }, [seed]);
  return (
    <svg width="220" height="220" viewBox="0 0 15 15" className="rounded-2xl border border-black/10 bg-white" role="img" aria-label="Dummy QRIS code">
      {cells.map((on, i) => (
        <rect key={i} x={i % 15} y={Math.floor(i / 15)} width="1" height="1" fill={on ? '#111' : '#fff'} />
      ))}
    </svg>
  );
}

export default function QRISPage() {
  const router = useRouter();
  const { cart, discountPct, notes, addOrder, clearCart, setNotes, clearDiscount } = useApp();
  const [seconds, setSeconds] = useState(300);
  const [paid, setPaid] = useState<string | null>(null);

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const disc = Math.round(sub * discountPct / 100);
  const total = sub - disc;
  const txId = useMemo(() => 'QR' + Date.now().toString().slice(-8), []);

  useEffect(() => {
    if (paid) return;
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [paid]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');

  const simulatePaid = async () => {
    if (cart.length === 0) { alert('Cart is empty.'); return; }
    try {
      const order = await addOrder({
        items: cart.map(c => ({ ...c })),
        method: 'qris',
        notes: notes || undefined,
      });
      clearCart(); setNotes(''); clearDiscount();
      setPaid(order.id);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal menyimpan order.');
    }
  };

  if (paid) {
    return (
      <Shell>
        <main className="mx-auto max-w-2xl px-6 py-12 text-center">
          <p className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-2">QRIS paid (simulated)</p>
          <h1 className="text-3xl font-semibold mb-2">Order {paid}</h1>
          <p className="text-stone-500 mb-6">Dummy QR confirmed. No real charge made.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="bg-[#111] text-white px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">New Order</Link>
            <Link href="/dashboard/cashier" className="bg-white border border-black/10 px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">Dashboard</Link>
          </div>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="mx-auto max-w-4xl px-6 lg:px-10 py-8 grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <section className="text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">QRIS - dummy, not live</p>
          <h1 className="text-3xl font-semibold tracking-tight mt-1">Scan to Pay</h1>
          <p className="text-sm text-stone-500 mt-1 mb-6">Show this to the customer. Timer expires in <span className="font-mono font-semibold text-black">{mm}:{ss}</span>.</p>
          <div className="inline-block bg-white p-5 rounded-3xl border border-black/[0.06]">
            <DummyQR seed={txId + total} />
            <p className="font-mono text-xs text-stone-500 mt-3">KOPI SENJA - {txId}</p>
            <p className="font-mono text-2xl font-semibold mt-1">{fmt(total)}</p>
          </div>
          <p className="text-xs text-stone-400 mt-4">Prototype QR. Any scanner will read it as text, no payment gateway attached.</p>
        </section>
        <aside className="bg-white rounded-3xl border border-black/[0.06] p-6 md:sticky md:top-6">
          <h2 className="font-semibold mb-3">Order summary</h2>
          {cart.length === 0 && <p className="text-sm text-stone-400 mb-4">Empty. <Link href="/" className="underline">Add items</Link>.</p>}
          <div className="text-sm space-y-1 mb-4 font-mono">
            <div className="flex justify-between"><span className="font-sans text-stone-500">Items</span><span>{cart.reduce((s,c)=>s+c.qty,0)}</span></div>
            <div className="flex justify-between"><span className="font-sans text-stone-500">Total</span><span className="font-bold">{fmt(total)}</span></div>
            <div className="flex justify-between"><span className="font-sans text-stone-500">TX</span><span className="text-xs">{txId}</span></div>
          </div>
          <button onClick={simulatePaid} disabled={cart.length===0}
            className="w-full py-3 rounded-full bg-[#B45309] text-white text-sm font-semibold hover:bg-[#92400D] disabled:opacity-40 min-h-[44px] active:scale-[0.97] transition">
            Simulate Customer Paid
          </button>
          <button onClick={() => router.push('/payment')}
            className="w-full py-3 mt-2 rounded-full bg-stone-100 text-sm font-semibold min-h-[44px]">
            Back to Methods
          </button>
        </aside>
      </main>
    </Shell>
  );
}
