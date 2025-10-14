import { gql, GraphQLClient } from "graphql-request";

type ProductsResponse = {
  products: {
    edges: {
      node: {
        id: string;
        title: string;
        handle: string;
        images: {
          edges: {
            node: {
              src: string;
            };
          }[];
        };
      };
    }[];
  };
};

const client = new GraphQLClient(process.env.SHOPIFY_STOREFRONT_API!);

export const getProducts = async () => {
  const query = gql`
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await client.request<ProductsResponse>(query);
  return res.products.edges.map((e) => e.node);
};
