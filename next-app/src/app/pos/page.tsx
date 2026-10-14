'use client';
import Header from '@/components/Header';
import { useApp } from '@/lib/context';

export default function POSPage() {
  const { cart, addItem, incItem, decItem, discountPct, applyDiscount, clearDiscount, notes, setNotes, orders, addOrder, shiftOpen } = useApp();

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const disc = Math.round(sub * discountPct / 100);
  const total = sub - disc;

  const confirmOrder = () => {
    if (cart.length === 0) { alert('Select at least one item.'); return; }
    if (!shiftOpen) { alert('Open a shift first.'); return; }
    addOrder({
      id: 'S-' + Date.now(),
      items: cart.map(c => ({ ...c })),
      subtotal: sub,
      discount: disc,
      total,
      method: 'cash',
      notes: notes || undefined,
      time: new Date().toLocaleString('id-ID'),
    });
    alert('Order completed. Receipt saved.');
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 lg:px-10 py-10 lg:py-14 grid lg:grid-cols-[1fr_420px] gap-12 items-start">
        <section className="space-y-8">
          <div>
            <h1 className="font-[var(--font-space)] text-4xl font-semibold tracking-tight">Checkout</h1>
            <p className="text-stone-500 mt-1">Real-time cart and payment.</p>
          </div>
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6 lg:p-8 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <h3 className="font-semibold text-xl mb-4">Cart</h3>
            {cart.length === 0 && <p className="text-stone-400 italic">No items — add from Menu.</p>}
            <div className="divide-y divide-black/[0.06] mb-4">
              {cart.map(c => (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-stone-400 font-[var(--font-mono)]">{fmt(c.price)} / pcs</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#F7F6F3] rounded-lg px-2 py-1 border border-black/[0.06]">
                      <button onClick={() => decItem(c.id)} className="text-stone-500 hover:text-[#111] px-1 text-xs">−</button>
                      <span className="text-sm font-medium w-5 text-center font-[var(--font-mono)]">{c.qty}</span>
                      <button onClick={() => incItem(c.id)} className="text-stone-500 hover:text-[#111] px-1 text-xs">+</button>
                    </div>
                    <div className="text-sm font-semibold w-20 text-right font-[var(--font-mono)]">{fmt(c.price * c.qty)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => applyDiscount(10)} className="px-3 py-1.5 rounded-full bg-[#FDE8D0] text-[#B45309] text-xs font-semibold hover:bg-[#f8dbc2]">10% Off</button>
              <button onClick={() => applyDiscount(20)} className="px-3 py-1.5 rounded-full bg-[#FDE8D0] text-[#B45309] text-xs font-semibold hover:bg-[#f8dbc2]">20% Off</button>
              <button onClick={clearDiscount} className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium hover:bg-stone-200">Clear discount</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <label htmlFor="orderNotes" className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Notes</label>
              <input id="orderNotes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Oat milk / extra hot" className="w-full text-sm bg-[#F7F6F3] border border-black/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B45309]/20" />
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-28 space-y-6">
          <div className="bg-[#111] text-amber-50 rounded-3xl border border-white/10 p-8">
            <h2 className="font-[var(--font-space)] text-3xl mb-1">Checkout</h2>
            <p className="text-stone-400 text-sm mb-6">Live data. No mock numbers.</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-stone-400">Subtotal</span><span className="font-[var(--font-mono)]">{fmt(sub)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-400">Discount</span><span className="text-amber-300 font-[var(--font-mono)]">{disc > 0 ? `- ${fmt(disc)}` : fmt(0)}</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-semibold"><span>Total</span><span className="font-[var(--font-mono)] text-amber-200">{fmt(total)}</span></div>
            </div>
            <button onClick={confirmOrder} className="w-full py-3.5 rounded-full bg-amber-400 text-[#111] font-bold text-sm hover:bg-amber-300 transition shadow-lg shadow-amber-900/30">Confirm Order</button>
          </div>

          <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <h3 className="font-semibold text-lg mb-4">Orders Today ({orders.length})</h3>
            <div className="divide-y divide-black/[0.06]">
              {orders.map(o => (
                <div key={o.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-[var(--font-mono)] text-xs text-stone-400">{o.id}</div>
                    <div className="text-sm">{o.items.length} items · {o.method}</div>
                  </div>
                  <div className="text-sm font-semibold text-right font-[var(--font-mono)]">{fmt(o.total)}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
