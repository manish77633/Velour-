import { createSlice } from '@reduxjs/toolkit';

const CART_KEY = 'velour_cart';

const calcTotals = (items) => {
  const totalQty   = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return { totalQty, totalPrice };
};

const saveToStorage = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:      [],
    totalQty:   0,
    totalPrice: 0,
    isOpen:     false,
  },
  reducers: {
    loadCartFromStorage: (state) => {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        state.items = JSON.parse(saved);
        Object.assign(state, calcTotals(state.items));
      }
    },

    addToCart: (state, action) => {
      const { product, size, color, qty = 1 } = action.payload;
      const key      = `${product._id}-${size}-${color}`;
      const existing = state.items.find((i) => i.key === key);

      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          key,
          productId: product._id,
          name:      product.name,
          image:     product.images?.[0] || '',
          price:     product.price,
          category:  product.category,
          size,
          color,
          qty,
        });
      }

      Object.assign(state, calcTotals(state.items));
      saveToStorage(state.items);
      state.isOpen = true;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.key !== action.payload);
      Object.assign(state, calcTotals(state.items));
      saveToStorage(state.items);
    },

    updateQty: (state, action) => {
      const { key, qty } = action.payload;
      const item = state.items.find((i) => i.key === key);
      if (item) {
        item.qty = Math.max(1, qty);
      }
      Object.assign(state, calcTotals(state.items));
      saveToStorage(state.items);
    },

    clearCart: (state) => {
      state.items      = [];
      state.totalQty   = 0;
      state.totalPrice = 0;
      localStorage.removeItem(CART_KEY);
    },

    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    openCart:   (state) => { state.isOpen = true; },
    closeCart:  (state) => { state.isOpen = false; },
  },
});

export const {
  loadCartFromStorage, addToCart, removeFromCart,
  updateQty, clearCart, toggleCart, openCart, closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
