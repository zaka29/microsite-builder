import { createClient } from "@sanity/client";

export const cmsClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

export async function getCampaignBySlug(slug: string) {
  const query = `
    *[_type == "micrositeCampaign" && slug.current == $slug][0]{
      title,
      heroImage,
      description,
      products[]{
        shopifyProductId,
        title
      }
    }
  `;
  return await cmsClient.fetch(query, { slug });
}
