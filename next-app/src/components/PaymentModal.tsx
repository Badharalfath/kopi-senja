'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
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
    <svg width="180" height="180" viewBox="0 0 15 15" className="rounded-2xl border border-black/10 bg-white mx-auto" role="img" aria-label="Dummy QRIS code">
      {cells.map((on, i) => (
        <rect key={i} x={i % 15} y={Math.floor(i / 15)} width="1" height="1" fill={on ? '#111' : '#fff'} />
      ))}
    </svg>
  );
}

export default function PaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, discountPct, notes, addOrder, clearCart, setNotes, clearDiscount, shiftOpen } = useApp();
  const [method, setMethod] = useState<'cash' | 'qris' | 'transfer' | 'card'>('cash');
  const [cashGiven, setCashGiven] = useState(0);
  const [doneId, setDoneId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const disc = Math.round(sub * discountPct / 100);
  const total = sub - disc;
  const change = Math.max(0, cashGiven - total);
  const txId = useMemo(() => 'QR' + Date.now().toString().slice(-8), [open]);
  const canPay = cart.length > 0 && shiftOpen && (method !== 'cash' || cashGiven >= total);

  useEffect(() => {
    if (!open) return;
    setDoneId(null);
    setCashGiven(0);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  if (!open) return null;

  const confirm = () => {
    if (cart.length === 0) { alert('Cart is empty.'); return; }
    if (!shiftOpen) { alert('Shift is closed. Open it from the sidebar.'); return; }
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
    setDoneId(id);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => onCloseRef.current(), 1200);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="Payment">
      <button aria-label="Close payment" onClick={onClose} className="absolute inset-0 bg-black/50 modal-overlay" />
      <div className="relative w-full max-w-2xl bg-[#F7F6F3] rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-h-[92dvh] overflow-y-auto modal-panel">
        {doneId ? (
          <div className="text-center py-6">
            <p className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-2">Payment complete</p>
            <h2 className="text-3xl font-semibold mb-2">Order {doneId}</h2>
            <p className="text-sm text-stone-500 mb-6">Paid via {method.toUpperCase()}. Receipt saved.</p>
            <p className="text-xs text-stone-400">Closing automatically...</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Payment</h2>
                <p className="text-sm text-stone-500">Cart loaded: {cart.reduce((s,c)=>s+c.qty,0)} items, total {fmt(total)}</p>
              </div>
              <button onClick={onClose} aria-label="Close" className="w-11 h-11 rounded-full bg-white border border-black/10 text-lg leading-none min-h-[44px] min-w-[44px]">x</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {(['cash','qris','transfer','card'] as const).map(m => (
                <button key={m} onClick={() => setMethod(m)} aria-pressed={method===m}
                  className={`btn-press py-2.5 rounded-xl text-xs font-semibold border min-h-[44px] ${method===m ? 'bg-[#111] text-white border-[#111]' : 'bg-white border-black/10 hover:border-black/30'}`}>
                  {m === 'cash' ? 'Cash' : m === 'qris' ? 'QRIS' : m === 'transfer' ? 'Transfer' : 'Card'}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-4">
              <div className="divide-y divide-black/[0.06] max-h-[160px] overflow-y-auto mb-3">
                {cart.map(c => (
                  <div key={c.id} className="flex justify-between py-1.5 text-sm">
                    <span>{c.name} <span className="text-stone-400 font-mono">x{c.qty}</span></span>
                    <span className="font-mono font-medium">{fmt(c.price * c.qty)}</span>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-sm text-stone-400 py-2">Cart empty.</p>}
              </div>
              <div className="text-sm space-y-1 font-mono">
                <div className="flex justify-between"><span className="font-sans text-stone-500">Subtotal</span><span>{fmt(sub)}</span></div>
                <div className="flex justify-between"><span className="font-sans text-stone-500">Discount</span><span>{disc > 0 ? '- ' + fmt(disc) : fmt(0)}</span></div>
                <div className="flex justify-between text-lg font-bold"><span className="font-sans font-semibold">Total</span><span>{fmt(total)}</span></div>
              </div>
            </div>

            {method === 'cash' && (
              <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-4">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Cash given</label>
                <input type="number" autoFocus value={cashGiven || ''} onChange={e => setCashGiven(Number(e.target.value) || 0)}
                  placeholder="e.g. 50000" className="mt-1 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 font-mono" />
                <div className="flex justify-between text-sm mt-2"><span className="text-stone-500">Change</span><span className="font-mono font-semibold">{fmt(change)}</span></div>
              </div>
            )}

            {method === 'qris' && (
              <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">Dummy QRIS, not live</p>
                <DummyQR seed={txId + total} />
                <p className="font-mono text-xs text-stone-500 mt-2">KOPI SENJA - {txId}</p>
                <p className="font-mono text-xl font-bold">{fmt(total)}</p>
              </div>
            )}

            <button onClick={confirm} disabled={!canPay}
              className="btn-press w-full py-3.5 rounded-full text-sm font-semibold min-h-[48px] bg-[#111] text-white hover:bg-[#2a2a2a] disabled:opacity-40">
              {method === 'qris' ? `Confirm QRIS Paid - ${fmt(total)}` : `Confirm - ${fmt(total)}`}
            </button>
            {!shiftOpen && <p className="text-xs text-stone-500 mt-2">Shift is closed. Open it from the sidebar below.</p>}
            <p className="text-[11px] text-stone-400 mt-2 text-center">Full pages still at <Link href="/payment" className="underline">/payment</Link> and <Link href="/payment/qris" className="underline">/payment/qris</Link>.</p>
          </>
        )}
      </div>
    </div>
  );
}
