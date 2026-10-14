'use client';
import Header from '@/components/Header';
import POSWorkspace from '@/components/POSWorkspace';
import { useApp } from '@/lib/context';
import { products } from '@/lib/data';
import Link from 'next/link';

export default function HomePage() {
  const { role, orders } = useApp();
  if (role === 'owner') {
    const total = orders.reduce((s, o) => s + o.total, 0);
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-6 lg:px-10 py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Owner Dashboard</h1>
              <p className="text-sm text-stone-500 mt-1">Default for owner — business view. <Link href="/pos" className="underline">Go to POS</Link></p>
            </div>
            <Link href="/dashboard/owner" className="text-xs underline">Full report</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Revenue</div>
              <div className="text-2xl font-semibold">Rp {total.toLocaleString('id-ID')}</div>
              <div className="text-xs text-stone-400">{orders.length} orders</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Avg / Order</div>
              <div className="text-2xl font-semibold">{orders.length ? 'Rp '+Math.round(total/orders.length).toLocaleString('id-ID') : '—'}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">COGS est.</div>
              <div className="text-2xl font-semibold">Rp {Math.round(total*0.39).toLocaleString('id-ID')}</div>
            </div>
          </div>
          <Link href="/pos" className="inline-block bg-[#111] text-white px-6 py-3 rounded-full text-sm font-semibold">Open Cashier Workspace</Link>
        </main>
      </>
    );
  }
  return (
    <>
      <Header />
      <POSWorkspace />
    </>
  );
}
