'use client';
import Shell from '@/components/Shell';
import POSWorkspace from '@/components/POSWorkspace';
import { useApp } from '@/lib/context';
import Link from 'next/link';

export default function HomePage() {
  const { role, orders } = useApp();
  if (role === 'owner') {
    const total = orders.reduce((s, o) => s + o.total, 0);
    return (
      <Shell>
        <main className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Owner Dashboard</h1>
          <p className="text-sm text-stone-500 mt-1 mb-6">Default for owner. Menu and shift live in the sidebar.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-black/[0.06]"><div className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Revenue</div><div className="text-2xl font-semibold">Rp {total.toLocaleString('id-ID')}</div><div className="text-xs text-stone-400">{orders.length} orders</div></div>
            <div className="bg-white rounded-2xl p-6 border border-black/[0.06]"><div className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Avg / Order</div><div className="text-2xl font-semibold">{orders.length ? 'Rp '+Math.round(total/orders.length).toLocaleString('id-ID') : '-'}</div></div>
            <div className="bg-white rounded-2xl p-6 border border-black/[0.06]"><div className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">COGS est.</div><div className="text-2xl font-semibold">Rp {Math.round(total*0.39).toLocaleString('id-ID')}</div></div>
          </div>
          <div className="flex gap-3">
            <Link href="/menu" className="inline-block bg-[#111] text-white px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">Manage Menu</Link>
            <Link href="/shift" className="inline-block bg-white border border-black/10 px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">Shift and Cash</Link>
          </div>
        </main>
      </Shell>
    );
  }
  return (<Shell><POSWorkspace /></Shell>);
}
