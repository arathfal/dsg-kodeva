import {
  isProductId,
  isProductList,
  isRecord,
  isSlug,
  isText,
  type ProductId,
} from "../../../../../shared/content.ts";

export interface Image {
  url: string;
  width: number;
  height: number;
  alt: string;
  provenance: string;
}
export interface Seo {
  title?: string | null;
  description?: string | null;
  image?: Image | null;
}
export interface Campaign {
  campaignKey: string;
  title: string;
  subtitle: string;
  image: Image;
  ctaLabel: string;
  featuredHeading: string;
  featuredProducts: {
    product: ProductId;
    description: string;
    features: string[];
    image?: Image | null;
  }[];
  testimonialsHeading: string;
  testimonials: {
    quote: string;
    name: string;
    business: string;
    disclosure: string;
    portrait?: Image | null;
  }[];
  faqHeading: string;
  faq: { question: string; answer: string }[];
  seo?: Seo | null;
}
export interface Category {
  name: string;
  slug: string;
}
export interface TextBlock {
  _key: string;
  _type: "block";
  style: "normal" | "h2" | "h3";
  listItem?: "bullet" | "number" | null;
  level?: number | null;
  children: { _key: string; _type: "span"; text: string; marks: string[] }[];
  markDefs: { _key: string; _type: "link"; href: string }[];
}
export interface Article {
  _id: string;
  title: string;
  slug: string;
  cover: Image;
  excerpt: string;
  body: TextBlock[];
  category: Category;
  relatedProducts: ProductId[];
  publishedAt: string;
  seo?: Seo | null;
}
export type ArticleSummary = Omit<Article, "body">;
export interface ArticlePage {
  items: ArticleSummary[];
  total: number;
  page: number;
  pageSize: number;
}

const optional = (value: unknown, check: (v: unknown) => boolean) =>
  value == null || check(value);
const items = (
  value: unknown,
  min: number,
  max: number,
  check: (v: unknown) => boolean,
) =>
  Array.isArray(value) &&
  value.length >= min &&
  value.length <= max &&
  value.every(check);
const safeUrl = (value: unknown) => {
  if (typeof value !== "string") return false;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};
export function isImage(value: unknown): value is Image {
  return (
    isRecord(value) &&
    typeof value.url === "string" &&
    /^https:\/\/cdn\.sanity\.io\/images\//.test(value.url) &&
    typeof value.width === "number" &&
    Number.isFinite(value.width) &&
    value.width > 0 &&
    typeof value.height === "number" &&
    Number.isFinite(value.height) &&
    value.height > 0 &&
    isText(value.alt, 180) &&
    isText(value.provenance, 300)
  );
}
function isSeo(value: unknown): value is Seo {
  return (
    isRecord(value) &&
    optional(value.title, (v) => isText(v, 70)) &&
    optional(value.description, (v) => isText(v, 160)) &&
    optional(value.image, isImage)
  );
}
function isFeaturedProduct(
  value: unknown,
): value is Campaign["featuredProducts"][number] {
  return (
    isRecord(value) &&
    isProductId(value.product) &&
    isText(value.description, 200) &&
    items(value.features, 1, 6, (v) => isText(v, 100)) &&
    optional(value.image, isImage)
  );
}
function isFeaturedProductList(
  value: unknown,
): value is Campaign["featuredProducts"] {
  if (!items(value, 1, 6, isFeaturedProduct)) return false;
  const list = value as Campaign["featuredProducts"];
  return new Set(list.map((p) => p.product)).size === list.length;
}
export function isCampaign(value: unknown): value is Campaign {
  return (
    isRecord(value) &&
    isSlug(value.campaignKey, 80) &&
    isText(value.title, 120) &&
    isText(value.subtitle, 300) &&
    isImage(value.image) &&
    isText(value.ctaLabel, 60) &&
    isText(value.featuredHeading, 100) &&
    isFeaturedProductList(value.featuredProducts) &&
    isText(value.testimonialsHeading, 100) &&
    items(
      value.testimonials,
      1,
      6,
      (v) =>
        isRecord(v) &&
        isText(v.quote, 500) &&
        isText(v.name, 100) &&
        isText(v.business, 100) &&
        isText(v.disclosure, 160) &&
        optional(v.portrait, isImage),
    ) &&
    isText(value.faqHeading, 100) &&
    items(
      value.faq,
      1,
      12,
      (v) => isRecord(v) && isText(v.question, 160) && isText(v.answer, 1000),
    ) &&
    optional(value.seo, isSeo)
  );
}
export function isTextBlock(value: unknown): value is TextBlock {
  if (
    !isRecord(value) ||
    value._type !== "block" ||
    typeof value._key !== "string" ||
    !["normal", "h2", "h3"].includes(String(value.style)) ||
    !optional(value.listItem, (v) => v === "bullet" || v === "number") ||
    !optional(
      value.level,
      (v) => typeof v === "number" && Number.isSafeInteger(v) && v >= 1,
    ) ||
    !Array.isArray(value.markDefs) ||
    !value.markDefs.every(
      (v) =>
        isRecord(v) &&
        typeof v._key === "string" &&
        v._type === "link" &&
        safeUrl(v.href),
    )
  )
    return false;
  const marks = new Set(["strong", "em", ...value.markDefs.map((v) => v._key)]);
  return (
    Array.isArray(value.children) &&
    value.children.every(
      (v) =>
        isRecord(v) &&
        v._type === "span" &&
        typeof v._key === "string" &&
        typeof v.text === "string" &&
        Array.isArray(v.marks) &&
        v.marks.every((mark) => marks.has(mark)),
    )
  );
}
export function isArticleSummary(value: unknown): value is ArticleSummary {
  return (
    isRecord(value) &&
    isText(value._id, 200) &&
    !value._id.startsWith("drafts.") &&
    !value._id.startsWith("versions.") &&
    isText(value.title, 160) &&
    isSlug(value.slug) &&
    isImage(value.cover) &&
    isText(value.excerpt, 300) &&
    isRecord(value.category) &&
    isText(value.category.name, 80) &&
    isSlug(value.category.slug, 80) &&
    isProductList(value.relatedProducts) &&
    typeof value.publishedAt === "string" &&
    Number.isFinite(Date.parse(value.publishedAt)) &&
    optional(value.seo, isSeo)
  );
}
export function isArticle(value: unknown): value is Article {
  if (!isRecord(value)) return false;
  const body = value.body;
  return isArticleSummary(value) && items(body, 1, 200, isTextBlock);
}
