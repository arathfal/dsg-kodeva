import { useState } from "react";
import {
  BILLING_PERIOD,
  packageNames,
  type PackageOffer,
} from "../../../../shared/catalog.ts";
import { Button } from "./Button";
import { formatRupiah } from "../lib/format";
import {
  ensureHydrated,
  useRemainingQuota,
  useCartStore,
} from "../lib/cart-store";
import { CART_PATH, type ProductId } from "../../../../shared/content.ts";

// Small hydration-only island: package selection updates the displayed price
// immediately (R-013) and "Tambah ke keranjang" adds the selected package with
// quantity 1 through the validated cart store (D-036/D-039).
export function PackageSelector({
  productId,
  productName,
  offers,
  priceId,
}: {
  productId: ProductId;
  productName: string;
  offers: PackageOffer[];
  priceId: string;
}) {
  const [selected, setSelected] = useState(offers[0].id);
  const offer = offers.find((item) => item.id === selected) ?? offers[0];
  const addItem = useCartStore((state) => state.addItem);
  const remaining = useRemainingQuota(productId);
  const [addStatus, setAddStatus] = useState<{
    ok: boolean;
    addedPackage: string | null;
    text: string;
  }>({ ok: true, addedPackage: null, text: "" });

  function handleAdd() {
    // Quota validation must see restored cart contents (D-038).
    ensureHydrated();
    const result = addItem(productId, selected);
    if (result.ok)
      setAddStatus({
        ok: true,
        addedPackage: selected,
        text: `Ditambahkan ke keranjang: 1 lisensi paket ${packageNames[selected]} ${productName}.`,
      });
    else if (result.reason === "over-quota")
      setAddStatus({
        ok: false,
        addedPackage: null,
        text:
          (result.maxAllowed ?? 0) <= 0
            ? `Kuota promo ${productName} sudah dipakai penuh di keranjang pada semua paketnya.`
            : `Sisa kuota promo ${productName} ${result.maxAllowed} lisensi; kurangi jumlah di keranjang atau pilih paket lain.`,
      });
    else
      setAddStatus({
        ok: false,
        addedPackage: null,
        text: "Penambahan tidak dapat diproses dengan data saat ini; keranjang tidak berubah.",
      });
  }

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
      <div className="space-y-2">
        <Button type="button" disabled={remaining === 0} onClick={handleAdd}>
          Tambah ke keranjang
        </Button>
        <p id={priceId} aria-live="polite">
          {!addStatus.ok && (
            <span className="text-sm text-error">{addStatus.text}</span>
          )}
          {addStatus.ok && addStatus.addedPackage && (
            <span className="text-sm text-success">
              {addStatus.text}{" "}
              <a className="font-semibold" href={CART_PATH}>
                Lihat keranjang
              </a>
            </span>
          )}
        </p>
        <noscript>
          <p className="text-sm text-secondary">
            Aktifkan JavaScript untuk menambah produk ke keranjang.
          </p>
        </noscript>
      </div>
    </div>
  );
}
