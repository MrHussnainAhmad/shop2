import { sanityFetch } from "../lib/live";
import { BANNER_QUERY, MINI_BANNER_QUERY,FEATURED_PRODUTS , BRANDS, PRODUCT_BY_SLUG, SEARCH_PRODUCTS, ALL_PRODUCTS_DEBUG, ALL_PRODUCTS } from "./query";

export const getBanner = async () => {
  try {
    const { data } = await sanityFetch({ query: BANNER_QUERY });

    return data ?? [];
  } catch (error) {
    console.error("Error fetching banner:", error);
    return null;
  }
};

export const getMiniBanner = async () => {
  try {
    const { data } = await sanityFetch({ query: MINI_BANNER_QUERY });

    return data ?? [];
  } catch (error) {
    console.error("Error fetching mini banner:", error);
    return null;
  }
};

export const getCategories = async (quantity?: number) => {
  try {
    const quer = quantity
      ? `*[_type == "category"] | order(name asc)[0...${quantity}]{
    ...,
    "productCount": count(*[_type == "product" && references(^._id)])}`
      : `*[_type == "category"] | order(name asc){
    ...,
    "productCount": count(*[_type == "product" && references(^._id)])}`;

    const { data } = await sanityFetch({ query: quer, params: quantity ? { quantity } : {} });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

export const getFeaturedProducts = async () =>{
  try {
    const {data} = await sanityFetch({query: FEATURED_PRODUTS});
    return data ?? [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return null;
  }
}

export const getAllBrands = async () =>{
  try {
    const {data} = await sanityFetch({query: BRANDS});
    return data ?? [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return null;
  }
}

export const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({ query: PRODUCT_BY_SLUG, params: { slug } });
    return data ?? null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

export const searchProducts = async (searchTerm: string) => {
  try {
    const { data } = await sanityFetch({ query: SEARCH_PRODUCTS, params: { searchTerm: `*${searchTerm}*` } });
    return data ?? [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const getAllProductsDebug = async () => {
  try {
    const { data } = await sanityFetch({ query: ALL_PRODUCTS_DEBUG });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching all products for debug:", error);
    return [];
  }
};

export const getAllProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: ALL_PRODUCTS });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};
