'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';

export default function Sidebar() {
  const { role, setRole, shiftOpen, openShift, closeShift, cart, orders } = useApp();
  const path = usePathname();
  const isPOS = path === '/' || path === '/pos';
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const isOwner = role === 'owner';

  const dashHref = '/dashboard';
  const dashLabel = isOwner ? 'Dashboard' : 'My Dashboard';
  const dashDesc = isOwner ? 'Revenue / shift' : 'Orders / stock';
  const dashActive = path === '/dashboard';

  const workNav = isOwner
    ? [
        { href: '/orders', label: 'Orders', desc: `${orders.length} today`, active: path === '/orders' },
        { href: '/shift', label: 'Shift & Cash', desc: 'Owner only', active: path === '/shift' },
      ]
    : [
        { href: '/', label: 'Cashier Workspace', desc: 'Menu + cart', active: isPOS },
        { href: '/orders', label: 'Orders', desc: `${orders.length} today`, active: path === '/orders' },
      ];

  return (
    <>
      <div className="md:hidden sticky top-0 z-50 bg-[#111] text-white px-4 py-3 flex items-center justify-between">
        <Link href={isOwner ? "/dashboard" : "/"} className="font-bold">Kopi Senja</Link>
        <div className="flex gap-2 text-xs">
          <Link href={dashHref} className="px-3 py-1.5 rounded-full bg-white/10">Dash</Link>
          {!isOwner && <Link href="/" className="px-3 py-1.5 rounded-full bg-white/10">POS{cartCount > 0 ? ` (${cartCount})` : ''}</Link>}
          <Link href="/orders" className="px-3 py-1.5 rounded-full bg-white/10">Orders</Link>
          {isOwner && <Link href="/shift" className="px-3 py-1.5 rounded-full bg-white/10">Shift</Link>}
        </div>
      </div>

      <aside className="hidden md:flex w-[260px] shrink-0 min-h-[100dvh] sticky top-0 flex-col bg-[#111] text-stone-200" aria-label="Main navigation">
        <div className="px-6 pt-6 pb-4">
          <Link href={isOwner ? "/dashboard" : "/"} className="text-xl font-bold text-white tracking-tight">Kopi Senja</Link>
          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-500 mt-1">Coffee POS - Prototype</p>
        </div>

        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5" role="group" aria-label="Switch role">
            {(['cashier', 'owner'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} aria-pressed={role === r}
                className={`btn-press py-2 rounded-lg text-xs font-semibold capitalize min-h-[44px] ${role === r ? 'bg-white text-black' : 'text-stone-400 hover:text-white'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <nav className="px-4 py-2 space-y-5 overflow-y-auto flex-1">
          <div>
            <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">Dashboard</p>
            <div className="space-y-1">
              <Link href={dashHref} aria-current={dashActive ? 'page' : undefined}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm min-h-[44px] ${dashActive ? 'bg-white text-black font-semibold' : 'hover:bg-white/10'}`}>
                <span>{dashLabel}</span>
                <span className="text-[11px] text-stone-500">{dashDesc}</span>
              </Link>

            </div>
          </div>

          <div>
            <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">Work</p>
            <div className="space-y-1">
              {workNav.map(n => (
                <Link key={n.href + n.label} href={n.href} aria-current={n.active ? 'page' : undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm min-h-[44px] ${n.active ? 'bg-white text-black font-semibold' : 'hover:bg-white/10'}`}>
                  <span>{n.label}</span>
                  <span className="text-[11px] text-stone-500">{n.href === '/' && cartCount > 0 ? `${cartCount} in cart` : n.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {isOwner && (
            <div>
              <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">Manage</p>
              <div className="space-y-1">
                <Link href="/menu" aria-current={path === '/menu' ? 'page' : undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm min-h-[44px] ${path === '/menu' ? 'bg-white text-black font-semibold' : 'hover:bg-white/10'}`}>
                  <span>Menu</span>
                  <span className="text-[11px] text-stone-500">Items + categories</span>
                </Link>
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-400">Shift</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${shiftOpen ? 'bg-green-400/20 text-green-300' : 'bg-white/10 text-stone-400'}`}>
                {shiftOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            {!shiftOpen ? (
              <button onClick={openShift} className="btn-press w-full py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400D] text-white text-sm font-semibold min-h-[44px]">Open Shift</button>
            ) : (
              <button onClick={closeShift} className="btn-press w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold min-h-[44px]">Close Shift</button>
            )}
            {!isOwner && <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">Cashiers can open or close the shift. Cash details stay owner only.</p>}
          </div>
        </div>
      </aside>
    </>
  );
}
