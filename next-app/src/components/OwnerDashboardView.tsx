'use client';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import EmptyState from '@/components/EmptyState';

export default function OwnerDashboardView() {
  const { orders, menuItems, shiftOpen, openShift, closeShift, openingCash, closingCash, setOpeningCash, setClosingCash } = useApp();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const best = orders.length > 0 ? orders.flatMap(o => o.items).reduce((map, item) => {
    map[item.id] = (map[item.id] || 0) + item.qty;
    return map;
  }, {} as Record<number, number>) : {};
  const bestId = Object.entries(best).sort((a, b) => b[1] - a[1])[0]?.[0];
  const bestItem = menuItems.find(p => p.id === Number(bestId));

  const shiftRevenue = orders.reduce((s, o) => s + o.total, 0);
  const expected = openingCash + shiftRevenue;
  const diff = closingCash - expected;

  return (
    <main className="mx-auto max-w-6xl px-6 lg:px-10 py-10">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Dashboard - Owner</h1>
      <p className="text-stone-500 mb-8">Revenue, shift and cash. Menu lives under Manage in the sidebar.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06]">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Revenue</div>
          <div className="text-2xl font-semibold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          <div className="text-xs text-stone-400 mt-1">{orders.length} orders</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06]">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Best Seller</div>
          <div className="text-xl font-semibold">{bestItem?.name || '-'}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06]">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Avg / Order</div>
          <div className="text-xl font-semibold">{orders.length > 0 ? 'Rp ' + Math.round(totalRevenue / orders.length).toLocaleString('id-ID') : '-'}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06]">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">COGS (est.)</div>
          <div className="text-xl font-semibold">Rp {Math.round(totalRevenue * 0.39).toLocaleString('id-ID')}</div>
          <div className="text-xs text-stone-400 mt-1">Recipe estimate (~39%)</div>
        </div>
      </div>

      <div className="flex items-end justify-between mb-4">
        <h2 className="text-2xl font-semibold">Shift and Cash</h2>
        <Link href="/shift" className="text-xs underline">Full shift page</Link>
      </div>
      <div className="bg-white rounded-3xl border border-black/[0.06] p-6 mb-10">
        <div className="grid sm:grid-cols-4 gap-4 mb-4 text-sm">
          <div><div className="text-[10px] uppercase tracking-widest text-stone-400">Status</div><div className="text-lg font-semibold">{shiftOpen ? 'Open' : 'Closed'}</div></div>
          <div><div className="text-[10px] uppercase tracking-widest text-stone-400">Opening</div><div className="font-mono text-lg">Rp {openingCash.toLocaleString('id-ID')}</div></div>
          <div><div className="text-[10px] uppercase tracking-widest text-stone-400">Expected</div><div className="font-mono text-lg">Rp {expected.toLocaleString('id-ID')}</div></div>
          <div><div className="text-[10px] uppercase tracking-widest text-stone-400">Difference</div><div className={`font-mono text-lg font-semibold ${diff === 0 ? 'text-green-600' : 'text-red-600'}`}>Rp {diff.toLocaleString('id-ID')}</div></div>
        </div>
        {!shiftOpen ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="number" value={openingCash || ''} onChange={e => setOpeningCash(Number(e.target.value) || 0)}
              placeholder="Opening cash" className="flex-1 border border-black/[0.08] rounded-xl px-3 py-2.5 font-mono text-sm" />
            <button onClick={openShift} className="btn-press px-6 py-2.5 rounded-full bg-[#B45309] text-white text-sm font-semibold min-h-[44px]">Open Shift</button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="number" value={closingCash || ''} onChange={e => setClosingCash(Number(e.target.value) || 0)}
              placeholder="Actual closing cash" className="flex-1 border border-black/[0.08] rounded-xl px-3 py-2.5 font-mono text-sm" />
            <button onClick={closeShift} className="btn-press px-6 py-2.5 rounded-full bg-[#111] text-white text-sm font-semibold min-h-[44px]">Close Shift</button>
          </div>
        )}
      </div>

      {orders.length === 0 && (
        <EmptyState
          title="No sales recorded yet"
          desc="Orders completed at the cashier will show up here with revenue totals."
          actionHref="/users"
          actionLabel="Manage team"
        />
      )}
      {orders.length > 0 && (<>
      <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
      <div className="bg-white rounded-3xl border border-black/[0.06] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F7F6F3]">
            <tr className="text-[10px] uppercase tracking-widest text-stone-400">
              <th className="text-left px-6 py-3">Order</th>
              <th className="text-left px-6 py-3">Items</th>
              <th className="text-right px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06]">
            {orders.map(o => (
              <tr key={o.id}>
                <td className="px-6 py-3 font-mono text-xs text-stone-400">{o.id}</td>
                <td className="px-6 py-3">{o.items.map(i => i.name).join(', ')}</td>
                <td className="px-6 py-3 text-right font-mono font-medium">Rp {o.total.toLocaleString('id-ID')}</td>
              </tr>
            ))}
            
          </tbody>
        </table>
        </div>
      </>)}
    </main>
  );
}
