const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const leadsDataset = process.env.SANITY_STUDIO_LEADS_DATASET;

if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(
    "Set SANITY_STUDIO_PROJECT_ID to a valid public project ID in apps/studio/.env.local.",
  );
}
if (!dataset || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(dataset)) {
  throw new Error(
    "Set SANITY_STUDIO_DATASET to a valid dataset name in apps/studio/.env.local.",
  );
}

if (
  !leadsDataset ||
  !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(leadsDataset) ||
  leadsDataset === dataset
) {
  throw new Error(
    "Set SANITY_STUDIO_LEADS_DATASET to a separate private dataset name in apps/studio/.env.local.",
  );
}

export const studioEnv = { projectId, dataset };
export const leadsEnv = { projectId, dataset: leadsDataset };
