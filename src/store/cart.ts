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
  /** Tope de unidades (no exponer como inventario en la UI). */
  maxQuantity?: number;
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
    maxQuantity?: number;
  }) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

type PersistedCartSlice = Pick<CartState, "items">;

function migrateCartPersist(
  persistedState: unknown,
  version: number,
): PersistedCartSlice {
  const empty: PersistedCartSlice = { items: [] };
  if (!persistedState || typeof persistedState !== "object") return empty;
  const ps = persistedState as { items?: unknown };
  if (!Array.isArray(ps.items)) return empty;

  if (version !== 0) {
    return { items: ps.items as CartItem[] };
  }

  return {
    items: ps.items.map((raw) => {
      if (!raw || typeof raw !== "object") return raw as CartItem;
      const row = raw as Record<string, unknown>;
      if (typeof row.maxQuantity === "number") return row as unknown as CartItem;
      const legacy = row.maxStock;
      if (typeof legacy === "number") {
        const { maxStock: _m, ...rest } = row;
        return { ...rest, maxQuantity: legacy } as CartItem;
      }
      return row as unknown as CartItem;
    }),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      addItem: (item) => {
        const qty = item.quantity ?? 1;
        const cap =
          item.maxQuantity !== undefined
            ? Math.max(0, item.maxQuantity)
            : undefined;
        set((s) => {
          const idx = s.items.findIndex((i) => i.productId === item.productId);
          if (idx >= 0) {
            const next = [...s.items];
            const row = next[idx];
            const max = cap ?? row.maxQuantity;
            let merged = row.quantity + qty;
            if (max !== undefined) merged = Math.min(merged, max);
            if (merged < 1) {
              next.splice(idx, 1);
              return { items: next, drawerOpen: true };
            }
            next[idx] = {
              ...row,
              quantity: merged,
              maxQuantity: max ?? row.maxQuantity,
            };
            return { items: next, drawerOpen: true };
          }
          const initial = cap !== undefined ? Math.min(qty, cap) : qty;
          if (cap !== undefined && initial < 1) {
            return { drawerOpen: true };
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
                quantity: Math.max(1, initial),
                maxQuantity: cap,
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
        set((s) => {
          const i = s.items.find((x) => x.productId === productId);
          if (!i) return s;
          const max = i.maxQuantity;
          const q = max !== undefined ? Math.min(quantity, max) : quantity;
          if (q < 1) {
            return {
              items: s.items.filter((x) => x.productId !== productId),
            };
          }
          return {
            items: s.items.map((x) =>
              x.productId === productId ? { ...x, quantity: q } : x,
            ),
          };
        });
      },
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
    }),
    {
      name: "mary-mirari-cart",
      version: 1,
      migrate: migrateCartPersist,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
}
