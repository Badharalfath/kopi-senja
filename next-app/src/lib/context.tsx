'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products, CartItem, Order, Product } from '@/lib/data';

type Role = 'owner' | 'cashier';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 19) return 'Selamat sore';
  return 'Selamat malam';
}

interface AppState {
  user: SessionUser | null;
  authLoading: boolean;
  greeting: string;
  logout: () => Promise<void>;
  role: Role;
  cart: CartItem[];
  addItem: (id: number) => void;
  incItem: (id: number) => void;
  decItem: (id: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (input: { items: CartItem[]; method: 'cash' | 'qris' | 'transfer' | 'card'; cashGiven?: number; notes?: string }) => Promise<Order>;
  discountPct: number;
  applyDiscount: (p: number) => void;
  clearDiscount: () => void;
  notes: string;
  setNotes: (s: string) => void;
  shiftOpen: boolean;
  openShift: () => void;
  closeShift: () => void;
  openingCash: number;
  closingCash: number;
  category: string;
  setCategory: (c: string) => void;
  menuItems: Product[];
  categories: string[];
  addMenuItem: (name: string, category: string, price: number) => void;
  removeMenuItem: (id: number) => void;
  addCategory: (name: string) => void;
  setOpeningCash: (v: number) => void;
  setClosingCash: (v: number) => void;
}

const Context = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [greeting, setGreeting] = useState(() => greetingFor());
  const role: Role = user?.role ?? 'cashier';
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discountPct, setDiscountPct] = useState(0);
  const [notes, setNotesState] = useState('');
  const [shiftOpen, setShiftOpen] = useState(false);
  const [openingCash, setOpeningCashState] = useState(0);
  const [closingCash, setClosingCashState] = useState(0);
  const [category, setCategoryState] = useState('all');
  const [menuItems, setMenuItems] = useState<Product[]>(products);
  const [categories, setCategories] = useState<string[]>(['coffee', 'tea', 'snack']);

  const refreshMenu = async () => {
    try {
      const r = await fetch('/api/menu');
      if (!r.ok) return;
      const d = await r.json();
      const cats = (d.categories ?? []) as { id: number; name: string; products: { id: number; name: string; price: number }[] }[];
      setCategories(cats.map((x) => x.name));
      setMenuItems(cats.flatMap((x) => x.products.map((pr) => ({ ...pr, category: x.name }))));
    } catch {}
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setUser(d?.user ?? null);
        if (d?.user) { refreshMenu(); refreshOrders(); }
      })
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
    setGreeting(greetingFor());
    const saved = localStorage.getItem('kopi-senja-state');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.cart) setCart(s.cart);


      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kopi-senja-state', JSON.stringify({ role, cart, discountPct }));
  }, [role, cart, discountPct]);

  const addItem = (id: number) => {
    const p = menuItems.find(x => x.id === id);
    if (!p) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };

  const incItem = (id: number) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c));
  const decItem = (id: number) => setCart(prev => {
    const next = prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0);
    return next;
  });
  const clearCart = () => setCart([]);

  const refreshOrders = async () => {
    try {
      const r = await fetch('/api/orders');
      if (r.status === 401) { window.location.href = '/login'; return; }
      if (!r.ok) return;
      const d = await r.json();
      setOrders(d.orders ?? []);
    } catch {}
  };

  const addOrder = async (input: { items: CartItem[]; method: 'cash' | 'qris' | 'transfer' | 'card'; cashGiven?: number; notes?: string }) => {
    const r = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: input.items.map((i) => ({ productId: i.id, qty: i.qty })),
        discountPct,
        method: input.method,
        cashGiven: input.cashGiven,
        notes: input.notes,
      }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Gagal menyimpan order.');
    const order = d.order as Order;
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const openShift = () => { setShiftOpen(true); setOpeningCashState(500000); };
  const closeShift = () => setShiftOpen(false);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    window.location.href = '/login';
  };

  const value: AppState = {
    user, authLoading, greeting, logout,
    role,
    cart, addItem, incItem, decItem, clearCart,
    orders, addOrder,
    discountPct, applyDiscount: setDiscountPct, clearDiscount: () => setDiscountPct(0),
    notes, setNotes: setNotesState,
    shiftOpen, openShift, closeShift, openingCash, closingCash, setOpeningCash: setOpeningCashState, setClosingCash: setClosingCashState,
    category, setCategory: setCategoryState,
    menuItems, categories,
    addMenuItem: (name: string, cat: string, price: number) => {
      fetch('/api/menu/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category: cat, price }),
      })
        .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
        .then(({ ok, d }) => {
          if (ok && d.product) {
            setMenuItems((prev) => [...prev, d.product]);
            setCategories((prev) => (prev.includes(d.product.category) ? prev : [...prev, d.product.category]));
          } else {
            alert(d.error || 'Gagal menambah item.');
          }
        })
        .catch(() => alert('Tidak bisa menghubungi server.'));
    },
    removeMenuItem: (id: number) => {
      const prev = menuItems;
      setMenuItems((xs) => xs.filter((p) => p.id !== id));
      fetch(`/api/menu/products/${id}`, { method: 'DELETE' }).catch(() => setMenuItems(prev));
    },
    addCategory: (name: string) => {
      fetch('/api/menu/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
        .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
        .then(({ ok, d }) => {
          if (ok && d.category) {
            setCategories((prev) => (prev.includes(d.category.name) ? prev : [...prev, d.category.name]));
          } else {
            alert(d.error || 'Gagal menambah kategori.');
          }
        })
        .catch(() => alert('Tidak bisa menghubungi server.'));
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
