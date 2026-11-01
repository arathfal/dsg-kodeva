import { formatRupiah } from "../lib/format";
import { useCartHydration, useCartStore } from "../lib/cart-store";
import { quoteCart } from "../../../../shared/cart.ts";
import { CATALOG_PATH, CHECKOUT_PATH } from "../../../../shared/content.ts";
import { CartRow } from "./CartRow";
import { NoticeList, cartRecoveryNotices } from "./CartNotices";

// Cart amounts are always recomputed from current catalog data (D-038).
// Hydration and recovery states stay distinct from an empty cart.
export function CartView() {
  useCartHydration();

  const hydrated = useCartStore((state) => state.hydrated);
  const recovery = useCartStore((state) => state.recovery);
  const restoreSkipped = useCartStore((state) => state.restoreSkipped);
  const storageDenied = useCartStore((state) => state.storageDenied);
  const lines = useCartStore((state) => state.lines);
  const quote = quoteCart(lines);

  if (!hydrated) {
    return (
      <p className="panel max-w-prose" role="status">
        Memuat keranjang…
      </p>
    );
  }

  const notices = cartRecoveryNotices({
    recovery,
    restoreSkipped,
    storageDenied,
  });

  if (!quote.ok) {
    return <CartBroken />;
  }

  if (quote.lines.length === 0) {
    return (
      <div className="space-y-4">
        {notices.length > 0 && <NoticeList notices={notices} />}
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notices.length > 0 && <NoticeList notices={notices} />}

      {/* Dua kolom di layar besar: daftar item di kiri, ringkasan sticky di kanan.
          Di layar kecil keduanya bertumpuk dengan ringkasan di bawah daftar. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section
          className="panel overflow-hidden p-0"
          aria-labelledby="cart-items-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-5 md:px-8">
            <div>
              <h2 id="cart-items-title" className="text-lg font-semibold">
                Ringkasan keranjang
              </h2>
              <p className="mt-1 text-sm text-secondary">
                {quote.lines.length} paket · {quote.itemCount} lisensi
              </p>
            </div>
            <a
              href={CATALOG_PATH}
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              + Tambah produk
            </a>
          </div>

          <ul className="divide-y divide-border">
            {quote.lines.map((view) => (
              <li key={`${view.productId}-${view.packageId}`}>
                <CartRow view={view} />
              </li>
            ))}
          </ul>
        </section>

        <aside
          className="panel space-y-4 lg:sticky lg:top-6"
          aria-labelledby="cart-summary-title"
        >
          <div>
            <h2 id="cart-summary-title" className="font-semibold">
              Subtotal
            </h2>
            <p className="mt-1 text-sm text-secondary">
              {quote.itemCount} lisensi · Langganan tahunan
            </p>
          </div>
          <p className="border-t border-border pt-4 text-3xl font-bold tracking-tight tabular-nums">
            {formatRupiah(quote.total)}
          </p>
          <p className="text-xs text-secondary">
            Harga mengikuti katalog terbaru.
          </p>
          <a className="button w-full" href={CHECKOUT_PATH}>
            Lanjut ke pembayaran
          </a>
        </aside>
      </div>
    </div>
  );
}

function CartBroken() {
  return (
    <section
      className="panel max-w-prose space-y-4"
      aria-labelledby="cart-broken-title"
    >
      <h2 id="cart-broken-title" className="text-section font-semibold">
        Keranjang tidak dapat ditampilkan
      </h2>
      <p>
        Ada item yang tidak cocok dengan data saat ini. Segarkan halaman; bila
        masih berlanjut, hapus data situs ini di pengaturan browser.
      </p>
      <a className="button" href={CATALOG_PATH}>
        Buka katalog
      </a>
    </section>
  );
}

function CartEmpty() {
  return (
    <section
      className="panel max-w-prose space-y-4"
      aria-labelledby="cart-empty-title"
    >
      <h2 id="cart-empty-title" className="text-section font-semibold">
        Keranjang masih kosong
      </h2>
      <p className="text-secondary">
        Pilih aplikasi dan paket langganan di katalog, lalu tambahkan ke
        keranjang.
      </p>
      <a className="button" href={CATALOG_PATH}>
        Buka katalog
      </a>
    </section>
  );
}
