import {
  API_VERSION,
  PAGE_SIZE,
  isRecord,
  isSlug,
  publicConfig,
} from "../../../../../shared/content.ts";
import {
  isArticle,
  isArticleSummary,
  isCampaign,
  type Article,
  type ArticlePage,
  type Campaign,
} from "./models.ts";

export type ContentResult<T> =
  | { status: "ok"; data: T }
  | { status: "not-found" }
  | {
      status: "unavailable";
      reason: "configuration" | "network" | "invalid-content";
    };

const image =
  '{alt,provenance,"url":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height}';
const seo = `seo{title,description,image${image}}`;
const publicArticles =
  '_type == "article" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))';
const articleFields = `_id,title,"slug":slug.current,cover${image},excerpt,"category":category->{name,"slug":slug.current},"relatedProducts":coalesce(relatedProducts,[]),publishedAt,${seo}`;
const campaignQuery = `*[_type == "campaign" && _id == "campaign"][0]{campaignKey,title,subtitle,image${image},ctaLabel,featuredHeading,featuredProducts,testimonialsHeading,testimonials[]{quote,name,business,disclosure,portrait${image}},faqHeading,faq[]{question,answer},${seo}}`;

// Only fixed public-content queries are exposed; this reader never accepts a token.
export function createContentReader(
  config: { projectId?: string; dataset?: string },
  request: typeof fetch = fetch,
) {
  async function query(
    groq: string,
    params: Record<string, string | number> = {},
  ): Promise<ContentResult<unknown>> {
    let checked: ReturnType<typeof publicConfig>;
    try {
      checked = publicConfig(config.projectId, config.dataset);
    } catch {
      return { status: "unavailable", reason: "configuration" };
    }
    const url = new URL(
      `https://${checked.projectId}.api.sanity.io/v${API_VERSION}/data/query/${checked.dataset}`,
    );
    url.searchParams.set("perspective", "published");
    url.searchParams.set("query", groq);
    url.searchParams.set("returnQuery", "false");
    for (const [key, value] of Object.entries(params))
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    try {
      const response = await request(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) return { status: "unavailable", reason: "network" };
      const body: unknown = await response.json();
      if (!isRecord(body) || !("result" in body))
        return { status: "unavailable", reason: "invalid-content" };
      return { status: "ok", data: body.result };
    } catch {
      return { status: "unavailable", reason: "network" };
    }
  }
  return {
    async campaign(): Promise<ContentResult<Campaign>> {
      const result = await query(campaignQuery);
      if (result.status !== "ok") return result;
      if (result.data === null) return { status: "not-found" };
      return isCampaign(result.data)
        ? { status: "ok", data: result.data }
        : { status: "unavailable", reason: "invalid-content" };
    },
    async article(slug: string): Promise<ContentResult<Article>> {
      if (!isSlug(slug)) return { status: "not-found" };
      const result = await query(
        `*[${publicArticles} && slug.current == $slug][0]{${articleFields},body[]{_key,_type,style,listItem,level,children[]{_key,_type,text,marks},markDefs[]{_key,_type,href}}}`,
        { slug },
      );
      if (result.status !== "ok") return result;
      if (result.data === null) return { status: "not-found" };
      return isArticle(result.data)
        ? { status: "ok", data: result.data }
        : { status: "unavailable", reason: "invalid-content" };
    },
    async articles(page = 1): Promise<ContentResult<ArticlePage>> {
      if (
        !Number.isSafeInteger(page) ||
        page < 1 ||
        !Number.isSafeInteger(page * PAGE_SIZE)
      )
        return { status: "not-found" };
      const start = (page - 1) * PAGE_SIZE;
      const result = await query(
        `{"total":count(*[${publicArticles}]),"items":*[${publicArticles}] | order(publishedAt desc,_id asc)[${start}...${start + PAGE_SIZE}]{${articleFields}}}`,
      );
      if (result.status !== "ok") return result;
      const value = result.data;
      if (
        !isRecord(value) ||
        typeof value.total !== "number" ||
        !Number.isSafeInteger(value.total) ||
        value.total < 0 ||
        !Array.isArray(value.items) ||
        value.items.length > PAGE_SIZE ||
        !value.items.every(isArticleSummary)
      )
        return { status: "unavailable", reason: "invalid-content" };
      if (page > 1 && start >= value.total) return { status: "not-found" };
      return {
        status: "ok",
        data: {
          items: value.items,
          total: value.total,
          page,
          pageSize: PAGE_SIZE,
        },
      };
    },
  };
}
