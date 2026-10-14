import Header from '@/components/Header';
import { products } from '@/lib/data';
import { useApp } from '@/lib/context';

export default function OwnerDashboard() {
  const { orders, cart } = useApp();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const best = orders.length > 0 ? orders.flatMap(o => o.items).reduce((map, item) => {
    map[item.id] = (map[item.id] || 0) + item.qty;
    return map;
  }, {} as Record<number, number>) : {};
  const bestId = Object.entries(best).sort((a, b) => b[1] - a[1])[0]?.[0];
  const bestItem = products.find(p => p.id === Number(bestId));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 lg:px-10 py-10 lg:py-14">
        <h1 className="font-[var(--font-space)] text-4xl font-semibold tracking-tight mb-2">Dashboard — Owner</h1>
        <p className="text-stone-500 mb-8">Real-time revenue, profit estimates, cashier comparison.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Revenue</div>
            <div className="text-2xl font-semibold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <div className="text-xs text-stone-400 mt-1">{orders.length} orders</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Best Seller</div>
            <div className="text-xl font-semibold">{bestItem?.name || '—'}</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Avg / Order</div>
            <div className="text-xl font-semibold">{orders.length > 0 ? 'Rp ' + Math.round(totalRevenue / orders.length).toLocaleString('id-ID') : '—'}</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">COGS (est.)</div>
            <div className="text-xl font-semibold">Rp {Math.round(totalRevenue * 0.39).toLocaleString('id-ID')}</div>
            <div className="text-xs text-stone-400 mt-1">Recipe-based estimate (~39%)</div>
          </div>
        </div>

        <h2 className="font-[var(--font-space)] text-2xl font-semibold mb-4">Recent Orders</h2>
        <div className="bg-white rounded-3xl border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] overflow-hidden">
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
                  <td className="px-6 py-3 font-[var(--font-mono)] text-xs text-stone-400">{o.id}</td>
                  <td className="px-6 py-3">{o.items.map(i => i.name).join(', ')}</td>
                  <td className="px-6 py-3 text-right font-[var(--font-mono)] font-medium">Rp {o.total.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={3} className="px-6 py-4 text-stone-400">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
