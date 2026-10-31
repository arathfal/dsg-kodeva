// Approved commerce fixtures for T05–T07 (D-033 / P-007): one annual IDR billing
// period, integer rupiah amounts, no taxes or vouchers. Promotional quota is
// shared per product across all package variants; no per-package quota exists.
import { isProductId, type ProductId } from "./content.ts";

export const PACKAGE_ORDER = ["basic", "pro", "business"] as const;
export type PackageId = (typeof PACKAGE_ORDER)[number];
export const packageNames: Record<PackageId, string> = {
  basic: "Basic",
  pro: "Pro",
  business: "Business",
};

export const catalogCategories = [
  { id: "penjualan-kasir", name: "Penjualan & Kasir" },
  { id: "inventaris", name: "Inventaris" },
  { id: "sdm-payroll", name: "SDM & Payroll" },
  { id: "keuangan-laporan", name: "Keuangan & Laporan" },
  { id: "tambahan", name: "Tambahan" },
] as const;
export type CatalogCategoryId = (typeof catalogCategories)[number]["id"];

export type LicenseUnit = "outlet" | "pengguna";
export const unitLabels: Record<LicenseUnit, string> = {
  outlet: "per outlet",
  pengguna: "per pengguna",
};

export const BILLING_PERIOD = "per tahun";

export interface Screenshot {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}
export interface PackageOffer {
  id: PackageId;
  price: number;
  /** Struck-through price shown only for promotional packages. */
  originalPrice?: number;
}
export interface ProductCatalog {
  id: ProductId;
  categoryId: CatalogCategoryId;
  /** Remaining promotional licenses, shared by every package of this product. */
  promoQuota: number;
  unit: LicenseUnit;
  packages: PackageOffer[];
  screenshots: Screenshot[];
}

const isPackageId = (value: unknown): value is PackageId =>
  PACKAGE_ORDER.includes(value as PackageId);
const isCatalogCategoryId = (value: unknown): value is CatalogCategoryId =>
  catalogCategories.some((category) => category.id === value);
const isPositiveInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const isLocalScreenshot = (value: unknown): value is Screenshot =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  typeof (value as Screenshot).src === "string" &&
  /^\/img\/products\/[a-z0-9-]+\.svg$/.test((value as Screenshot).src) &&
  typeof (value as Screenshot).alt === "string" &&
  (value as Screenshot).alt.length > 0 &&
  (value as Screenshot).alt.length <= 180 &&
  typeof (value as Screenshot).caption === "string" &&
  (value as Screenshot).caption.length > 0 &&
  (value as Screenshot).caption.length <= 100 &&
  (value as Screenshot).width === 960 &&
  (value as Screenshot).height === 640;

export function isPackageOffer(value: unknown): value is PackageOffer {
  if (
    typeof value !== "object" ||
    value === null ||
    !isPackageId((value as PackageOffer).id) ||
    !isPositiveInteger((value as PackageOffer).price)
  )
    return false;
  const { originalPrice } = value as PackageOffer;
  return (
    originalPrice === undefined ||
    (isPositiveInteger(originalPrice) &&
      originalPrice > (value as PackageOffer).price)
  );
}

export function isProductCatalog(value: unknown): value is ProductCatalog {
  if (
    typeof value !== "object" ||
    value === null ||
    !isProductId((value as ProductCatalog).id) ||
    !isCatalogCategoryId((value as ProductCatalog).categoryId) ||
    typeof (value as ProductCatalog).promoQuota !== "number" ||
    !Number.isSafeInteger((value as ProductCatalog).promoQuota) ||
    (value as ProductCatalog).promoQuota < 0 ||
    (value as ProductCatalog).promoQuota > 999 ||
    !["outlet", "pengguna"].includes(String((value as ProductCatalog).unit)) ||
    !Array.isArray((value as ProductCatalog).screenshots) ||
    (value as ProductCatalog).screenshots.length < 1 ||
    (value as ProductCatalog).screenshots.length > 4 ||
    !(value as ProductCatalog).screenshots.every(isLocalScreenshot)
  )
    return false;
  const packages = (value as ProductCatalog).packages;
  return (
    Array.isArray(packages) &&
    packages.length === PACKAGE_ORDER.length &&
    packages.every(
      (offer, index) =>
        isPackageOffer(offer) && offer.id === PACKAGE_ORDER[index],
    )
  );
}

export type CatalogResult =
  | { status: "ok"; data: ProductCatalog[] }
  | { status: "unavailable"; reason: "invalid-content" };

// Exactly one catalog entry per registry product, validated on every read so a
// broken fixture surfaces as an explicit failure instead of broken pages.
export const catalogFixture: ProductCatalog[] = [
  {
    id: "kasir",
    categoryId: "penjualan-kasir",
    promoQuota: 10,
    unit: "outlet",
    packages: [
      { id: "basic", price: 1_800_000, originalPrice: 2_400_000 },
      { id: "pro", price: 2_700_000, originalPrice: 3_600_000 },
      { id: "business", price: 3_900_000, originalPrice: 5_200_000 },
    ],
    screenshots: [
      {
        src: "/img/products/kasir-transaksi.svg",
        alt: "Ilustrasi layar pencatatan transaksi aplikasi Kodeva Kasir",
        caption: "Pencatatan transaksi",
        width: 960,
        height: 640,
      },
      {
        src: "/img/products/kasir-item.svg",
        alt: "Ilustrasi layar manajemen item penjualan aplikasi Kodeva Kasir",
        caption: "Manajemen item penjualan",
        width: 960,
        height: 640,
      },
    ],
  },
  {
    id: "inventori",
    categoryId: "inventaris",
    promoQuota: 5,
    unit: "outlet",
    packages: [
      { id: "basic", price: 1_200_000 },
      { id: "pro", price: 1_900_000 },
      { id: "business", price: 2_900_000 },
    ],
    screenshots: [
      {
        src: "/img/products/inventori-stok.svg",
        alt: "Ilustrasi layar pemantauan stok aplikasi Kodeva Inventori",
        caption: "Pemantauan stok barang",
        width: 960,
        height: 640,
      },
      {
        src: "/img/products/inventori-pergerakan.svg",
        alt: "Ilustrasi grafik pergerakan persediaan aplikasi Kodeva Inventori",
        caption: "Masuk dan keluar persediaan",
        width: 960,
        height: 640,
      },
    ],
  },
  {
    id: "hr",
    categoryId: "sdm-payroll",
    promoQuota: 8,
    unit: "pengguna",
    packages: [
      { id: "basic", price: 1_500_000, originalPrice: 2_000_000 },
      { id: "pro", price: 2_400_000, originalPrice: 3_200_000 },
      { id: "business", price: 3_500_000, originalPrice: 4_600_000 },
    ],
    screenshots: [
      {
        src: "/img/products/hr-karyawan.svg",
        alt: "Ilustrasi daftar karyawan aplikasi Kodeva HR",
        caption: "Data karyawan terpusat",
        width: 960,
        height: 640,
      },
      {
        src: "/img/products/hr-kehadiran.svg",
        alt: "Ilustrasi kalender kehadiran aplikasi Kodeva HR",
        caption: "Pencatatan kehadiran",
        width: 960,
        height: 640,
      },
    ],
  },
  {
    id: "payroll",
    categoryId: "sdm-payroll",
    promoQuota: 12,
    unit: "pengguna",
    packages: [
      { id: "basic", price: 2_200_000 },
      { id: "pro", price: 3_300_000 },
      { id: "business", price: 4_900_000 },
    ],
    screenshots: [
      {
        src: "/img/products/payroll-gaji.svg",
        alt: "Ilustrasi rincian gaji aplikasi Kodeva Payroll",
        caption: "Perhitungan gaji dasar",
        width: 960,
        height: 640,
      },
      {
        src: "/img/products/payroll-komponen.svg",
        alt: "Ilustrasi komponen pendapatan aplikasi Kodeva Payroll",
        caption: "Komponen pendapatan",
        width: 960,
        height: 640,
      },
    ],
  },
  {
    id: "akuntansi",
    categoryId: "keuangan-laporan",
    promoQuota: 15,
    unit: "pengguna",
    packages: [
      { id: "basic", price: 1_600_000, originalPrice: 2_100_000 },
      { id: "pro", price: 2_500_000, originalPrice: 3_300_000 },
      { id: "business", price: 3_800_000, originalPrice: 5_000_000 },
    ],
    screenshots: [
      {
        src: "/img/products/akuntansi-jurnal.svg",
        alt: "Ilustrasi jurnal pemasukan dan pengeluaran aplikasi Kodeva Akuntansi",
        caption: "Pencatatan pemasukan dan pengeluaran",
        width: 960,
        height: 640,
      },
      {
        src: "/img/products/akuntansi-laba.svg",
        alt: "Ilustrasi grafik laba aplikasi Kodeva Akuntansi",
        caption: "Laporan laba/rugi dasar",
        width: 960,
        height: 640,
      },
    ],
  },
  {
    id: "laporan",
    categoryId: "keuangan-laporan",
    promoQuota: 0,
    unit: "pengguna",
    packages: [
      { id: "basic", price: 900_000 },
      { id: "pro", price: 1_400_000 },
      { id: "business", price: 2_200_000 },
    ],
    screenshots: [
      {
        src: "/img/products/laporan-ringkasan.svg",
        alt: "Ilustrasi dasbor ringkasan aplikasi Kodeva Laporan",
        caption: "Ringkasan data terpadu",
        width: 960,
        height: 640,
      },
      {
        src: "/img/products/laporan-ekspor.svg",
        alt: "Ilustrasi ekspor laporan aplikasi Kodeva Laporan",
        caption: "Ekspor laporan dasar",
        width: 960,
        height: 640,
      },
    ],
  },
];

export function catalogResult(): CatalogResult {
  const valuesOk =
    Array.isArray(catalogFixture) &&
    catalogFixture.length === 6 &&
    catalogFixture.every(isProductCatalog) &&
    new Set(catalogFixture.map((entry) => entry.id)).size ===
      catalogFixture.length;
  return valuesOk
    ? { status: "ok", data: catalogFixture }
    : { status: "unavailable", reason: "invalid-content" };
}

export function getCatalogEntry(id: unknown): ProductCatalog | undefined {
  return isProductId(id)
    ? catalogFixture.find((entry) => entry.id === id)
    : undefined;
}

export function getCatalogCategory(id: unknown) {
  return catalogCategories.find((category) => category.id === id);
}

export function productsInCategory(id: unknown): ProductCatalog[] {
  return isCatalogCategoryId(id)
    ? catalogFixture.filter((entry) => entry.categoryId === id)
    : [];
}

/** The Basic price is the natural starting point of every product. */
export function startingPrice(entry: ProductCatalog): number {
  return entry.packages[0].price;
}

export function packageOffer(
  entry: ProductCatalog,
  packageId: PackageId,
): PackageOffer {
  return entry.packages.find((offer) => offer.id === packageId)!;
}
