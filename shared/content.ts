export const API_VERSION = "2026-10-31";
export const PAGE_SIZE = 6;
export const CATALOG_PATH = "/products";
export const CART_PATH = "/cart";
export const products = [
  { id: "kasir", name: "Kodeva Kasir" },
  { id: "inventori", name: "Kodeva Inventori" },
  { id: "hr", name: "Kodeva HR" },
  { id: "payroll", name: "Kodeva Payroll" },
  { id: "akuntansi", name: "Kodeva Akuntansi" },
  { id: "laporan", name: "Kodeva Laporan" },
] as const;
export type ProductId = (typeof products)[number]["id"];

export const isProductId = (value: unknown): value is ProductId =>
  products.some((product) => product.id === value);
export const isText = (value: unknown, max: number): value is string =>
  typeof value === "string" &&
  value === value.trim() &&
  value.length > 0 &&
  value.length <= max;

export function withoutPublicationDate(
  document: Record<string, unknown> & { _id: string; _type: string },
) {
  const copy = { ...document };
  delete copy.publishedAt;
  return copy;
}
export const isSlug = (value: unknown, max = 96): value is string =>
  typeof value === "string" &&
  value.length <= max &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
export const isProductList = (value: unknown, min = 0): value is ProductId[] =>
  Array.isArray(value) &&
  value.length >= min &&
  value.length <= 6 &&
  value.every(isProductId) &&
  new Set(value).size === value.length;

export interface LeadInput {
  name: string;
  email?: string;
  whatsapp?: string;
  campaignKey: string;
  utm?: Partial<
    Record<"source" | "medium" | "campaign" | "term" | "content", string>
  >;
}
export interface LeadRecord extends LeadInput {
  _type: "lead";
  submittedAt: string;
}
export const isEmail = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isWhatsApp = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= 40 &&
  /^\+?[0-9 ()-]+$/.test(value) &&
  /^\+?\d{8,15}$/.test(value.replace(/[ ()-]/g, ""));

export function validLead(value: unknown): value is LeadInput {
  if (
    !isRecord(value) ||
    !isText(value.name, 100) ||
    !isSlug(value.campaignKey, 80)
  )
    return false;
  if (!value.email && !value.whatsapp) return false;
  if (value.email !== undefined && !isEmail(value.email)) return false;
  if (value.whatsapp !== undefined && !isWhatsApp(value.whatsapp)) return false;
  if (
    value.utm !== undefined &&
    (!isRecord(value.utm) ||
      Object.entries(value.utm).some(
        ([key, text]) =>
          !["source", "medium", "campaign", "term", "content"].includes(key) ||
          !isText(text, 200),
      ))
  )
    return false;
  return true;
}

export function publicConfig(projectId: unknown, dataset: unknown) {
  if (
    typeof projectId !== "string" ||
    !/^[a-z0-9-]+$/.test(projectId) ||
    typeof dataset !== "string" ||
    !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(dataset)
  ) {
    throw new Error(
      "Configure a valid SANITY_PROJECT_ID and SANITY_DATASET for server-side content reads.",
    );
  }
  return { projectId, dataset };
}
