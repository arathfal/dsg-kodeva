// Publication timestamps are stored in UTC; the demo audience is in Indonesia,
// so dates render in the Jakarta timezone with full Indonesian month names.
const formatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatDate(publishedAt: string): string | undefined {
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return undefined;
  return formatter.format(date);
}
