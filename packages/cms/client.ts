import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: "production",
  useCdn: true,
  apiVersion: "2025-01-01",
});
