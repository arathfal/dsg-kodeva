import {
  isEmail,
  isRecord,
  isSlug,
  isWhatsApp,
  type LeadInput,
} from "./content.ts";

export type LeadErrors = Partial<
  Record<"name" | "email" | "whatsapp" | "form", string>
>;
export type LeadValidation =
  { ok: true; data: LeadInput } | { ok: false; errors: LeadErrors };

export function validateLead(input: unknown): LeadValidation {
  if (!isRecord(input))
    return { ok: false, errors: { form: "Data formulir tidak valid." } };
  const errors: LeadErrors = {};
  const allowed = [
    "name",
    "email",
    "whatsapp",
    "campaignKey",
    "utm",
    "website",
  ];
  if (Object.keys(input).some((key) => !allowed.includes(key)))
    errors.form = "Data formulir tidak valid.";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name || name.length > 100)
    errors.name = "Isi nama dengan 1–100 karakter.";
  const email =
    typeof input.email === "string" ? input.email.trim() : undefined;
  const whatsapp =
    typeof input.whatsapp === "string" ? input.whatsapp.trim() : undefined;
  if (
    input.email !== undefined &&
    (email === undefined || (email && !isEmail(email)))
  )
    errors.email = "Isi alamat email yang valid, maksimal 254 karakter.";
  if (
    input.whatsapp !== undefined &&
    (whatsapp === undefined || (whatsapp && !isWhatsApp(whatsapp)))
  )
    errors.whatsapp = "Isi WhatsApp dengan 8–15 digit dan awalan + bila perlu.";
  if (!email && !whatsapp) {
    errors.email = "Isi setidaknya email atau WhatsApp.";
    errors.whatsapp = "Isi setidaknya email atau WhatsApp.";
  }
  if (!isSlug(input.campaignKey, 80))
    errors.form = "Kampanye tidak valid. Muat ulang halaman lalu coba lagi.";
  if (input.website !== undefined && input.website !== "")
    errors.form = "Formulir tidak dapat dikirim.";
  const utm: NonNullable<LeadInput["utm"]> = {};
  if (input.utm !== undefined) {
    if (!isRecord(input.utm)) errors.form = "Atribusi kampanye tidak valid.";
    else {
      for (const [key, value] of Object.entries(input.utm)) {
        if (
          !["source", "medium", "campaign", "term", "content"].includes(key) ||
          typeof value !== "string" ||
          value.trim().length > 200
        ) {
          errors.form = "Atribusi kampanye tidak valid.";
        } else if (value.trim()) {
          utm[key as keyof typeof utm] = value.trim();
        }
      }
    }
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      name,
      ...(email ? { email } : {}),
      ...(whatsapp ? { whatsapp: whatsapp.replace(/[ ()-]/g, "") } : {}),
      campaignKey: input.campaignKey as string,
      ...(Object.keys(utm).length ? { utm } : {}),
    },
  };
}
