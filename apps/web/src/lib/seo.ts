// SEO URL helpers shared by every page: canonical links and og:image absolute
// URLs are all built only from the configured site origin (PUBLIC_SITE_URL).
// A missing configuration or a non-http(s) origin yields undefined; an
// untrusted request origin is never substituted.

/** Absolute URL on the configured site origin, or undefined without it. */
export function siteUrl(pathOrSource: string): URL | undefined {
  try {
    const origin = new URL(import.meta.env.PUBLIC_SITE_URL);
    if (["https:", "http:"].includes(origin.protocol))
      return new URL(pathOrSource, origin.origin);
  } catch {
    /* Missing configuration must not use an untrusted request origin. */
  }
  return undefined;
}
