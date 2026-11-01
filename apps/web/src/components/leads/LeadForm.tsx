import {
  useRef,
  useState,
  useSyncExternalStore,
  type SubmitEvent,
} from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { isRecord } from "../../../../../shared/content";
import { validateLead, type LeadErrors } from "../../../../../shared/leads";
import { readTouch } from "../../lib/analytics";

const subscribe = () => () => {};

export function LeadForm({ campaignKey }: { campaignKey: string }) {
  const pending = useRef(false);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState("");

  function showErrors(form: HTMLFormElement, next: LeadErrors) {
    setErrors(next);
    const first = ["name", "email", "whatsapp"].find(
      (key) => next[key as keyof LeadErrors],
    );
    const input = first && form.elements.namedItem(first);
    if (input instanceof HTMLInputElement) input.focus();
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus("");
    const payload = {
      name: fields.get("name"),
      email: fields.get("email"),
      whatsapp: fields.get("whatsapp"),
      website: fields.get("website"),
      campaignKey,
      // The tab's captured touch rides along when it exists;
      // absent attribution stays absent rather than being faked.
      utm: readTouch(),
    };
    const checked = validateLead(payload);
    if (!checked.ok) {
      showErrors(form, checked.errors);
      return;
    }
    pending.current = true;
    setSending(true);
    setErrors({});
    setStatus("Sedang mengirim…");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: unknown = await response.json();
      if (response.status === 201 && isRecord(result) && result.ok === true) {
        form.reset();
        setStatus("Terima kasih! Data berhasil dikirim.");
      } else {
        const next: LeadErrors = {};
        if (isRecord(result) && isRecord(result.errors)) {
          for (const key of ["name", "email", "whatsapp", "form"] as const) {
            const message = result.errors[key];
            if (typeof message === "string") next[key] = message;
          }
        }
        if (!Object.keys(next).length)
          next.form =
            "Data belum dapat disimpan. Isian tetap ada; coba lagi nanti.";
        setErrors(next);
        setStatus("");
      }
    } catch {
      setErrors({
        form: "Pengiriman belum dapat dipastikan. Isian tetap ada. Periksa dengan tim sebelum mencoba lagi.",
      });
      setStatus("");
    } finally {
      pending.current = false;
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-busy={sending}
      className="space-y-6"
    >
      <p id="lead-help" className="text-secondary">
        Nama wajib diisi, serta email atau WhatsApp agar kami dapat menghubungi
        Anda.
      </p>
      <fieldset disabled={sending} className="min-w-0 space-y-6">
        <legend className="sr-only">Data kontak</legend>
        {(
          [
            ["name", "Nama", "text", "name", 100],
            ["email", "Email", "email", "email", 254],
            ["whatsapp", "WhatsApp", "tel", "tel", 40],
          ] as const
        ).map(([name, label, type, autoComplete, maxLength]) => (
          <div key={name} className="space-y-2">
            <label htmlFor={`lead-${name}`} className="block font-semibold">
              {label}
              {name === "name" ? " (wajib)" : ""}
            </label>
            <Input
              id={`lead-${name}`}
              name={name}
              type={type}
              autoComplete={autoComplete}
              maxLength={maxLength}
              required={name === "name"}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={`lead-help${errors[name] ? ` lead-${name}-error` : ""}`}
            />
            {errors[name] && (
              <p id={`lead-${name}-error`} className="text-sm text-error">
                {errors[name]}
              </p>
            )}
          </div>
        ))}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="lead-website">Website (biarkan kosong)</label>
          <input
            id="lead-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </fieldset>
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="text-error">
          {errors.form || "Periksa isian yang ditandai, lalu kirim kembali."}
        </p>
      )}
      <Button
        type="submit"
        disabled={!ready || sending}
        className="w-full md:w-auto"
      >
        {sending ? "Mengirim…" : "Kirim"}
      </Button>
      <p role="status" aria-live="polite" className="min-h-6 text-success">
        {status}
      </p>
      <noscript>
        <p>Aktifkan JavaScript untuk mengirim formulir ini.</p>
      </noscript>
    </form>
  );
}
