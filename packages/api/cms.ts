import { createClient } from "@sanity/client";

export const cmsClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

export async function getCampaignBySlug(slug: string) {
  return cmsClient.fetch(
    `*[_type == "micrositeCampaign" && slug.current == $slug][0]{
      title,
      description,
      heroImage,
      "heroImageUrl": heroImage.asset->url,
      selectedProducts
    }`,
    { slug },
  );
}
