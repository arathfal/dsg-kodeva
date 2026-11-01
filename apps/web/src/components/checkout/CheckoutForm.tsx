// Buyer form: the radio group selects the simulated result; validation
// state comes from shared/checkout.ts and rendering stays layout-only here.
import type { SubmitEvent } from "react";
import { type BuyerErrors } from "../../../../../shared/checkout.ts";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function FormFeedback({
  sending,
  status,
  formError,
}: {
  sending: boolean;
  status: string;
  formError: string;
}) {
  return (
    <div aria-live="polite" className="space-y-2">
      {formError && (
        <p role="alert" className="text-error">
          {formError}
        </p>
      )}
      {status && <p role="status">{status}</p>}
      {sending && (
        <p className="sr-only">Pembayaran simulasi sedang diproses.</p>
      )}
      <noscript>
        <p>Aktifkan JavaScript untuk melanjutkan checkout ini.</p>
      </noscript>
    </div>
  );
}

export function BuyerForm({
  onSubmit,
  sending,
  errors,
}: {
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  sending: boolean;
  errors: BuyerErrors;
}) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={sending}
      className="panel min-w-0 space-y-6"
    >
      <fieldset disabled={sending} className="min-w-0 space-y-6">
        <legend className="sr-only">Data pembeli</legend>
        <div className="space-y-2">
          <label htmlFor="checkout-name" className="block font-semibold">
            Nama
          </label>
          <Input
            id="checkout-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "checkout-name-error" : undefined}
          />
          {errors.name && (
            <p id="checkout-name-error" className="text-sm text-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="checkout-email" className="block font-semibold">
            Email
          </label>
          <Input
            id="checkout-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "checkout-email-error" : undefined}
          />
          {errors.email && (
            <p id="checkout-email-error" className="text-sm text-error">
              {errors.email}
            </p>
          )}
        </div>
        <fieldset className="min-w-0 space-y-3">
          <legend className="font-semibold">Hasil pembayaran</legend>
          <p id="simulation-help" className="text-sm text-secondary">
            Sukses mengosongkan keranjang, gagal mempertahankannya.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                ["success", "Sukses", true],
                ["failure", "Gagal", false],
              ] as const
            ).map(([value, label, defaultOn]) => (
              <label
                key={value}
                className="flex min-h-11 cursor-pointer items-center gap-x-3 rounded-input border border-border bg-canvas px-4 py-3 has-checked:border-primary has-checked:bg-soft"
              >
                <input
                  type="radio"
                  name="simulation"
                  value={value}
                  defaultChecked={defaultOn}
                  className="h-5 w-5 shrink-0"
                />
                <span className="font-semibold">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>
      <div className="space-y-2">
        <Button type="submit" disabled={sending} className="w-full md:w-auto">
          {sending ? "Memproses pembayaran (simulasi)…" : "Bayar (simulasi)"}
        </Button>
      </div>
    </form>
  );
}
