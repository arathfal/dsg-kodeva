// Fictional assessment copy approved in the T02 contract; no customer data.
export const seedCampaign = {
  _type: "campaign",
  _id: "campaign",
  campaignKey: "promo-akhir-tahun",
  title: "Software untuk langkah berikutnya bisnis Anda",
  subtitle:
    "Jelajahi pilihan aplikasi Kodeva untuk membantu pekerjaan harian usaha Anda. Seluruh penawaran di situs ini adalah simulasi.",
  ctaLabel: "Lihat katalog",
  featuredHeading: "Pilihan aplikasi",
  featuredProducts: ["kasir", "hr", "payroll"],
  testimonialsHeading: "Cerita usaha contoh",
  testimonials: [
    {
      _key: "demo",
      quote:
        "Contoh ini menggambarkan bagaimana aplikasi kasir dapat membantu pencatatan penjualan.",
      name: "Pemilik Usaha Demo",
      business: "Toko Contoh — fiktif",
      disclosure: "Testimoni ilustrasi; bukan pengalaman pelanggan nyata.",
    },
  ],
  faqHeading: "Pertanyaan umum",
  faq: [
    {
      _key: "simulation",
      question: "Apakah pembelian di situs ini nyata?",
      answer:
        "Tidak. Katalog dan checkout digunakan untuk simulasi assessment.",
    },
    {
      _key: "choice",
      question: "Bagaimana memilih aplikasi?",
      answer:
        "Buka katalog dan bandingkan kebutuhan usaha Anda dengan informasi produk contoh.",
    },
  ],
};
export const seedArticles = [
  {
    title: "Menyiapkan pencatatan penjualan usaha",
    slug: "menyiapkan-pencatatan-penjualan-usaha",
    category: "Operasional",
    categorySlug: "operasional",
    relatedProducts: ["kasir", "inventori"],
    excerpt:
      "Langkah dasar untuk merapikan catatan penjualan dalam contoh usaha.",
    heading: "Mulai dari transaksi harian",
    paragraph:
      "Catat transaksi secara konsisten dan tinjau ringkasannya secara berkala. Materi ini merupakan ilustrasi assessment.",
  },
  {
    title: "Merapikan administrasi tim kecil",
    slug: "merapikan-administrasi-tim-kecil",
    category: "Tim",
    categorySlug: "tim",
    relatedProducts: ["hr", "payroll"],
    excerpt:
      "Kenali informasi dasar yang perlu ditata dalam administrasi tim contoh.",
    heading: "Susun data dengan teratur",
    paragraph:
      "Gunakan alur kerja yang jelas untuk mencatat kebutuhan administrasi tim. Materi ini merupakan ilustrasi assessment.",
  },
];
export const paragraph = (text: string, key: string, style = "normal") => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-text`, text, marks: [] }],
});
