import Header from '@/components/Header';
import { useApp } from '@/lib/context';

export default function ShiftPage() {
  const { shiftOpen, openShift, closeShift, openingCash, closingCash, setOpeningCash, setClosingCash, orders } = useApp();

  const shiftRevenue = orders.reduce((s, o) => s + o.total, 0);
  const expected = openingCash + shiftRevenue;
  const diff = closingCash - expected;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 lg:px-10 py-10 lg:py-14">
        <h1 className="font-[var(--font-space)] text-4xl font-semibold tracking-tight mb-2">Shift & Cash</h1>
        <p className="text-stone-500 mb-8">Open, process orders, then close with reconciliation.</p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Status</div>
            <div className="text-xl font-semibold">{shiftOpen ? 'Open' : 'Not started'}</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Orders</div>
            <div className="text-xl font-semibold">{orders.length}</div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Shift Revenue</div>
            <div className="text-xl font-semibold">Rp {shiftRevenue.toLocaleString('id-ID')}</div>
          </div>
        </div>

        {!shiftOpen ? (
          <div className="bg-white rounded-3xl border border-black/[0.06] p-8 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            <h3 className="font-semibold text-xl mb-2">Open Shift</h3>
            <label className="block text-xs text-stone-400 mb-1">Opening Cash (Rp)</label>
            <input type="number" value={openingCash || ''} onChange={e => setOpeningCash(Number(e.target.value) || 0)} className="w-full border border-black/[0.08] rounded-xl px-3 py-2 mb-4" placeholder="500000" />
            <button onClick={openShift} className="w-full bg-[#B45309] hover:bg-[#92400D] text-white rounded-full py-2.5 font-semibold">Open Shift</button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-black/[0.06] p-8 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] space-y-6">
            <h3 className="font-semibold text-xl">Close Shift</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div><div className="text-[10px] uppercase tracking-widest text-stone-400">Opening Cash</div><div className="font-[var(--font-mono)] text-lg">Rp {openingCash.toLocaleString('id-ID')}</div></div>
              <div><div className="text-[10px] uppercase tracking-widest text-stone-400">Orders Revenue</div><div className="font-[var(--font-mono)] text-lg">Rp {shiftRevenue.toLocaleString('id-ID')}</div></div>
              <div><div className="text-[10px] uppercase tracking-widest text-stone-400">Expected Cash</div><div className="font-[var(--font-mono)] text-lg">Rp {expected.toLocaleString('id-ID')}</div></div>
            </div>
            <label className="block text-xs text-stone-400 mb-1">Actual Closing Cash (Rp)</label>
            <input type="number" value={closingCash || ''} onChange={e => setClosingCash(Number(e.target.value) || 0)} className="w-full border border-black/[0.08] rounded-xl px-3 py-2 mb-2" />
            <div className="text-sm"><span className="text-stone-400">Difference: </span><span className={diff === 0 ? 'text-green-600' : 'text-red-600'}>Rp {diff.toLocaleString('id-ID')}</span></div>
            <button onClick={closeShift} className="w-full bg-[#111] hover:bg-[#2a2a2a] text-white rounded-full py-2.5 font-semibold">Close Shift</button>
          </div>
        )}
      </main>
    </>
  );
}
