import { gql, GraphQLClient } from "graphql-request";

export type ProductsResponse = {
  products: {
    edges: {
      node: {
        id: string;
        title: string;
        handle: string;
        description: string;
        featuredImage: {
          url: string;
          altText: string;
        };
        images: {
          edges: {
            node: {
              src: string;
            };
          }[];
        };
      };
    }[];
  };´
};

const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2025-10/graphql.json`;

const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token":
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  const query = gql`
    query Products {
      products(first: 8) {
        edges {
          node {
            id
            title
            handle
            description
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const res = await shopifyClient.request<ProductsResponse>(query);
  return res.products.edges.map((e) => e.node);
};

export const createCheckoutUrl = (variantId: string) => {
  const cleanId = variantId.split("/").pop();
  return `https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${cleanId}:1`;
};
