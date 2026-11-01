import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { formatRupiah } from "../lib/format";
import { useCartHydration, useCartStore } from "../lib/cart-store";
import { pushAnalyticsEvent, readTouch } from "../lib/analytics";
import { quoteCart } from "../../../../shared/cart.ts";
import { BILLING_PERIOD } from "../../../../shared/catalog.ts";
import {
  buildMockOrder,
  validateBuyer,
  type BuyerErrors,
  type MockOrderPayload,
  type SimulationResult,
} from "../../../../shared/checkout.ts";
import { NoticeList, cartRecoveryNotices } from "./CartNotices";
import { OrderSummaryLines, lineToSummary } from "./CheckoutSummary";
import { BuyerForm, FormFeedback } from "./CheckoutForm";
import { CheckoutSuccess } from "./CheckoutSuccess";
import { CheckoutUnavailable } from "./CheckoutUnavailable";

// D-042/D-044: the pending window makes the simulated processing state visible
// and blocks duplicate submissions; no network request or gateway is involved.
const SIMULATION_DELAY_MS = 900;

interface PaymentResult {
  outcome: SimulationResult;
  order: MockOrderPayload;
}

export function CheckoutView() {
  useCartHydration();

  const hydrated = useCartStore((state) => state.hydrated);
  const recovery = useCartStore((state) => state.recovery);
  const restoreSkipped = useCartStore((state) => state.restoreSkipped);
  const storageDenied = useCartStore((state) => state.storageDenied);
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const quote = quoteCart(lines);

  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // T08 (D-047): begin_checkout is reported once per /checkout page load when
  // the restored cart is valid and nonempty; rerenders, later quantity edits,
  // a failed-payment retry and empty/broken carts never (re)fire it.
  const checkoutReported = useRef(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<BuyerErrors>({});
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (checkoutReported.current) return;
    if (!hydrated || !quote.ok || quote.lines.length === 0) return;
    checkoutReported.current = true;
    pushAnalyticsEvent({
      event: "begin_checkout",
      ecommerce: {
        currency: "IDR",
        value: quote.total,
        items: quote.lines.map((line) => ({
          item_id: line.productId,
          item_name: line.productName,
          item_variant: line.packageId,
          price: line.unitPrice,
          quantity: line.qty,
        })),
      },
      utm: readTouch(),
    });
  }, [hydrated, quote]);

  // A pending simulation never leaks setState into an unmounted page.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // Owner directive: once the simulated payment succeeds, the page shows only
  // the success panel; body[data-checkout-success] hides headers (global.css).
  useEffect(() => {
    if (result?.outcome !== "success") return;
    document.body.dataset.checkoutSuccess = "true";
    return () => {
      delete document.body.dataset.checkoutSuccess;
    };
  }, [result]);

  const notices = cartRecoveryNotices({
    recovery,
    restoreSkipped,
    storageDenied,
  });

  function showErrors(form: HTMLFormElement, next: BuyerErrors) {
    setErrors(next);
    const first = (["name", "email"] as const).find((key) => next[key]);
    const input = first && form.querySelector(`input[name="${first}"]`);
    if (input instanceof HTMLElement) input.focus();
  }

  function orderFailureMessage(reason: string): string {
    if (
      reason === "empty-cart" ||
      reason === "invalid-quote" ||
      reason === "over-quota"
    ) {
      return "Keranjang berubah dan tidak dapat dibayar dengan data saat ini. Keranjang tidak dikosongkan; segarkan halaman untuk memuat keranjang terbaru.";
    }
    // invalid-buyer / invalid-attribution: the form and the T08 contract keep
    // this unreachable, but the copy never claims an order was recorded.
    return "Pesanan belum dibuat: data tidak dapat diproses. Isian tetap ada; coba lagi.";
  }

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || sending) return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    const simulation = fields.get("simulation");
    if (simulation !== "success" && simulation !== "failure") {
      const radio = form.querySelector('input[name="simulation"]');
      if (radio instanceof HTMLElement) radio.focus();
      return;
    }

    setFormError("");
    const checked = validateBuyer({
      name: fields.get("name"),
      email: fields.get("email"),
    });
    if (!checked.ok) {
      showErrors(form, checked.errors);
      setFormError(
        checked.errors.form ?? "Periksa isian yang ditandai, lalu coba lagi.",
      );
      return;
    }

    // Revalidates buyer, quote and every product's shared quota against the
    // current fixtures (R-015) before any payment result can exist. The
    // captured tab touch (D-045) rides along in the mock order payload (R-021).
    const built = buildMockOrder(checked.data, quote, readTouch(), simulation);
    if (!built.ok) {
      setFormError(orderFailureMessage(built.reason));
      return;
    }

    pending.current = true;
    setSending(true);
    setErrors({});
    setStatus("Memproses pembayaran (simulasi)…");
    timer.current = setTimeout(() => {
      pending.current = false;
      timer.current = null;
      setSending(false);
      setStatus("");
      // D-043 inspection affordance: the full payload is asserted by the Node
      // tests; the console copy is redacted so buyer PII is never echoed, and
      // no analytics/dataLayer call exists on this page.
      console.info(
        "[Kodeva sim] payload order mock (data pembeli dirahasiakan):",
        JSON.stringify({ ...built.order, buyer: "(tidak dicetak)" }),
      );
      setResult({ outcome: simulation, order: built.order });
      if (simulation === "success") {
        // D-044: cart is cleared only after a successful simulation; a failure
        // keeps every line exactly as submitted.
        clearCart();
      }
    }, SIMULATION_DELAY_MS);
  }

  if (!hydrated) {
    return (
      <p className="panel max-w-prose" role="status">
        Memuat keranjang…
      </p>
    );
  }

  if (result?.outcome === "success") {
    return (
      <div className="space-y-4" data-checkout-success="">
        <CheckoutSuccess order={result.order} />
      </div>
    );
  }

  if (!quote.ok || quote.lines.length === 0) {
    return (
      <div className="space-y-4">
        {notices.length > 0 && <NoticeList notices={notices} />}
        <CheckoutUnavailable broken={!quote.ok} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notices.length > 0 && <NoticeList notices={notices} />}
      {result?.outcome === "failure" && (
        <p role="alert" className="panel border-error text-sm">
          Pembayaran simulasi gagal untuk pesanan {result.order.orderId}.
          Keranjang masih tersimpan utuh; periksa isian lalu coba lagi.
        </p>
      )}
      <FormFeedback sending={sending} status={status} formError={formError} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <BuyerForm onSubmit={submit} sending={sending} errors={errors} />
        <aside
          className="panel space-y-4 lg:sticky lg:top-6"
          aria-labelledby="checkout-summary-title"
        >
          <div>
            <h2 id="checkout-summary-title" className="font-semibold">
              Ringkasan pesanan
            </h2>
            <p className="mt-1 text-sm text-secondary">
              {quote.itemCount} lisensi · {BILLING_PERIOD}
            </p>
          </div>
          <OrderSummaryLines lines={quote.lines.map(lineToSummary)} />
          <p className="border-t border-border pt-4 text-3xl font-bold tracking-tight tabular-nums">
            {formatRupiah(quote.total)}
          </p>
          <p className="text-xs text-secondary">
            Harga mengikuti katalog terbaru dan divalidasi ulang sebelum
            pembayaran simulasi dibuat.
          </p>
        </aside>
      </div>
    </div>
  );
}
