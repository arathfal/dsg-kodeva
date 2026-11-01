import type { ProductId } from "../../../../shared/content.ts";
import { useRemainingQuota } from "../lib/cart-store";

// R-023 shared-quota display on product pages: the reported remaining promo
// quota is the same value the add button validates against. SSR renders the
// fixture quota (no cart data on the server); after hydration the value
// accounts for the persisted cart exactly like the cart page (D-038/D-040).
export function QuotaLabel({
  productId,
  promoQuota,
}: {
  productId: ProductId;
  promoQuota: number;
}) {
  const remaining = useRemainingQuota(productId);
  return (
    <p
      className={
        promoQuota === 0 ? "font-semibold text-error" : "font-semibold"
      }
    >
      {promoQuota === 0
        ? "Kuota promo habis"
        : `Sisa kuota promo: ${remaining} lisensi`}
    </p>
  );
}
