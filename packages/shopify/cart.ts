export const createCheckoutUrl = (variantId: string) => {
  return `https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${variantId}:1`;
};
