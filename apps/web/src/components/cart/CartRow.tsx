import { useState, type KeyboardEvent } from "react";

import { formatRupiah } from "../../lib/format";
import { useCartStore } from "../../stores/cart-store";
import { getCatalogEntry } from "../../../../../shared/catalog.ts";
import {
  MAX_LINE_QTY,
  quantityInCart,
  type CartLineView,
} from "../../../../../shared/cart.ts";

// Logika edit jumlah dipisah dari tampilan agar CartRow hanya mengurus layout.
// Draft tetap bisa diedit sampai blur/Enter; store adalah sumber kebenaran.
function useQuantityEditor(view: CartLineView) {
  const lines = useCartStore((state) => state.lines);
  const changeQuantity = useCartStore((state) => state.changeQuantity);
  const removeLine = useCartStore((state) => state.removeLine);

  const [edit, setEdit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const draft = edit ?? String(view.qty);

  const entry = getCatalogEntry(view.productId);
  const maxAllowed = entry
    ? Math.max(
        entry.promoQuota - (quantityInCart(lines, view.productId) - view.qty),
        0,
      )
    : view.qty;
  const remainingAfter = Math.max(maxAllowed - view.qty, 0);

  function commit(raw: string) {
    const parsed = Number(raw);
    if (raw.trim() === "" || Number.isNaN(parsed)) {
      setError(
        `Jumlah lisensi harus bilangan bulat 1 sampai ${MAX_LINE_QTY}. Nilai di keranjang tetap ${view.qty}.`,
      );
      setEdit(String(view.qty));
      return;
    }

    const result = changeQuantity(view.productId, view.packageId, parsed);
    if (result.ok) {
      setEdit(null);
      setError(null);
      return;
    }

    if (result.reason === "over-quota" && result.maxAllowed !== undefined) {
      setError(
        result.maxAllowed === 0
          ? `Kuota promo ${view.productName} sudah terpakai penuh oleh paket lain dalam keranjang.`
          : `Kuota promo ${view.productName} dipakai bersama oleh semua paket: paket ${view.packageName} maksimal ${result.maxAllowed} lisensi.`,
      );
      setEdit(String(view.qty));
      return;
    }

    if (result.reason === "invalid-quantity") {
      setError(
        `Jumlah lisensi harus bilangan bulat 1 sampai ${MAX_LINE_QTY}. Nilai di keranjang tetap ${view.qty}.`,
      );
      setEdit(String(view.qty));
      return;
    }

    setError(
      "Perubahan tidak dapat diterapkan dengan data saat ini; jumlah sebelumnya tetap dipakai.",
    );
    setEdit(String(view.qty));
  }

  function step(delta: number) {
    const result = changeQuantity(
      view.productId,
      view.packageId,
      view.qty + delta,
    );
    if (result.ok) {
      setEdit(null);
      setError(null);
      return;
    }

    if (result.reason === "over-quota") {
      setError(
        `Sisa kuota ${view.productName} tidak mencukupi: paket ${view.packageName} maksimal ${maxAllowed} lisensi.`,
      );
    } else {
      setError(
        "Perubahan tidak dapat diterapkan; jumlah sebelumnya tetap dipakai.",
      );
    }
    setEdit(String(view.qty));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    commit(event.currentTarget.value);
  }

  function remove() {
    removeLine(view.productId, view.packageId);
    setError(null);
  }

  return {
    draft,
    error,
    maxAllowed,
    remainingAfter,
    setEdit,
    commit,
    step,
    onKeyDown,
    remove,
  };
}

// Susunan baris (mobile → desktop sama):
//   [ Nama produk · paket · lisensi ]            [ Total ]
//   [ Harga / lisensi ]            [ Stepper jumlah ]
//   [ Sisa kuota ]                         [ Hapus ]
export function CartRow({ view }: { view: CartLineView }) {
  const {
    draft,
    error,
    maxAllowed,
    remainingAfter,
    setEdit,
    commit,
    step,
    onKeyDown,
    remove,
  } = useQuantityEditor(view);

  const inputId = `qty-${view.productId}-${view.packageId}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-4 px-5 py-6 md:px-8">
      {/* Baris 1: identitas produk (kiri) dan total baris (kanan) */}
      <div className="min-w-0">
        <h3 className="text-lg leading-snug font-semibold tracking-tight">
          {view.productName}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="rounded-full bg-canvas px-3 py-1 text-xs font-medium text-secondary">
            Paket {view.packageName}
          </span>
          <span className="text-sm text-secondary">
            Lisensi {view.unitLabel}
          </span>
        </div>
      </div>

      <div className="text-right">
        <p className="sr-only">Total produk</p>
        <p className="text-xl font-semibold tracking-tight whitespace-nowrap tabular-nums">
          {formatRupiah(view.lineTotal)}
        </p>
      </div>

      {/* Baris 2: harga satuan (kiri) dan kontrol jumlah (kanan) */}
      <div className="col-span-2 flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium text-secondary">
            Harga / lisensi / tahun
          </p>
          <p className="text-base font-semibold tracking-tight whitespace-nowrap tabular-nums">
            {formatRupiah(view.unitPrice)}
          </p>
          {view.originalPrice !== undefined && (
            <p className="mt-1 text-xs text-secondary tabular-nums">
              <span className="me-1">Normal</span>
              <s>{formatRupiah(view.originalPrice)}</s>
            </p>
          )}
        </div>

        <div className="min-w-0">
          <label
            htmlFor={inputId}
            className="mb-2 block text-xs font-medium text-secondary"
          >
            Jumlah lisensi
          </label>
          <div className="inline-flex items-center overflow-hidden rounded-lg border border-border bg-white">
            <button
              type="button"
              className="flex h-11 w-11 cursor-pointer items-center justify-center text-xl font-medium transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => step(-1)}
              disabled={view.qty <= 1}
              aria-label={`Kurangi jumlah lisensi ${view.productName} paket ${view.packageName}`}
            >
              −
            </button>
            <input
              id={inputId}
              className="h-11 w-12 min-w-0 [appearance:textfield] border-x border-border bg-transparent px-1 text-center text-sm font-semibold tabular-nums outline-offset-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              type="number"
              inputMode="numeric"
              min={1}
              max={Math.min(maxAllowed, MAX_LINE_QTY)}
              value={draft}
              onChange={(event) => setEdit(event.target.value)}
              onKeyDown={onKeyDown}
              onBlur={(event) => commit(event.target.value)}
              aria-invalid={error !== null}
              aria-describedby={`${helpId}${error ? ` ${errorId}` : ""}`}
            />
            <button
              type="button"
              className="flex h-11 w-11 cursor-pointer items-center justify-center text-xl font-medium transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => step(1)}
              disabled={remainingAfter <= 0 || view.qty >= MAX_LINE_QTY}
              aria-label={`Tambah jumlah lisensi ${view.productName} paket ${view.packageName}`}
            >
              +
            </button>
          </div>
          {error && (
            <p
              id={errorId}
              role="alert"
              className="mt-2 max-w-64 text-xs text-error"
            >
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Baris 3: info kuota (kiri) dan aksi hapus (kanan) */}
      <div className="col-span-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border pt-4">
        <span id={helpId} className="text-xs text-secondary">
          Sisa kuota promo: {remainingAfter} lisensi
        </span>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center text-xs font-medium text-secondary underline-offset-4 transition-colors hover:text-error hover:underline focus-visible:underline"
          onClick={remove}
          aria-label={`Hapus ${view.productName} paket ${view.packageName} dari keranjang`}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}
