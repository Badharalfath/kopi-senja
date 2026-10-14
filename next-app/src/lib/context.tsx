'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products, CartItem, Order, Product } from '@/lib/data';

type Role = 'owner' | 'cashier';

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  cart: CartItem[];
  addItem: (id: number) => void;
  incItem: (id: number) => void;
  decItem: (id: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (o: Order) => void;
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
  const [role, setRoleState] = useState<Role>('cashier');
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

  useEffect(() => {
    const saved = localStorage.getItem('kopi-senja-state');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.cart) setCart(s.cart);
        if (s.orders) setOrders(s.orders.map((o: Order) =>
          o.method === 'cash' && typeof o.cashGiven !== 'number'
            ? { ...o, cashGiven: o.total, change: 0 }
            : o
        ));
        if (s.role) setRoleState(s.role);
        if (s.menuItems) setMenuItems(s.menuItems);
        if (s.categories) setCategories(s.categories);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kopi-senja-state', JSON.stringify({ role, cart, orders, discountPct, shiftOpen, openingCash, closingCash, menuItems, categories }));
  }, [role, cart, orders, discountPct, shiftOpen, openingCash, closingCash, menuItems, categories]);

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

  const addOrder = (o: Order) => setOrders(prev => [o, ...prev]);

  const openShift = () => { setShiftOpen(true); setOpeningCashState(500000); };
  const closeShift = () => setShiftOpen(false);

  const value: AppState = {
    role, setRole: setRoleState,
    cart, addItem, incItem, decItem, clearCart,
    orders, addOrder,
    discountPct, applyDiscount: setDiscountPct, clearDiscount: () => setDiscountPct(0),
    notes, setNotes: setNotesState,
    shiftOpen, openShift, closeShift, openingCash, closingCash, setOpeningCash: setOpeningCashState, setClosingCash: setClosingCashState,
    category, setCategory: setCategoryState,
    menuItems, categories,
    addMenuItem: (name: string, cat: string, price: number) => {
      setMenuItems(prev => [...prev, { id: Math.max(0, ...prev.map(p => p.id)) + 1, name, category: cat, price }]);
    },
    removeMenuItem: (id: number) => setMenuItems(prev => prev.filter(p => p.id !== id)),
    addCategory: (name: string) => {
      const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
      if (!slug) return;
      setCategories(prev => (prev.includes(slug) ? prev : [...prev, slug]));
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
