export function socialImageUrl(image: { url: string }): URL {
  const url = new URL(image.url);
  if (url.pathname.endsWith(".svg")) {
    url.searchParams.set("fm", "png");
    url.searchParams.set("w", "1200");
  }
  return url;
}
