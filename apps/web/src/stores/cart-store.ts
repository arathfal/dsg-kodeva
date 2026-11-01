// Cart store on Zustand. Every mutation revalidates
// against the approved catalog fixtures through shared/cart.ts, prices are
// recomputed at render time (never read from storage), and rehydration is
// explicit so restored data never silently overwrites in-session changes.
import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CART_STORAGE_KEY,
  CART_STORAGE_VERSION,
  addCartLine,
  quantityInCart,
  recoverPersistedCart,
  removeCartLine,
  setCartQuantity,
  type CartLine,
  type CartQuantityResult,
  type CartRecovery,
  type PackageId,
  type ProductId,
} from "../../../../shared/cart.ts";
import { getCatalogEntry } from "../../../../shared/catalog.ts";
import { isRecord } from "../../../../shared/content.ts";

interface CartStore {
  lines: CartLine[];
  /** False until the islands explicitly restore persisted data. */
  hydrated: boolean;
  /** True once an in-session mutation happened before rehydration. */
  mutated: boolean;
  recovery: CartRecovery | null;
  restoreSkipped: boolean;
  /** Persisted contents could not be read (denied/broken local storage). */
  storageDenied: boolean;
  addItem(productId: ProductId, packageId: PackageId): CartQuantityResult;
  changeQuantity(
    productId: ProductId,
    packageId: PackageId,
    qty: number,
  ): CartQuantityResult;
  removeLine(productId: ProductId, packageId: PackageId): CartQuantityResult;
  /** Empties the cart after a successful simulated payment. */
  clearCart(): void;
}

// Set by the persist post-rehydration callback; read right after the
// synchronous rehydration call inside ensureHydrated().
let rehydrationFailed = false;

// skipHydration keeps the server render deterministic; each island calls
// ensureHydrated() on mount to restore persisted lines explicitly.
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      mutated: false,
      recovery: null,
      restoreSkipped: false,
      storageDenied: false,
      addItem: (productId, packageId) => {
        const result = addCartLine(get().lines, productId, packageId, 1);
        if (result.ok) set({ lines: result.lines, mutated: true });
        return result;
      },
      changeQuantity: (productId, packageId, qty) => {
        const result = setCartQuantity(get().lines, productId, packageId, qty);
        if (result.ok) set({ lines: result.lines, mutated: true });
        return result;
      },
      removeLine: (productId, packageId) => {
        const result = removeCartLine(get().lines, productId, packageId);
        if (result.ok) set({ lines: result.lines, mutated: true });
        return result;
      },
      // Empties the cart only after a successful simulated payment;
      // mutationState:true keeps the persisted payload in sync (version 1).
      clearCart: () => {
        set({ lines: [], mutated: true });
      },
    }),
    {
      name: CART_STORAGE_KEY,
      version: CART_STORAGE_VERSION,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state): { lines: CartLine[] } => ({ lines: state.lines }),
      // Old or versioned-off payloads reach merge as-is, marked below so
      // recovery can report an empty cart with a visible notice.
      migrate: (persisted) => ({
        legacy: true,
        ...(isRecord(persisted) ? persisted : {}),
      }),
      merge: (persisted, current) => {
        if (current.mutated) {
          // In-session changes came first; restore never overwrites them.
          return { ...current, restoreSkipped: true };
        }
        const recovered = recoverPersistedCart(persisted, {
          legacy: isRecord(persisted) && persisted.legacy === true,
        });
        return { ...current, ...recovered };
      },
      onRehydrateStorage: () => (state, error) => {
        rehydrationFailed = error !== undefined && error !== null;
        void state;
      },
    },
  ),
);

const persistApi = (
  useCartStore as unknown as {
    persist?: { rehydrate: () => unknown };
  }
).persist;

/**
 * Restores persisted cart contents once per island and only into the client;
 * called from a mount effect so hydration never races the server render.
 * Runs synchronously for the browser JSON storage used here.
 */
export function ensureHydrated(): void {
  const current = useCartStore.getState();
  if (current.hydrated) return;
  let denied = persistApi === undefined;
  if (persistApi) {
    rehydrationFailed = false;
    try {
      persistApi.rehydrate();
      denied = rehydrationFailed;
    } catch {
      denied = true;
    }
  }
  useCartStore.setState({
    hydrated: true,
    storageDenied: denied || current.storageDenied,
  });
}

/** Rehydrates the cart once at first client render; returns nothing to render. */
export function useCartHydration(): void {
  useEffect(() => {
    ensureHydrated();
  }, []);
}

export function useCartQuantity(): number {
  return useCartStore((state) =>
    state.lines.reduce<number>((sum, line) => sum + line.qty, 0),
  );
}

/**
 * Remaining shared promo licenses of a product across the whole cart; callers
 * guarantee a known product id, so unknown products report zero quota.
 */
export function useRemainingQuota(productId: ProductId): number {
  return useCartStore((state) => {
    const quota = getCatalogEntry(productId)?.promoQuota ?? 0;
    return Math.max(quota - quantityInCart(state.lines, productId), 0);
  });
}
