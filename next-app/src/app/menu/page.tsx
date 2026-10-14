import Header from '@/components/Header';
import { products } from '@/lib/data';
import { useApp } from '@/lib/context';

export default function MenuPage() {
  const { role, addItem } = useApp();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex items-end justify-between mb-6">
          <h1 className="font-[var(--font-space)] text-4xl md:text-5xl font-semibold tracking-tight">Menu</h1>
          <span className="text-xs uppercase tracking-widest text-stone-400">{role === 'owner' ? 'Manage / Edit' : 'Read only'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <button key={p.id} onClick={() => addItem(p.id)} className="text-left bg-white rounded-2xl p-6 border border-black/[0.06] hover:border-black/20 transition group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <span className="font-[var(--font-mono)] text-sm bg-stone-50 px-2 py-0.5 rounded-md">Rp {p.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">{p.category}</div>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}
