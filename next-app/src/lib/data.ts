export const products = [
  { id: 1, name: 'Iced Latte', category: 'coffee', price: 14000 },
  { id: 2, name: 'Hot Latte', category: 'coffee', price: 12000 },
  { id: 3, name: 'Cold Brew', category: 'coffee', price: 14000 },
  { id: 4, name: 'Espresso', category: 'coffee', price: 10000 },
  { id: 5, name: 'Americano', category: 'coffee', price: 11000 },
  { id: 6, name: 'Caramel Macchiato', category: 'coffee', price: 15000 },
  { id: 7, name: 'Vanilla Latte', category: 'coffee', price: 14000 },
  { id: 8, name: 'Matcha Latte', category: 'coffee', price: 16000 },
  { id: 9, name: 'Mocha', category: 'coffee', price: 15000 },
  { id: 10, name: 'Thai Tea', category: 'tea', price: 12000 },
  { id: 11, name: 'Green Tea', category: 'tea', price: 10000 },
  { id: 12, name: 'Chai Latte', category: 'tea', price: 13000 },
  { id: 13, name: 'Iced Lemon Tea', category: 'tea', price: 11000 },
  { id: 14, name: 'Croissant', category: 'snack', price: 14000 },
  { id: 15, name: 'Chocolate Brownie', category: 'snack', price: 12000 },
  { id: 16, name: 'Cheese Cake', category: 'snack', price: 13000 },
  { id: 17, name: 'Egg Sandwich', category: 'snack', price: 18000 },
  { id: 18, name: 'Tuna Sandwich', category: 'snack', price: 19000 },
];

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  method: 'cash' | 'qris' | 'transfer' | 'card';
  notes?: string;
  time: string;
}
