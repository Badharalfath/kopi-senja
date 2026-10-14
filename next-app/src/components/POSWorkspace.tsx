'use client';
import { useState } from 'react';

import { useApp } from '@/lib/context';
import PaymentModal from '@/components/PaymentModal';

export default function POSWorkspace() {
  const { cart, addItem, incItem, decItem, discountPct, applyDiscount, clearDiscount, notes, setNotes, shiftOpen, category, setCategory, menuItems, categories } = useApp();
  const [payOpen, setPayOpen] = useState(false);
  const cat = category;

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const list = cat === 'all' ? menuItems : menuItems.filter(p => p.category === cat);
  const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const disc = Math.round(sub * discountPct / 100);
  const total = sub - disc;
  const count = cart.reduce((s, c) => s + c.qty, 0);

  const openPay = () => {
    if (cart.length === 0) { alert('Cart is empty. Tap menu items first.'); return; }
    if (!shiftOpen) { alert('Open a shift first from the sidebar.'); return; }
    setPayOpen(true);
  };

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-8 lg:py-10 grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Cashier Workspace</h1>
              <p className="text-sm text-stone-500 mt-1">Menu + cart together - tap items to add.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Filter menu by category">
            <button onClick={() => setCategory('all')} aria-pressed={cat === 'all'}
              className={`px-4 py-2 rounded-full text-xs font-semibold border min-h-[40px] ${cat === 'all' ? 'bg-[#111] text-white border-[#111]' : 'bg-white border-black/10 hover:border-black/30'}`}>
              All ({menuItems.length})
            </button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} aria-pressed={cat === c}
                className={`px-4 py-2 rounded-full text-xs font-semibold border min-h-[40px] capitalize ${cat === c ? 'bg-[#111] text-white border-[#111]' : 'bg-white border-black/10 hover:border-black/30'}`}>
                {c} ({menuItems.filter(p => p.category === c).length})
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {list.map(p => (
              <button key={p.id} onClick={() => addItem(p.id)}
                className="text-left bg-white rounded-2xl p-5 border border-black/[0.06] hover:border-black/25 active:scale-[0.98] transition">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-semibold leading-snug">{p.name}</h3>
                  <span className="font-mono text-[13px] bg-stone-100 px-2 py-0.5 rounded-md whitespace-nowrap">Rp {p.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-stone-400">{p.category} - tap to add</div>
              </button>
            ))}
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 space-y-4">
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6">
            <h3 className="font-semibold text-lg mb-3">Cart ({count})</h3>
            {cart.length === 0 && <p className="text-sm text-stone-400">Empty - tap menu items left.</p>}
            <div className="divide-y divide-black/[0.06] mb-3 max-h-[300px] overflow-y-auto">
              {cart.map(c => (
                <div key={c.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-stone-400 font-mono">{fmt(c.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#F7F6F3] rounded-lg px-1.5 py-0.5 border border-black/[0.06]">
                      <button onClick={() => decItem(c.id)} aria-label={`Decrease ${c.name}`} className="px-1.5 min-w-[32px] min-h-[32px] hover:text-black text-stone-500">-</button>
                      <span className="text-sm w-5 text-center font-mono">{c.qty}</span>
                      <button onClick={() => incItem(c.id)} aria-label={`Increase ${c.name}`} className="px-1.5 min-w-[32px] min-h-[32px] hover:text-black text-stone-500">+</button>
                    </div>
                    <div className="text-sm font-semibold w-[76px] text-right font-mono">{fmt(c.price * c.qty)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <button onClick={() => applyDiscount(10)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border min-h-[36px] ${discountPct === 10 ? 'bg-[#B45309] text-white border-[#B45309]' : 'bg-[#FDE8D0] text-[#B45309] border-transparent'}`}>10%</button>
              <button onClick={() => applyDiscount(20)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border min-h-[36px] ${discountPct === 20 ? 'bg-[#B45309] text-white border-[#B45309]' : 'bg-[#FDE8D0] text-[#B45309] border-transparent'}`}>20%</button>
              <button onClick={clearDiscount} className="px-3 py-1.5 rounded-full bg-stone-100 text-xs min-h-[36px]">Clear</button>
            </div>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes: oat milk / extra hot"
              className="w-full text-sm bg-[#F7F6F3] border border-black/[0.08] rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-[#B45309]/20" />
            <div className="text-sm font-mono space-y-1 mb-4">
              <div className="flex justify-between"><span className="font-sans text-stone-500">Subtotal</span><span>{fmt(sub)}</span></div>
              <div className="flex justify-between"><span className="font-sans text-stone-500">Discount</span><span>{disc > 0 ? '- ' + fmt(disc) : fmt(0)}</span></div>
              <div className="flex justify-between text-lg font-bold"><span className="font-sans font-semibold">Total</span><span>{fmt(total)}</span></div>
            </div>
            <button onClick={openPay} disabled={cart.length === 0}
              className="w-full py-3.5 rounded-full bg-[#111] text-white text-sm font-semibold hover:bg-[#2a2a2a] disabled:opacity-40 active:scale-[0.97] transition min-h-[48px]">
              Pay - {fmt(total)}
            </button>
            {!shiftOpen && <p className="text-xs text-red-600 mt-2">Shift is closed. Open it from the sidebar.</p>}
          </div>
          <a href="/orders" className="block bg-white rounded-3xl border border-black/[0.06] p-6 hover:border-black/25 transition">
            <h4 className="font-semibold mb-1 text-sm">Orders history</h4>
            <p className="text-xs text-stone-500">Moved to sidebar menu with receipts.</p>
            <span className="inline-block mt-2 text-xs font-semibold underline">View orders</span>
          </a>
        </aside>
      </main>
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} />
    </>
  );
}
