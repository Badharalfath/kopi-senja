'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';

export default function Header() {
  const { role, setRole, shiftOpen, openShift, closeShift, openingCash } = useApp();
  const path = usePathname();
  const nav = [
    { href: '/', label: 'POS' },
    { href: '/shift', label: 'Shift' },
    { href: role === 'owner' ? '/dashboard/owner' : '/dashboard/cashier', label: 'Dashboard' },
  ];
  return (
    <header className="sticky top-0 z-50 bg-[#111] text-amber-50 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <Link href="/" className="font-bold text-lg tracking-tight">Kopi Senja</Link>
          <nav className="flex gap-1">
            {nav.map(n => (
              <Link key={n.href+n.label} href={n.href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${path===n.href ? 'bg-white/15 text-white' : 'text-stone-300 hover:bg-white/10'}`}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <button onClick={() => setRole('owner')} className={`px-2.5 py-1 rounded-full border ${role === 'owner' ? 'bg-amber-400/20 text-amber-200 border-amber-400/40' : 'bg-white/5 text-stone-300 border-white/10'}`}>Owner</button>
          <button onClick={() => setRole('cashier')} className={`px-2.5 py-1 rounded-full border ${role === 'cashier' ? 'bg-amber-400/20 text-amber-200 border-amber-400/40' : 'bg-white/5 text-stone-300 border-white/10'}`}>Cashier</button>
          {!shiftOpen ? (
            <button onClick={openShift} className="bg-[#B45309] hover:bg-[#92400D] px-3 py-1.5 rounded-full text-white font-semibold">Open Shift</button>
          ) : (
            <button onClick={closeShift} className="bg-stone-700 hover:bg-stone-600 px-3 py-1.5 rounded-full text-white font-semibold">Close</button>
          )}
        </div>
      </div>
    </header>
  );
}
