// Read-only order summary shared by the checkout form view (R-016): amounts
// always come from a validated quote, never from persisted storage.
import { formatRupiah } from "../lib/format";
import type { CartLineView } from "../../../../shared/cart.ts";

export interface SummaryLine {
  productId: string;
  packageId: string;
  productName: string;
  packageName: string;
  unitLabel: string;
  unitPrice: number;
  originalPrice?: number;
  qty: number;
  lineTotal: number;
}

export function lineToSummary(view: CartLineView): SummaryLine {
  return {
    productId: view.productId,
    packageId: view.packageId,
    productName: view.productName,
    packageName: view.packageName,
    unitLabel: view.unitLabel,
    unitPrice: view.unitPrice,
    originalPrice: view.originalPrice,
    qty: view.qty,
    lineTotal: view.lineTotal,
  };
}

export function OrderSummaryLines({ lines }: { lines: SummaryLine[] }) {
  return (
    <ul className="divide-y divide-border text-sm">
      {lines.map((line) => (
        <li
          key={`${line.productId}-${line.packageId}`}
          className="py-3 first:pt-0 last:pb-0"
        >
          <div className="flex items-baseline justify-between gap-x-3 gap-y-1">
            <p className="min-w-0 font-semibold">
              {line.productName}{" "}
              <span className="font-normal text-secondary">
                ({line.packageName})
              </span>
            </p>
            <p className="font-semibold whitespace-nowrap tabular-nums">
              {formatRupiah(line.lineTotal)}
            </p>
          </div>
          <p className="mt-1 text-secondary">
            {line.qty} × {formatRupiah(line.unitPrice)} · {line.unitLabel}
          </p>
          {line.originalPrice !== undefined && (
            <p className="text-xs text-secondary tabular-nums">
              <span className="me-1">Normal</span>
              <s>{formatRupiah(line.originalPrice)}</s>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
