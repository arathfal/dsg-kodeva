// Publication timestamps are stored in UTC; the demo audience is in Indonesia,
// so dates render in the Jakarta timezone with full Indonesian month names.
const formatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

// Prices are approved integer rupiah amounts; id-ID grouping produces the
// conventional "Rp1.800.000" formatting without decimals.
export function formatRupiah(amount: number): string {
  return "Rp" + new Intl.NumberFormat("id-ID").format(amount);
}

export function formatDate(publishedAt: string): string | undefined {
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return undefined;
  return formatter.format(date);
}
