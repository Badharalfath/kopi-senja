import Link from 'next/link';
import { useApp } from '@/lib/context';

export default function Header() {
  const { role, setRole, shiftOpen, openShift, closeShift, openingCash } = useApp();
  return (
    <header className="sticky top-0 z-50 bg-[#111] text-amber-50 border-b border-white/10 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-[var(--font-space)] font-bold text-xl tracking-tight leading-none">Kopi Senja</Link>
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.15em] text-amber-200/50">POS Prototype</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          <button onClick={() => setRole('owner')} className={`px-2.5 py-1 rounded-full border ${role === 'owner' ? 'bg-amber-400/20 text-amber-200 border-amber-400/40' : 'bg-white/5 text-stone-300 border-white/10'}`}>Owner</button>
          <button onClick={() => setRole('cashier')} className={`px-2.5 py-1 rounded-full border ${role === 'cashier' ? 'bg-amber-400/20 text-amber-200 border-amber-400/40' : 'bg-white/5 text-stone-300 border-white/10'}`}>Cashier</button>
          <span className="hidden md:inline text-stone-400">|</span>
          {!shiftOpen ? (
            <button onClick={() => { openShift(); }} className="bg-[#B45309] hover:bg-[#92400D] px-3 py-1.5 rounded-full text-white text-xs font-semibold transition">Open Shift</button>
          ) : (
            <button onClick={() => { closeShift(); }} className="bg-stone-700 hover:bg-stone-600 px-3 py-1.5 rounded-full text-white text-xs font-semibold transition">Close Shift</button>
          )}
          <span className="text-stone-400 hidden lg:inline">{shiftOpen ? `Open — Rp ${openingCash.toLocaleString('id-ID')}` : 'Not started'}</span>
        </div>
      </div>
    </header>
  );
}
