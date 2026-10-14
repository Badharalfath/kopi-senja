'use client';
import Shell from '@/components/Shell';
import POSWorkspace from '@/components/POSWorkspace';
import Link from 'next/link';
import { useApp } from '@/lib/context';

export default function POSPage() {
  const { role } = useApp();
  if (role === 'owner') {
    return (
      <Shell>
        <main className="mx-auto max-w-2xl px-6 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-2">Cashier workspace is cashier only</h1>
          <p className="text-sm text-stone-500 mb-6">Owners use the dashboard, menu management, and shift pages.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="bg-[#111] text-white px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">Dashboard</Link>
            <Link href="/menu" className="bg-white border border-black/10 px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">Manage Menu</Link>
          </div>
        </main>
      </Shell>
    );
  }
  return (<Shell><POSWorkspace /></Shell>);
}
