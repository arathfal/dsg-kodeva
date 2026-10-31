import { useState } from "react";
import {
  BILLING_PERIOD,
  packageNames,
  type PackageOffer,
} from "../../../../shared/catalog.ts";
import { formatRupiah } from "../lib/format";

// Small hydration-only island: package selection updates the displayed price
// immediately (R-013). Everything else on the page stays server-rendered.
export function PackageSelector({
  offers,
  priceId,
}: {
  offers: PackageOffer[];
  priceId: string;
}) {
  const [selected, setSelected] = useState(offers[0].id);
  const offer = offers.find((item) => item.id === selected) ?? offers[0];

  return (
    <div className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="font-semibold">Pilih paket</legend>
        <div className="grid gap-3">
          {offers.map((item) => (
            <label
              key={item.id}
              className="flex min-h-11 cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-input border border-border bg-canvas px-4 py-3 has-checked:border-primary has-checked:bg-soft"
            >
              <input
                type="radio"
                name="paket-kodeva"
                value={item.id}
                checked={selected === item.id}
                onChange={() => setSelected(item.id)}
                className="h-5 w-5 shrink-0"
              />
              <span className="font-semibold">{packageNames[item.id]}</span>
              {item.originalPrice !== undefined && (
                <s className="text-sm text-secondary">
                  {formatRupiah(item.originalPrice)}
                </s>
              )}
              <span className="ml-auto font-semibold text-ink tabular-nums">
                {formatRupiah(item.price)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-1">
        <p aria-live="polite" id={priceId} className="text-ink">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatRupiah(offer.price)}
          </span>
          <span className="block text-sm text-secondary">
            {offer.originalPrice !== undefined && (
              <s className="me-2">{formatRupiah(offer.originalPrice)}</s>
            )}
            <span> / {BILLING_PERIOD}</span>
          </span>
        </p>
        <p className="text-sm text-secondary">
          Harga tertulis adalah harga langganan tahunan dan berubah mengikuti
          paket yang dipilih.
        </p>
      </div>
    </div>
  );
}
