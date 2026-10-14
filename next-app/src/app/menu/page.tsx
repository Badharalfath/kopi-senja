'use client';
import { useState } from 'react';
import Shell from '@/components/Shell';
import { useApp } from '@/lib/context';
import Link from 'next/link';

export default function MenuManagePage() {
  const { role, menuItems, categories, addMenuItem, removeMenuItem, addCategory } = useApp();
  const [name, setName] = useState('');
  const [cat, setCat] = useState(categories[0] || 'coffee');
  const [price, setPrice] = useState(0);
  const [newCat, setNewCat] = useState('');
  const [filter, setFilter] = useState('all');
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  if (role !== 'owner') {
    return (
      <Shell>
        <main className="mx-auto max-w-2xl px-6 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-2">Menu management is owner only</h1>
          <p className="text-sm text-stone-500 mb-6">Switch to Owner in the sidebar to add items and categories. Cashiers use the workspace.</p>
          <Link href="/" className="inline-block bg-[#111] text-white px-6 py-3 rounded-full text-sm font-semibold min-h-[44px]">Back to Workspace</Link>
        </main>
      </Shell>
    );
  }

  const submitItem = () => {
    if (!name.trim() || price <= 0) { alert('Enter a name and a price above 0.'); return; }
    addMenuItem(name.trim(), cat, price);
    setName(''); setPrice(0);
  };

  const submitCat = () => {
    if (!newCat.trim()) return;
    addCategory(newCat.trim());
    setNewCat('');
  };

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-6 lg:px-10 py-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Menu Management</h1>
          <p className="text-sm text-stone-500 mt-1 mb-4">Owner only. Add items and categories. Changes apply to the cashier workspace instantly.</p>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 flex flex-wrap gap-3 mb-4" role="group" aria-label="Filter menu by category">
            <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}
              className={`btn-press px-5 py-2.5 rounded-full text-sm font-semibold border min-h-[48px] ${filter === 'all' ? 'bg-[#111] text-white border-[#111]' : 'bg-[#F7F6F3] border-black/10 hover:border-black/30'}`}>
              All ({menuItems.length})
            </button>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} aria-pressed={filter === c}
                className={`btn-press px-5 py-2.5 rounded-full text-sm font-semibold border min-h-[48px] capitalize ${filter === c ? 'bg-[#111] text-white border-[#111]' : 'bg-[#F7F6F3] border-black/10 hover:border-black/30'}`}>
                {c} ({menuItems.filter(p => p.category === c).length})
              </button>
            ))}
          </div>
          <div className="stagger grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(filter === 'all' ? menuItems : menuItems.filter(p => p.category === filter)).map(p => (
              <div key={p.id} className="card-hover bg-white rounded-2xl p-5 border border-black/[0.06]">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-semibold leading-snug">{p.name}</h3>
                  <span className="font-mono text-[13px] bg-stone-100 px-2 py-0.5 rounded-md whitespace-nowrap">{fmt(p.price)}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-stone-400 capitalize mb-3">{p.category}</div>
                <button onClick={() => removeMenuItem(p.id)} aria-label={`Remove ${p.name}`}
                  className="btn-press px-3 py-2 rounded-full bg-stone-100 text-xs font-semibold hover:bg-stone-200 min-h-[40px]">Remove</button>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6">
            <h2 className="font-semibold mb-4">Add item</h2>
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Oat Latte"
              className="mt-1 mb-3 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm" />
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)}
              className="mt-1 mb-3 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm bg-white">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Price (Rp)</label>
            <input type="number" value={price || ''} onChange={e => setPrice(Number(e.target.value) || 0)} placeholder="15000"
              className="mt-1 mb-4 w-full border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm font-mono" />
            <button onClick={submitItem} className="btn-press w-full py-3 rounded-full bg-[#111] text-white text-sm font-semibold min-h-[44px]">Add to Menu</button>
          </div>
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6">
            <h2 className="font-semibold mb-4">Categories ({categories.length})</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(c => (
                <span key={c} className="px-3 py-1.5 rounded-full bg-stone-100 text-xs font-medium capitalize">{c}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category"
                className="flex-1 border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm" />
              <button onClick={submitCat} className="btn-press px-4 py-2.5 rounded-full bg-[#B45309] text-white text-sm font-semibold min-h-[44px]">Add</button>
            </div>
          </div>
        </aside>
      </main>
    </Shell>
  );
}
