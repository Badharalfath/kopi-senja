'use client';
import { useApp } from '@/lib/context';
import EmptyState from '@/components/EmptyState';

const STOCKS = [
  { name: 'Milk', stock: '2.1 L', threshold: '0.5 L', status: 'ok', serves: '~42 lattes' },
  { name: 'Coffee beans', stock: '680 g', threshold: '200 g', status: 'ok', serves: '~37 shots' },
  { name: 'Cups (12oz)', stock: '120 pcs', threshold: '30 pcs', status: 'ok', serves: '120 orders' },
  { name: 'Syrup (vanilla)', stock: '340 ml', threshold: '400 ml', status: 'low', serves: '~22 drinks' },
  { name: 'Sugar', stock: '1.8 kg', threshold: '0.5 kg', status: 'ok', serves: 'plenty' },
  { name: 'Ice', stock: '4.0 kg', threshold: '2.0 kg', status: 'ok', serves: '~80 iced' },
];

export default function CashierDashboardView() {
  const { orders } = useApp();
  const shiftOrders = orders.length;
  const shiftRevenue = orders.reduce((s, o) => s + o.total, 0);
  const customerApprox = Math.max(0, Math.round(shiftOrders * 0.97));

  return (
<main className="mx-auto max-w-6xl px-6 lg:px-10 py-10">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">My Dashboard</h1>
        <p className="text-stone-500 mb-8">Orders served, customers, and stock you can sell today.</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Orders Served</div>
            <div className="text-3xl font-semibold">{shiftOrders}</div>
            <div className="text-xs text-stone-400 mt-1">This session</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Customers</div>
            <div className="text-3xl font-semibold">~{customerApprox}</div>
            <div className="text-xs text-stone-400 mt-1">Estimated</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">My Revenue</div>
            <div className="text-3xl font-semibold">Rp {shiftRevenue.toLocaleString('id-ID')}</div>
            <div className="text-xs text-stone-400 mt-1">Handled this shift</div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-1">Stock Detail</h2>
        <p className="text-sm text-stone-500 mb-4">What you can still sell. Low items need a reorder before the evening rush.</p>
        <div className="bg-white rounded-3xl border border-black/[0.06] overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F6F3]">
              <tr className="text-[10px] uppercase tracking-widest text-stone-400">
                <th className="text-left px-6 py-3">Ingredient</th>
                <th className="text-right px-4 py-3">On Hand</th>
                <th className="text-right px-4 py-3">Low At</th>
                <th className="text-right px-4 py-3">Serves</th>
                <th className="text-right px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {STOCKS.map(s => (
                <tr key={s.name}>
                  <td className="px-6 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.stock}</td>
                  <td className="px-4 py-3 text-right font-mono text-stone-400">{s.threshold}</td>
                  <td className="px-4 py-3 text-right font-mono text-stone-500">{s.serves}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.status === 'low' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {s.status === 'low' ? 'Low - reorder' : 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <EmptyState
            title="No orders this shift yet"
            desc="Your completed payments will appear here with totals."
          />
        )}
        {orders.length > 0 && (<>
        <h2 className="text-2xl font-semibold mb-4">Orders This Shift</h2>
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
                  <td className="px-6 py-3">{o.items.length} items</td>
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
