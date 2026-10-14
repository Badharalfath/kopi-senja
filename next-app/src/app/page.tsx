import Header from '@/components/Header';
import { useApp } from '@/lib/context';
import Link from 'next/link';

export default function HomePage() {
  const { role } = useApp();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24 space-y-8">
        <div className="max-w-3xl">
          <h1 className="font-[var(--font-space)] text-5xl md:text-7xl font-semibold tracking-tight leading-[0.92] text-[#111]">Kopi Senja.</h1>
          <p className="text-xl md:text-2xl text-stone-500 mt-6 leading-relaxed">A fully developed POS and basic ERP prototype — role-separated, live state, separated reports. Not a mock.</p>
        </div>
        <nav className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-8">
          <Link href="/pos" className="group bg-white rounded-3xl p-8 border border-black/[0.06] hover:border-black/20 transition shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <h3 className="text-xl font-semibold mb-2">POS Checkout</h3>
            <p className="text-sm text-stone-500">Cart, discount, cash / transfer / card, receipt.</p>
          </Link>
          <Link href="/menu" className="group bg-white rounded-3xl p-8 border border-black/[0.06] hover:border-black/20 transition shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <h3 className="text-xl font-semibold mb-2">Menu</h3>
            <p className="text-sm text-stone-500">Categories, products, prices. Editable for owner.</p>
          </Link>
          <Link href="/shift" className="group bg-white rounded-3xl p-8 border border-black/[0.06] hover:border-black/20 transition shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <h3 className="text-xl font-semibold mb-2">Shift & Cash</h3>
            <p className="text-sm text-stone-500">Open / close, opening cash, reconciliation.</p>
          </Link>
          <Link href="/dashboard/owner" className="group bg-white rounded-3xl p-8 border border-black/[0.06] hover:border-black/20 transition shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <h3 className="text-xl font-semibold mb-2">Dashboard — Owner</h3>
            <p className="text-sm text-stone-500">Revenue, profit, COGS, best sellers, cashier comparison.</p>
          </Link>
          <Link href="/dashboard/cashier" className="group bg-white rounded-3xl p-8 border border-black/[0.06] hover:border-black/20 transition shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <h3 className="text-xl font-semibold mb-2">Dashboard — Cashier</h3>
            <p className="text-sm text-stone-500">Orders served, customers, shift revenue, stock available.</p>
          </Link>
        </nav>
        <div className="pt-6 text-xs text-stone-400">
          Role: <strong className="text-[#111]">{role}</strong> — Switch in header. Reports are separated by role, not combined.
        </div>
      </main>
    </>
  );
}
