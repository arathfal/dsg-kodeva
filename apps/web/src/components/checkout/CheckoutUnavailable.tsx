// Direct /checkout with an empty or broken cart cannot submit anything:
// this state explains why and offers the katalog/keranjang exits.
import { CATALOG_PATH, CART_PATH } from "../../../../../shared/content.ts";

export function CheckoutUnavailable({ broken }: { broken: boolean }) {
  return (
    <section
      className="panel max-w-prose space-y-4"
      aria-labelledby="checkout-unavailable-title"
    >
      <h2
        id="checkout-unavailable-title"
        className="text-section font-semibold"
      >
        Checkout tidak tersedia
      </h2>
      <p className="text-secondary">
        {broken
          ? "Isi keranjang tidak cocok dengan data saat ini, sehingga tidak dapat dibayar. Segarkan halaman untuk memuat ulang keranjang."
          : "Keranjang masih kosong, sehingga tidak ada yang bisa dibayar. Ini normal setelah pembayaran berhasil, karena keranjang dikosongkan."}
      </p>
      <div className="flex flex-wrap gap-3">
        <a className="button" href={CATALOG_PATH}>
          Buka katalog
        </a>
        <a
          className="button bg-canvas text-ink ring-1 ring-border"
          href={CART_PATH}
        >
          Buka keranjang
        </a>
      </div>
    </section>
  );
}
