import { sanityFetch } from "../lib/live";
import { BANNER_QUERY, MINI_BANNER_QUERY,FEATURED_PRODUTS , BRANDS } from "./query";

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