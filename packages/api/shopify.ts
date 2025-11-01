import { gql, GraphQLClient } from "graphql-request";

const SHOPIFY_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  process.env.SANITY_STUDIO_SHOPIFY_STORE_DOMAIN;

const SHOPIFY_TOKEN =
  process.env.NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN ||
  process.env.SANITY_STUDIO_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export type EdgeNode = {
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

export type ProductsResponse = {
  products: {
    edges: {
      node: EdgeNode;
    }[];
  };
};

export type ProductsByIdsResponse = {
  nodes: Array<{
    id: string;
    title: string;
    handle: string;
    description: string;
    featuredImage: {
      url: string;
      altText: string;
    } | null;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    } | null;
  } | null>;
};

const endpoint = `https://${SHOPIFY_DOMAIN}/api/2025-10/graphql.json`;

const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  const query = gql`
    query Products {
      products(first: 250) {
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

export async function getProductsByIds(ids: string[]) {
  if (!ids?.length) return [];

  const globalIds = ids.map((id) =>
    id.startsWith("gid://") ? id : `gid://shopify/Product/${id}`,
  );

  const query = `
    query getProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
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
  `;

  const data = await shopifyClient.request<ProductsByIdsResponse>(query, {
    ids: globalIds,
  });
  return data.nodes.filter(Boolean);
}

export async function getProductsBySearch(searchTerm: string) {
  const query = `
    query searchProducts($query: String!) {
      products(first: 10, query: $query) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;
  const data = await shopifyClient.request<ProductsResponse>(query, {
    query: searchTerm,
  });

  console.log("data ", data);

  return data.products.edges.map((e: any) => e.node);
}

export const createCheckoutUrl = (variantId: string) => {
  const cleanId = variantId.split("/").pop();
  return `https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${cleanId}:1`;
};
