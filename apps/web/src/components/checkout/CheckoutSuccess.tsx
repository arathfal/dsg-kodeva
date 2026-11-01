// Owner-revised success panel; the only content visible after a successful
// simulation (the page headers are hidden by body[data-checkout-success]).
import { CATALOG_PATH } from "../../../../../shared/content.ts";
import type { MockOrderPayload } from "../../../../../shared/checkout.ts";
import { CheckIcon } from "../icons/CheckIcon";

export function CheckoutSuccess({ order }: { order: MockOrderPayload }) {
  return (
    <section
      className="mx-auto w-full max-w-130 bg-white px-6 py-10 text-center sm:px-10 sm:py-12"
      aria-labelledby="checkout-success-title"
    >
      <div
        className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-[#533afd]/10 text-[#533afd]"
        aria-hidden="true"
      >
        <CheckIcon size={28} strokeWidth={2.2} />
      </div>

      <h2
        id="checkout-success-title"
        className="mb-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
      >
        Checkout berhasil
      </h2>

      <p>
        Pesanan <strong>{order.orderId}</strong> atas{" "}
        <strong>{order.buyer.name}</strong> ({order.buyer.email}) berhasil
        dibuat
      </p>

      <a
        className="button mt-8 inline-flex min-h-11 items-center justify-center gap-2 px-6"
        href={CATALOG_PATH}
      >
        Kembali ke katalog
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </a>
    </section>
  );
}
