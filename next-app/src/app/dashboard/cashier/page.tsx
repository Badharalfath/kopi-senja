'use client';
import Shell from '@/components/Shell';
import { products } from '@/lib/data';
import { useApp } from '@/lib/context';

export default function CashierDashboard() {
  const { orders, shiftOpen, openingCash, orders: sessionOrders } = useApp();
  const shiftOrders = sessionOrders.length;
  const shiftRevenue = sessionOrders.reduce((s, o) => s + o.total, 0);
  const customerApprox = Math.max(1, Math.round(shiftOrders * 0.97));

  return (
    <Shell>
      
      <main className="mx-auto max-w-6xl px-6 lg:px-10 py-10 lg:py-14">
        <h1 className="font-[var(--font-space)] text-4xl font-semibold tracking-tight mb-2">Dashboard — Cashier</h1>
        <p className="text-stone-500 mb-8">Orders served, customers, shift revenue, stock available.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Orders Served</div>
            <div className="text-2xl font-semibold">{shiftOrders}</div>
            <div className="text-xs text-stone-400 mt-1">Today</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Customers</div>
            <div className="text-2xl font-semibold">~{customerApprox}</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Shift Revenue</div>
            <div className="text-2xl font-semibold">Rp {shiftRevenue.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Shift Status</div>
            <div className="text-2xl font-semibold">{shiftOpen ? 'Open' : 'Not started'}</div>
            <div className="text-xs text-stone-400 mt-1">{shiftOpen ? `Opening: Rp ${openingCash.toLocaleString('id-ID')}` : '—'}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-black/[0.06] p-6 mb-6 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
          <h3 className="font-[var(--font-space)] text-xl font-semibold mb-2">Stock Ready</h3>
          <p className="text-sm leading-relaxed text-stone-600">
            Milk 2.1L · Coffee beans 680g · Cups 120pcs · Syrup 340ml.
            <span className="text-[#B45309] font-medium"> Low: Syrup below 400ml — reorder before evening.</span>
          </p>
        </div>

        <h2 className="font-[var(--font-space)] text-2xl font-semibold mb-4">Orders This Shift</h2>
        <div className="bg-white rounded-3xl border border-black/[0.06] overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F6F3]">
              <tr className="text-[10px] uppercase tracking-widest text-stone-400">
                <th className="text-left px-6 py-3">Order</th>
                <th className="text-left px-6 py-3">Items</th>
                <th className="text-right px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {sessionOrders.map(o => (
                <tr key={o.id}>
                  <td className="px-6 py-3 font-[var(--font-mono)] text-xs text-stone-400">{o.id}</td>
                  <td className="px-6 py-3">{o.items.length} items</td>
                  <td className="px-6 py-3 text-right font-[var(--font-mono)] font-medium">Rp {o.total.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {sessionOrders.length === 0 && <tr><td colSpan={3} className="px-6 py-4 text-stone-400">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </Shell>
  );
}
