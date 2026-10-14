'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { products } from '@/lib/data';
import { useApp } from '@/lib/context';

const CATS = [
  { id: 'all', label: 'All Menus' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'snack', label: 'Snacks' },
];

export default function Sidebar() {
  const { role, setRole, shiftOpen, openShift, closeShift, category, setCategory, cart } = useApp();
  const path = usePathname();
  const isPOS = path === '/' || path === '/pos' || path === '/menu';
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const isPayment = path === '/payment' || path === '/payment/qris';
  const workNav = [
    { href: '/', label: 'Cashier Workspace', desc: 'Menu + cart', active: isPOS },
    { href: '/payment', label: 'Payment', desc: 'Methods + QRIS', active: isPayment },
    { href: '/shift', label: 'Shift & Cash', desc: 'Open / close', active: path === '/shift' },
  ];
  const reportNav = role === 'owner'
    ? [{ href: '/dashboard/owner', label: 'Owner Dashboard', desc: 'Revenue / profit', active: path === '/dashboard/owner' }]
    : [{ href: '/dashboard/cashier', label: 'My Dashboard', desc: 'Orders / stock', active: path === '/dashboard/cashier' }];

  const countFor = (id: string) => id === 'all' ? products.length : products.filter(p => p.category === id).length;

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-50 bg-[#111] text-white px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold">Kopi Senja</Link>
        <div className="flex gap-2 text-xs">
          <Link href="/" className="px-3 py-1.5 rounded-full bg-white/10">POS{cartCount>0?` (${cartCount})`:''}</Link>
          <Link href="/payment" className="px-3 py-1.5 rounded-full bg-white/10">Pay</Link>
          <Link href="/shift" className="px-3 py-1.5 rounded-full bg-white/10">Shift</Link>
          <Link href={role==='owner'?'/dashboard/owner':'/dashboard/cashier'} className="px-3 py-1.5 rounded-full bg-white/10">Dash</Link>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[260px] shrink-0 min-h-[100dvh] sticky top-0 flex-col bg-[#111] text-stone-200" aria-label="Main navigation">
        <div className="px-6 pt-6 pb-4">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">Kopi Senja</Link>
          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-500 mt-1">Coffee POS · Prototype</p>
        </div>

        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5" role="group" aria-label="Switch role">
            {(['cashier','owner'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                aria-pressed={role===r}
                className={`py-2 rounded-lg text-xs font-semibold capitalize ${role===r?'bg-white text-black':'text-stone-400 hover:text-white'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <nav className="px-4 py-2 space-y-5 overflow-y-auto flex-1">
          <div>
            <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">Work</p>
            <div className="space-y-1">
              {workNav.map(n => (
                <Link key={n.href+n.label} href={n.href} aria-current={n.active?'page':undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm min-h-[44px] ${n.active?'bg-white text-black font-semibold':'hover:bg-white/10'}`}>
                  <span>{n.label}</span>
                  <span className={`text-[11px] ${n.active?'text-stone-500':'text-stone-500'}`}>{n.href==='/' && cartCount>0 ? `${cartCount} in cart` : n.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">Reports</p>
            <div className="space-y-1">
              {reportNav.map(n => (
                <Link key={n.href} href={n.href} aria-current={n.active?'page':undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm min-h-[44px] ${n.active?'bg-white text-black font-semibold':'hover:bg-white/10'}`}>
                  <span>{n.label}</span>
                  <span className="text-[11px] text-stone-500">{n.desc}</span>
                </Link>
              ))}
              {role==='owner' && (
                <Link href="/dashboard/cashier"
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm min-h-[44px] ${path==='/dashboard/cashier'?'bg-white text-black font-semibold':'hover:bg-white/10'}`}>
                  <span>Cashier View</span>
                  <span className="text-[11px] text-stone-500">Preview</span>
                </Link>
              )}
            </div>
          </div>

          {isPOS && (
            <div>
              <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">Menu Categories</p>
              <div className="space-y-1" role="group" aria-label="Filter menu by category">
                {CATS.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} aria-pressed={category===c.id}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm min-h-[44px] ${category===c.id?'bg-amber-400 text-black font-semibold':'hover:bg-white/10 text-stone-200'}`}>
                    <span>{c.label}</span>
                    <span className={`font-mono text-xs px-1.5 py-0.5 rounded-md ${category===c.id?'bg-black/10':'bg-white/10'}`}>{countFor(c.id)}</span>
                  </button>
                ))}
              </div>
              <p className="px-2 text-[11px] text-stone-500 mt-2 leading-relaxed">Scales when menu grows - categories stay in sidebar, grid stays scannable.</p>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-400">Shift</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${shiftOpen?'bg-green-400/20 text-green-300':'bg-white/10 text-stone-400'}`}>
                {shiftOpen?'Open':'Closed'}
              </span>
            </div>
            {!shiftOpen ? (
              <button onClick={openShift} className="w-full py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400D] text-white text-sm font-semibold min-h-[44px]">Open Shift</button>
            ) : (
              <button onClick={closeShift} className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold min-h-[44px]">Close Shift</button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
