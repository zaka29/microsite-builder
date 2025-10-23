import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SHOPIFY_STOREFRONT_API_URL: process.env.SHOPIFY_STOREFRONT_API_URL,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN:
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
