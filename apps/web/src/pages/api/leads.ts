import type { APIRoute } from "astro";
import { cms } from "../../lib/cms/server";
import { createLeadHandler } from "../../lib/leads/handler";

const handle = createLeadHandler(
  {
    projectId: import.meta.env.SANITY_PROJECT_ID,
    dataset: import.meta.env.SANITY_LEADS_DATASET,
    contentDataset: import.meta.env.SANITY_DATASET,
    token: import.meta.env.SANITY_LEADS_WRITE_TOKEN,
  },
  () => cms.campaign(),
);

export const ALL: APIRoute = ({ request }) => handle(request);
