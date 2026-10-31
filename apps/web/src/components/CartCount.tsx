import {
  useCartHydration,
  useCartQuantity,
  useCartStore,
} from "../lib/cart-store";

// D-040: tiny header island; the server render keeps the icon-only link and
// the count appears after hydration (or not at all when storage is denied).
export function CartCount() {
  useCartHydration();
  const hydrated = useCartStore((state) => state.hydrated);
  const count = useCartQuantity();
  if (!hydrated || count === 0) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute top-0.5 right-0 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-sm font-semibold text-canvas"
    >
      {count}
    </span>
  );
}
