"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  addItem: (item: {
    productId: string;
    slug: string;
    name: string;
    imageUrl: string;
    unitPrice: number;
    quantity?: number;
  }) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      addItem: (item) => {
        const qty = item.quantity ?? 1;
        set((s) => {
          const idx = s.items.findIndex((i) => i.productId === item.productId);
          if (idx >= 0) {
            const next = [...s.items];
            next[idx] = {
              ...next[idx],
              quantity: next[idx].quantity + qty,
            };
            return { items: next, drawerOpen: true };
          }
          return {
            items: [
              ...s.items,
              {
                productId: item.productId,
                slug: item.slug,
                name: item.name,
                imageUrl: item.imageUrl,
                unitPrice: item.unitPrice,
                quantity: qty,
              },
            ],
            drawerOpen: true,
          };
        });
      },
      removeItem: (productId) =>
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        })),
      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
    }),
    {
      name: "mary-mirari-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
}
