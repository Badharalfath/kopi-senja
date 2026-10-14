'use client';
import { useState } from 'react';
import { products } from '@/lib/data';
import { useApp } from '@/lib/context';

export default function POSWorkspace() {
  const { cart, addItem, incItem, decItem, discountPct, applyDiscount, clearDiscount, notes, setNotes, orders, addOrder, clearCart, shiftOpen, category } = useApp();
  const cat = category;
  const [method, setMethod] = useState<'cash' | 'qris' | 'transfer' | 'card'>('cash');
  const [cashGiven, setCashGiven] = useState(0);

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const list = cat === 'all' ? products : products.filter(p => p.category === cat);
  const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const disc = Math.round(sub * discountPct / 100);
  const total = sub - disc;
  const change = Math.max(0, cashGiven - total);

  const confirmOrder = () => {
    if (cart.length === 0) { alert('Select at least one item.'); return; }
    if (!shiftOpen) { alert('Open a shift first (header button).'); return; }
    addOrder({
      id: 'S-' + Date.now().toString().slice(-6),
      items: cart.map(c => ({ ...c })),
      subtotal: sub,
      discount: disc,
      total,
      method,
      notes: notes || undefined,
      time: new Date().toLocaleString('id-ID'),
    });
    setCashGiven(0);
    clearCart();
    setNotes('');
    clearDiscount();
  };

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 py-8 lg:py-10 grid lg:grid-cols-[1fr_400px] gap-8 items-start">
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Cashier Workspace</h1>
            <p className="text-sm text-stone-500 mt-1">Menu + cart together - tap items to add.</p>
          </div>
          <p className="hidden lg:block text-xs text-stone-400">Filter via sidebar categories - keeps grid scannable with 30+ items.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map(p => (
            <button key={p.id} onClick={() => addItem(p.id)}
              className="text-left bg-white rounded-2xl p-5 border border-black/[0.06] hover:border-black/25 active:scale-[0.98] transition group">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-semibold leading-snug">{p.name}</h3>
                <span className="font-mono text-[13px] bg-stone-100 px-2 py-0.5 rounded-md whitespace-nowrap">Rp {p.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400">{p.category} - tap to add</div>
            </button>
          ))}
        </div>
      </section>

      <aside className="lg:sticky lg:top-24 space-y-4">
        <div className="bg-white rounded-3xl border border-black/[0.06] p-6">
          <h3 className="font-semibold text-lg mb-3">Cart ({cart.reduce((s,c)=>s+c.qty,0)})</h3>
          {cart.length === 0 && <p className="text-sm text-stone-400">Empty - tap menu items left.</p>}
          <div className="divide-y divide-black/[0.06] mb-3">
            {cart.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-stone-400 font-mono">{fmt(c.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#F7F6F3] rounded-lg px-1.5 py-0.5 border border-black/[0.06]">
                    <button onClick={() => decItem(c.id)} className="px-1.5 hover:text-black text-stone-500">−</button>
                    <span className="text-sm w-5 text-center font-mono">{c.qty}</span>
                    <button onClick={() => incItem(c.id)} className="px-1.5 hover:text-black text-stone-500">+</button>
                  </div>
                  <div className="text-sm font-semibold w-[76px] text-right font-mono">{fmt(c.price*c.qty)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <button onClick={() => applyDiscount(10)} className={`px-3 py-1 rounded-full text-xs font-semibold border ${discountPct===10?'bg-[#B45309] text-white border-[#B45309]':'bg-[#FDE8D0] text-[#B45309] border-transparent'}`}>10%</button>
            <button onClick={() => applyDiscount(20)} className={`px-3 py-1 rounded-full text-xs font-semibold border ${discountPct===20?'bg-[#B45309] text-white border-[#B45309]':'bg-[#FDE8D0] text-[#B45309] border-transparent'}`}>20%</button>
            <button onClick={clearDiscount} className="px-3 py-1 rounded-full bg-stone-100 text-xs">Clear</button>
          </div>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes: oat milk / extra hot"
            className="w-full text-sm bg-[#F7F6F3] border border-black/[0.08] rounded-xl px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#B45309]/20" />
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(['cash','transfer','card'] as const).map(m => (
              <button key={m} onClick={() => setMethod(m)}
                className={`py-2 rounded-xl text-xs font-medium border ${method===m?'bg-[#111] text-white border-[#111]':'bg-[#F7F6F3] border-black/10'}`}>
                {m==='cash'?'Cash':m==='transfer'?'QRIS / Transfer':'Card'}
              </button>
            ))}
          </div>
          {method==='cash' && (
            <input type="number" value={cashGiven||''} onChange={e=>setCashGiven(Number(e.target.value)||0)}
              placeholder="Cash given (Rp)" className="w-full border border-black/[0.08] rounded-xl px-3 py-2 mb-3 font-mono text-sm" />
          )}
          <div className="text-sm space-y-1 mb-4 font-mono">
            <div className="flex justify-between"><span className="text-stone-500 font-sans">Subtotal</span><span>{fmt(sub)}</span></div>
            <div className="flex justify-between"><span className="text-stone-500 font-sans">Discount</span><span>{disc>0?'- '+fmt(disc):fmt(0)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-1"><span className="font-sans font-semibold">Total</span><span>{fmt(total)}</span></div>
            {method==='cash' && <div className="flex justify-between"><span className="text-stone-500 font-sans">Change</span><span>{fmt(change)}</span></div>}
          </div>
          <button onClick={confirmOrder}
            className="w-full py-3 rounded-full bg-[#111] text-white text-sm font-semibold hover:bg-[#2a2a2a] active:scale-[0.97] transition">
            Confirm Order - {fmt(total)}
          </button>
          {!shiftOpen && <p className="text-xs text-red-600 mt-2">Shift not open - open from header to checkout.</p>}
        </div>
        <div className="bg-white rounded-3xl border border-black/[0.06] p-6">
          <h4 className="font-semibold mb-2 text-sm">Orders today ({orders.length})</h4>
          {orders.slice(0,5).map(o => (
            <div key={o.id} className="flex justify-between text-sm py-1.5 border-b border-black/5 last:border-0">
              <span className="font-mono text-xs text-stone-400">{o.id} · {o.items.reduce((s,i)=>s+i.qty,0)} items</span>
              <span className="font-mono font-medium">{fmt(o.total)}</span>
            </div>
          ))}
          {orders.length===0 && <p className="text-xs text-stone-400">No orders yet.</p>}
        </div>
      </aside>
    </main>
  );
}
