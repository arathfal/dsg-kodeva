// Fictional assessment copy approved in the T02 contract; no customer data.
export const seedCampaign = {
  _type: "campaign",
  _id: "campaign",
  campaignKey: "promo-akhir-tahun",
  title: "Software untuk langkah berikutnya bisnis Anda",
  subtitle:
    "Jelajahi pilihan aplikasi Kodeva untuk membantu pekerjaan harian usaha Anda.",
  ctaLabel: "Lihat katalog",
  featuredHeading: "Pilihan aplikasi",
  featuredProducts: [
    {
      _key: "kasir",
      product: "kasir",
      description:
        "Mencatat transaksi penjualan harian dan mengelola item penjualan untuk usaha kecil.",
      features: [
        "Pencatatan transaksi cepat",
        "Manajemen item/produk",
        "Laporan penjualan sederhana",
      ],
    },
    {
      _key: "hr",
      product: "hr",
      description:
        "Mengatur data karyawan dan kehadiran untuk tim kecil yang sedang berkembang.",
      features: [
        "Data karyawan terpusat",
        "Pencatatan kehadiran",
        "Informasi tim yang terorganisir",
      ],
    },
    {
      _key: "payroll",
      product: "payroll",
      description:
        "Menghitung gaji dan komponen pendapatan karyawan secara terstruktur.",
      features: [
        "Perhitungan gaji dasar",
        "Komponen pendapatan",
        "Ringkasan penggajian",
      ],
    },
  ],
  testimonialsHeading: "Cerita usaha contoh",
  testimonials: [
    {
      _key: "demo",
      quote:
        "Aplikasi kasir membuat pencatatan penjualan harian jadi lebih rapi dan cepat.",
      name: "Pemilik Toko Contoh",
      business: "Toko Contoh",
    },
  ],
  faqHeading: "Pertanyaan umum",
  faq: [
    {
      _key: "simulation",
      question: "Apakah harga yang tertera per tahun?",
      answer:
        "Ya. Semua harga lisensi dihitung per tahun; jumlah lisensi diatur di keranjang.",
    },
    {
      _key: "choice",
      question: "Bagaimana memilih aplikasi?",
      answer:
        "Buka katalog dan bandingkan kebutuhan usaha Anda dengan informasi produk.",
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
    excerpt: "Langkah dasar untuk merapikan catatan penjualan usaha.",
    heading: "Mulai dari transaksi harian",
    paragraph:
      "Catat transaksi secara konsisten dan tinjau ringkasannya secara berkala.",
  },
  {
    title: "Merapikan administrasi tim kecil",
    slug: "merapikan-administrasi-tim-kecil",
    category: "Tim",
    categorySlug: "tim",
    relatedProducts: ["hr", "payroll"],
    excerpt: "Kenali informasi dasar yang perlu ditata dalam administrasi tim.",
    heading: "Susun data dengan teratur",
    paragraph:
      "Gunakan alur kerja yang jelas untuk mencatat kebutuhan administrasi tim.",
  },
];
export const seedImageMeta = {
  alt: "Kodeva, aplikasi bisnis untuk UMKM",
  provenance: "Ilustrasi asli Kodeva.",
};

export const paragraph = (text: string, key: string, style = "normal") => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-text`, text, marks: [] }],
});
