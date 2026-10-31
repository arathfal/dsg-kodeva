import {
  defineArrayMember,
  defineField,
  defineType,
  type StringRule,
} from "sanity";
import {
  API_VERSION,
  isEmail,
  isSlug,
  isText,
  isWhatsApp,
  products,
} from "../../../shared/content.ts";

const requiredText = (max: number) => (rule: StringRule) =>
  rule
    .required()
    .max(max)
    .custom((value) => isText(value, max) || "Isi teks yang tidak kosong.");
const text = (name: string, title: string, max: number) =>
  defineField({ name, title, type: "string", validation: requiredText(max) });
const productIds = (name: string, title: string, min: number) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({
        type: "string",
        options: {
          list: products.map(({ id, name }) => ({ title: name, value: id })),
        },
        validation: (rule) =>
          rule.custom(
            (id) =>
              products.some((p) => p.id === id) ||
              "Pilih produk yang tersedia.",
          ),
      }),
    ],
    validation: (rule) =>
      min > 0 ? rule.required().min(min).max(6).unique() : rule.max(6).unique(),
  });
const slug = (source: string, max: number) =>
  defineField({
    name: "slug",
    title: "Slug URL",
    type: "slug",
    options: { source, maxLength: max },
    description:
      "Huruf kecil, angka, dan tanda hubung. Perubahan slug membuat URL lama tidak ditemukan.",
    validation: (rule) =>
      rule.required().custom(async (value, context) => {
        if (!isSlug(value?.current, max))
          return "Gunakan slug huruf kecil, angka, dan tanda hubung.";
        const id = context.document?._id.replace(/^drafts\./, "");
        try {
          const unique = await context
            .getClient({ apiVersion: API_VERSION })
            .withConfig({ perspective: "raw", useCdn: false })
            .fetch<number>(
              'count(*[_type == $type && slug.current == $slug && !(_id in [$id, $draft]) && !(_id in path("versions.**"))])',
              {
                type: context.document?._type,
                slug: value.current,
                id,
                draft: `drafts.${id}`,
              },
            );
          return unique === 0 || "Slug sudah digunakan.";
        } catch {
          return "Keunikan slug belum dapat diperiksa. Coba lagi.";
        }
      }),
  });

export const contentImage = defineType({
  name: "contentImage",
  title: "Gambar konten",
  type: "image",
  options: { hotspot: true },
  fields: [
    text("alt", "Teks alternatif", 180),
    text("provenance", "Sumber / asal gambar", 300),
  ],
  validation: (rule) =>
    rule.custom((value) =>
      !value || value.asset?._ref ? true : "Unggah gambar.",
    ),
});
export const seo = defineType({
  name: "seo",
  title: "SEO dan berbagi",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Judul SEO",
      type: "string",
      validation: (r) =>
        r
          .max(70)
          .custom(
            (v) =>
              v === undefined ||
              isText(v, 70) ||
              "Isi teks atau kosongkan bidang.",
          ),
    }),
    defineField({
      name: "description",
      title: "Deskripsi SEO",
      type: "text",
      validation: (r) =>
        r
          .max(160)
          .custom(
            (v) =>
              v === undefined ||
              isText(v, 160) ||
              "Isi teks atau kosongkan bidang.",
          ),
    }),
    defineField({
      name: "image",
      title: "Gambar berbagi",
      type: "contentImage",
    }),
  ],
});
export const campaign = defineType({
  name: "campaign",
  title: "Kampanye",
  type: "document",
  fields: [
    defineField({
      ...text("campaignKey", "Kode kampanye", 80),
      validation: (r) =>
        r
          .required()
          .custom(
            (v) =>
              isSlug(v, 80) || "Gunakan huruf kecil, angka, dan tanda hubung.",
          ),
    }),
    text("title", "Judul hero", 120),
    text("subtitle", "Subjudul hero", 300),
    defineField({
      name: "image",
      title: "Gambar hero",
      type: "contentImage",
      validation: (r) => r.required(),
    }),
    text("ctaLabel", "Teks tombol katalog", 60),
    text("featuredHeading", "Judul produk unggulan", 100),
    productIds("featuredProducts", "Produk unggulan", 1),
    text("testimonialsHeading", "Judul testimoni", 100),
    defineField({
      name: "testimonials",
      title: "Testimoni ilustrasi",
      type: "array",
      validation: (r) => r.required().min(1).max(6),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            text("quote", "Kutipan", 500),
            text("name", "Nama fiktif", 100),
            text("business", "Usaha fiktif", 100),
            text("disclosure", "Keterangan ilustrasi", 160),
            defineField({
              name: "portrait",
              title: "Foto ilustrasi",
              type: "contentImage",
            }),
          ],
          preview: { select: { title: "business", subtitle: "name" } },
        }),
      ],
    }),
    text("faqHeading", "Judul FAQ", 100),
    defineField({
      name: "faq",
      title: "Pertanyaan umum",
      type: "array",
      validation: (r) => r.required().min(1).max(12),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            text("question", "Pertanyaan", 160),
            text("answer", "Jawaban", 1000),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({ name: "seo", title: "SEO dan berbagi", type: "seo" }),
  ],
});
export const category = defineType({
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    defineField({
      ...text("name", "Nama kategori", 80),
      validation: (r) =>
        requiredText(80)(r).custom(async (value, context) => {
          const id = context.document?._id.replace(/^drafts\./, "");
          try {
            const count = await context
              .getClient({ apiVersion: API_VERSION })
              .withConfig({ perspective: "raw", useCdn: false })
              .fetch<number>(
                'count(*[_type == "category" && name == $name && !(_id in [$id, $draft]) && !(_id in path("versions.**"))])',
                { name: value ?? "", id, draft: `drafts.${id}` },
              );
            return count === 0 || "Nama kategori sudah digunakan.";
          } catch {
            return "Keunikan nama belum dapat diperiksa. Coba lagi.";
          }
        }),
    }),
    slug("name", 80),
  ],
});
export const article = defineType({
  name: "article",
  title: "Artikel",
  type: "document",
  fields: [
    text("title", "Judul", 160),
    slug("title", 96),
    defineField({
      name: "cover",
      title: "Sampul",
      type: "contentImage",
      validation: (r) => r.required(),
    }),
    text("excerpt", "Ringkasan", 300),
    defineField({
      name: "body",
      title: "Isi artikel",
      type: "array",
      validation: (r) => r.required().min(1).max(200),
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraf", value: "normal" },
            { title: "Judul 2", value: "h2" },
            { title: "Judul 3", value: "h3" },
          ],
          lists: [
            { title: "Daftar", value: "bullet" },
            { title: "Daftar bernomor", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Tebal", value: "strong" },
              { title: "Miring", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Tautan",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (r) =>
                      r.required().uri({ scheme: ["http", "https"] }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) =>
        r.required().custom(async (v, context) => {
          if (!v?._ref) return "Pilih kategori.";
          try {
            return (
              (await context
                .getClient({ apiVersion: API_VERSION })
                .withConfig({ perspective: "published", useCdn: false })
                .fetch<boolean>(
                  'count(*[_id == $id && _type == "category"]) > 0',
                  { id: v._ref },
                )) || "Publikasikan kategori sebelum artikel."
            );
          } catch {
            return "Kategori belum dapat diperiksa. Coba lagi.";
          }
        }),
    }),
    productIds("relatedProducts", "Produk terkait", 0),
    defineField({
      name: "publishedAt",
      title: "Publikasi pertama",
      type: "datetime",
      readOnly: true,
    }),
    defineField({ name: "seo", title: "SEO dan berbagi", type: "seo" }),
  ],
  preview: { select: { title: "title", media: "cover" } },
});
export const lead = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  readOnly: true,
  fields: [
    text("name", "Nama", 100),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) =>
        r.custom((v) => v === undefined || isEmail(v) || "Email tidak valid."),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      validation: (r) =>
        r.custom(
          (v) =>
            v === undefined || isWhatsApp(v) || "Nomor WhatsApp tidak valid.",
        ),
    }),
    text("campaignKey", "Kode kampanye", 80),
    defineField({
      name: "submittedAt",
      title: "Waktu diterima",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "utm",
      title: "Atribusi UTM",
      type: "object",
      fields: ["source", "medium", "campaign", "term", "content"].map((name) =>
        defineField({ name, type: "string", validation: (r) => r.max(200) }),
      ),
    }),
  ],
  validation: (r) =>
    r.custom((v) =>
      v?.email || v?.whatsapp ? true : "Email atau WhatsApp wajib diisi.",
    ),
  preview: { select: { title: "name", subtitle: "submittedAt" } },
});
