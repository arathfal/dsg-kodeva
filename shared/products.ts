import type { ProductId } from "./content.ts";

export interface ProductSummary {
  id: ProductId;
  description: string;
  features: string[];
}

export const productSummaries: Record<ProductId, ProductSummary> = {
  kasir: {
    id: "kasir",
    description:
      "Mencatat transaksi penjualan harian dan mengelola item penjualan untuk usaha kecil.",
    features: [
      "Pencatatan transaksi cepat",
      "Manajemen item/produk",
      "Laporan penjualan sederhana",
    ],
  },
  inventori: {
    id: "inventori",
    description:
      "Memantau stok barang dan pergerakan persediaan agar usaha tetap terkontrol.",
    features: [
      "Pantau stok barang",
      "Catat masuk/keluar persediaan",
      "Peringatan stok minimum",
    ],
  },
  hr: {
    id: "hr",
    description:
      "Mengatur data karyawan dan kehadiran untuk tim kecil yang sedang berkembang.",
    features: [
      "Data karyawan terpusat",
      "Pencatatan kehadiran",
      "Informasi tim yang terorganisir",
    ],
  },
  payroll: {
    id: "payroll",
    description:
      "Menghitung gaji dan komponen pendapatan karyawan secara terstruktur.",
    features: [
      "Perhitungan gaji dasar",
      "Komponen pendapatan",
      "Ringkasan penggajian",
    ],
  },
  akuntansi: {
    id: "akuntansi",
    description:
      "Mencatat pemasukan, pengeluaran, dan laporan keuangan dasar usaha.",
    features: [
      "Pencatatan pemasukan/pengeluaran",
      "Neraca sederhana",
      "Laporan laba/rugi dasar",
    ],
  },
  laporan: {
    id: "laporan",
    description:
      "Menyusun ringkasan data usaha dari berbagai sumber dalam satu tampilan.",
    features: [
      "Ringkasan data terpadu",
      "Grafik dan tabel sederhana",
      "Ekspor laporan dasar",
    ],
  },
};
