'use client';
import { useState } from 'react';
import Shell from '@/components/Shell';
import { useApp } from '@/lib/context';
import type { Order } from '@/lib/data';
import EmptyState from '@/components/EmptyState';

function Receipt({ o }: { o: Order }) {
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  return (
    <div className="bg-white rounded-3xl border border-black/[0.06] p-8 max-w-[380px] mx-auto">
      <div className="text-center mb-5">
        <h3 className="text-2xl font-bold tracking-tight">Kopi Senja</h3>
        <p className="text-[11px] text-stone-400 mt-1">Jl. Senja No. 12, Bandung</p>
        <div className="w-10 h-px bg-stone-300 mx-auto my-3" />
        <p className="font-mono text-[11px] text-stone-500">{o.time}</p>
        <p className="font-mono text-xs font-semibold mt-1">Order {o.id}</p>
      </div>
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-stone-400 border-b border-black/10">
            <th className="text-left py-1 font-medium">Item</th>
            <th className="text-right font-medium">Qty</th>
            <th className="text-right font-medium">Sub</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {o.items.map(i => (
            <tr key={i.id}>
              <td className="py-1.5 pr-2">{i.name}<div className="font-mono text-[11px] text-stone-400">{fmt(i.price)}</div></td>
              <td className="py-1.5 text-right font-mono">{i.qty}</td>
              <td className="py-1.5 text-right font-mono font-medium">{fmt(i.price * i.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t-2 border-dashed border-black/15 pt-3 text-sm font-mono space-y-1">
        <div className="flex justify-between"><span className="font-sans text-stone-500">Subtotal</span><span>{fmt(o.subtotal)}</span></div>
        {o.discount > 0 && <div className="flex justify-between"><span className="font-sans text-stone-500">Discount</span><span>- {fmt(o.discount)}</span></div>}
        <div className="flex justify-between text-base font-bold"><span className="font-sans">Total</span><span>{fmt(o.total)}</span></div>
        {o.method === 'cash' && typeof o.cashGiven === 'number' && (
          <>
            <div className="flex justify-between"><span className="font-sans text-stone-500">Tendered</span><span>{fmt(o.cashGiven)}</span></div>
            <div className="flex justify-between font-bold"><span className="font-sans">Change</span><span>{fmt(typeof o.change === 'number' ? o.change : Math.max(0, o.cashGiven - o.total))}</span></div>
          </>
        )}
        <div className="flex justify-between"><span className="font-sans text-stone-500">Method</span><span className="uppercase text-xs font-semibold">{o.method}</span></div>
        {o.notes && <div className="pt-1"><span className="font-sans text-stone-500 text-xs">Notes: </span><span className="font-sans text-xs">{o.notes}</span></div>}
      </div>
      <p className="text-center text-[11px] text-stone-400 mt-5">Thank you, come again</p>
      <button onClick={() => window.print()} className="mt-4 w-full py-2.5 rounded-full bg-stone-100 text-xs font-semibold min-h-[44px] print:hidden">Print Receipt</button>
    </div>
  );
}

export default function OrdersPage() {
  const { orders } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const selected = orders.find(o => o.id === sel) || orders[0];

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-6 lg:px-10 py-8 grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Orders History</h1>
          <p className="text-sm text-stone-500 mt-1 mb-6">{orders.length} orders this session. Select one to see its receipt.</p>
          {orders.length === 0 && (
            <EmptyState
              title="No orders yet"
              desc="Complete a payment in the cashier workspace and the order will appear here with its receipt."
              actionHref="/"
              actionLabel="Go to workspace"
            />
          )}
          <div className="space-y-2">
            {orders.map(o => (
              <button key={o.id} onClick={() => setSel(o.id)} aria-pressed={selected?.id === o.id}
                className={`w-full text-left bg-white rounded-2xl p-4 border min-h-[44px] flex items-center justify-between gap-3 ${selected?.id === o.id ? 'border-[#111] ring-1 ring-[#111]' : 'border-black/[0.06] hover:border-black/25'}`}>
                <div>
                  <div className="font-mono text-xs text-stone-400">{o.id} - {o.time}</div>
                  <div className="text-sm font-medium mt-0.5">{o.items.reduce((s, i) => s + i.qty, 0)} items - {o.items.map(i => i.name).slice(0, 3).join(', ')}{o.items.length > 3 ? '...' : ''}</div>
                  <div className="text-[11px] uppercase tracking-wide text-stone-400 mt-0.5">{o.method}{o.discount > 0 ? ' - discount ' + fmt(o.discount) : ''}</div>
                </div>
                <div className="font-mono font-semibold whitespace-nowrap">{fmt(o.total)}</div>
              </button>
            ))}
          </div>
        </section>
        <aside className="lg:sticky lg:top-6">
          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-3">Receipt preview</p>
          {selected ? <Receipt o={selected} /> : <p className="text-sm text-stone-400">Select an order.</p>}
        </aside>
      </main>
    </Shell>
  );
}
