'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Shell from '@/components/Shell';
import { useApp } from '@/lib/context';

const METHODS = [
  { id: 'cash', label: 'Cash', desc: 'Tender + change calc' },
  { id: 'qris', label: 'QRIS', desc: 'Dummy QR, scan to pay' },
  { id: 'transfer', label: 'Transfer', desc: 'Bank transfer proof' },
  { id: 'card', label: 'Card', desc: 'Debit / credit EDC' },
] as const;

export default function PaymentPage() {
  const router = useRouter();
  const { cart, discountPct, applyDiscount, clearDiscount, notes, setNotes, addOrder, clearCart, shiftOpen } = useApp();
  const [method, setMethod] = useState<'cash' | 'qris' | 'transfer' | 'card'>('cash');
  const [cashGiven, setCashGiven] = useState(0);
  const [done, setDone] = useState<string | null>(null);

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const disc = Math.round(sub * discountPct / 100);
  const total = sub - disc;
  const change = Math.max(0, cashGiven - total);
  const canPay = cart.length > 0 && shiftOpen && (method !== 'cash' || cashGiven >= total);

  const confirm = () => {
    if (cart.length === 0) { alert('Cart is empty. Add items in workspace.'); return; }
    if (!shiftOpen) { alert('Open a shift first.'); return; }
    if (method === 'qris') { router.push('/payment/qris'); return; }
    if (method === 'cash' && cashGiven < total) { alert('Cash given is less than total.'); return; }
    const id = 'S-' + Date.now().toString().slice(-6);
    addOrder({
      id,
      items: cart.map(c => ({ ...c })),
      subtotal: sub,
      discount: disc,
      total,
      method,
      notes: notes || undefined,
      time: new Date().toLocaleString('id-ID'),
      ...(method === 'cash' ? { cashGiven, change } : {}),
    });
    clearCart(); setCashGiven(0); setNotes(''); clearDiscount();
    setDone(id);
  };

  if (done) {
    return (
      <Shell>
        <main className="mx-auto max-w-2xl px-6 py-12 text-center">
          <p className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-2">Payment complete</p>
          <h1 className="text-3xl font-semibold mb-2">Order {done}</h1>
          <p className="text-stone-500 mb-6">Receipt saved. Back to workspace for next customer.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="bg-[#111] text-white px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">New Order</Link>
            <Link href="/dashboard/cashier" className="bg-white border border-black/10 px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">View Dashboard</Link>
          </div>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="mx-auto max-w-5xl px-6 lg:px-10 py-8 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Payment Method</h1>
          <p className="text-sm text-stone-500 mt-1 mb-6">Pick how the customer pays. QRIS opens the dummy QR screen.</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} aria-pressed={method===m.id}
                className={`text-left p-5 rounded-2xl border min-h-[44px] ${method===m.id ? 'bg-[#111] text-white border-[#111]' : 'bg-white border-black/[0.06] hover:border-black/25'}`}>
                <div className="font-semibold">{m.label}</div>
                <div className={`text-xs mt-1 ${method===m.id ? 'text-stone-300' : 'text-stone-500'}`}>{m.desc}</div>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Order notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Oat milk, extra hot, less sugar"
              className="mt-2 w-full text-sm bg-[#F7F6F3] border border-black/[0.08] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B45309]/20" />
            <div className="flex gap-2 mt-3">
              <button onClick={() => applyDiscount(10)} className="px-3 py-1.5 rounded-full bg-[#FDE8D0] text-[#B45309] text-xs font-semibold">10% off</button>
              <button onClick={() => applyDiscount(20)} className="px-3 py-1.5 rounded-full bg-[#FDE8D0] text-[#B45309] text-xs font-semibold">20% off</button>
              <button onClick={clearDiscount} className="px-3 py-1.5 rounded-full bg-stone-100 text-xs">Clear</button>
            </div>
          </div>
        </section>

        <aside className="bg-white rounded-3xl border border-black/[0.06] p-6 lg:sticky lg:top-6">
          <h2 className="font-semibold text-lg mb-4">Summary ({cart.reduce((s,c)=>s+c.qty,0)} items)</h2>
          {cart.length === 0 && <p className="text-sm text-stone-400 mb-4">Empty. <Link href="/" className="underline">Add from workspace</Link>.</p>}
          <div className="divide-y divide-black/[0.06] mb-4 max-h-[220px] overflow-y-auto">
            {cart.map(c => (
              <div key={c.id} className="flex justify-between py-2 text-sm">
                <span>{c.name} <span className="text-stone-400 font-mono">x{c.qty}</span></span>
                <span className="font-mono font-medium">{fmt(c.price*c.qty)}</span>
              </div>
            ))}
          </div>
          <div className="text-sm space-y-1 mb-4 font-mono">
            <div className="flex justify-between"><span className="text-stone-500 font-sans">Subtotal</span><span>{fmt(sub)}</span></div>
            <div className="flex justify-between"><span className="text-stone-500 font-sans">Discount</span><span>{disc>0 ? '- '+fmt(disc) : fmt(0)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-1"><span className="font-sans font-semibold">Total</span><span>{fmt(total)}</span></div>
          </div>
          {method === 'cash' && (
            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Cash given</label>
              <input type="number" value={cashGiven||''} onChange={e=>setCashGiven(Number(e.target.value)||0)}
                placeholder="e.g. 50000" className="mt-1 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 font-mono text-sm" />
              <div className="flex justify-between text-sm mt-2"><span className="text-stone-500">Change</span><span className="font-mono font-semibold">{fmt(change)}</span></div>
            </div>
          )}
          {method === 'qris' && (
            <p className="text-xs text-stone-500 mb-4">You will see a dummy QR on the next screen. No real money moves.</p>
          )}
          <button onClick={confirm} disabled={!canPay}
            className="w-full py-3 rounded-full text-sm font-semibold min-h-[44px] bg-[#111] text-white hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition">
            {method === 'qris' ? 'Show QRIS Code' : `Confirm - ${fmt(total)}`}
          </button>
          {!shiftOpen && <p className="text-xs text-red-600 mt-2">Shift is closed. Open it from the sidebar.</p>}
        </aside>
      </main>
    </Shell>
  );
}
