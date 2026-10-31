import { createContentReader } from "./reader";

if (!import.meta.env.SSR) throw new Error("CMS reads must run on the server.");

export const cms = createContentReader({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET,
});
