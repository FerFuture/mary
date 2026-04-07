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
  maxQuantity?: number;
  /** Clave de color (minúsculas); vacío si no aplica. */
  colorKey: string;
  /** Texto visible (ej. Dorado). */
  colorLabel: string;
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
    colorKey?: string;
    colorLabel?: string;
  }) => void;
  removeItem: (productId: string, colorKey?: string) => void;
  setQuantity: (productId: string, quantity: number, colorKey?: string) => void;
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

  let rows = ps.items as unknown[];

  if (version === 0) {
    rows = rows.map((raw) => {
      if (!raw || typeof raw !== "object") return raw;
      const row = raw as Record<string, unknown>;
      if (typeof row.maxQuantity === "number") return row;
      const legacy = row.maxStock;
      if (typeof legacy === "number") {
        const { maxStock: legacyMax, ...rest } = row;
        void legacyMax;
        return { ...rest, maxQuantity: legacy };
      }
      return row;
    });
  }

  const items: CartItem[] = rows.map((raw) => {
    if (!raw || typeof raw !== "object") {
      return raw as CartItem;
    }
    const row = raw as Record<string, unknown>;
    return {
      productId: String(row.productId ?? ""),
      slug: String(row.slug ?? ""),
      name: String(row.name ?? ""),
      imageUrl: String(row.imageUrl ?? ""),
      unitPrice: Number(row.unitPrice ?? 0),
      quantity: Number(row.quantity ?? 0),
      maxQuantity:
        typeof row.maxQuantity === "number" ? row.maxQuantity : undefined,
      colorKey: typeof row.colorKey === "string" ? row.colorKey : "",
      colorLabel: typeof row.colorLabel === "string" ? row.colorLabel : "",
    };
  });

  return { items };
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
        const colorKey = item.colorKey ?? "";
        const colorLabel = item.colorLabel ?? "";
        set((s) => {
          const idx = s.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              (i.colorKey ?? "") === colorKey,
          );
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
                colorKey,
                colorLabel,
              },
            ],
            drawerOpen: true,
          };
        });
      },
      removeItem: (productId, colorKey = "") =>
        set((s) => ({
          items: s.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                (i.colorKey ?? "") === colorKey
              ),
          ),
        })),
      setQuantity: (productId, quantity, colorKey = "") => {
        if (quantity < 1) {
          get().removeItem(productId, colorKey);
          return;
        }
        set((s) => {
          const i = s.items.find(
            (x) =>
              x.productId === productId &&
              (x.colorKey ?? "") === colorKey,
          );
          if (!i) return s;
          const max = i.maxQuantity;
          const q = max !== undefined ? Math.min(quantity, max) : quantity;
          if (q < 1) {
            return {
              items: s.items.filter(
                (x) =>
                  !(
                    x.productId === productId &&
                    (x.colorKey ?? "") === colorKey
                  ),
              ),
            };
          }
          return {
            items: s.items.map((x) =>
              x.productId === productId &&
              (x.colorKey ?? "") === colorKey
                ? { ...x, quantity: q }
                : x,
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
      version: 2,
      migrate: migrateCartPersist,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
}
