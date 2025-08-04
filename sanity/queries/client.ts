import { createClient } from 'next-sanity';
import { PRODUCT_BY_SLUG, SEARCH_PRODUCTS } from './query';

// Client-side Sanity client for browser use
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-21',
});

// Client-side query with resolved references
const PRODUCT_BY_SLUG_RESOLVED = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  images,
  originalPrice,
  discount,
  sku,
  stock,
  status,
  variant,
  category->{
    _id,
    name,
    slug
  },
  brand->{
    _id,
    name,
    slug
  },
  featured,
  customAttributes,
  tags,
  couponCode
}`;

// Client-side functions for browser use
export const getProductBySlugClient = async (slug: string) => {
  try {
    const product = await client.fetch(PRODUCT_BY_SLUG_RESOLVED, { slug });
    return product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

const SEARCH_PRODUCTS_RESOLVED = `*[_type == "product" && (name match $searchTerm || slug.current match $searchTerm)] {
  _id,
  name,
  slug,
  description,
  images,
  originalPrice,
  discount,
  sku,
  stock,
  status,
  variant,
  category->{
    _id,
    name,
    slug
  },
  brand->{
    _id,
    name,
    slug
  },
  featured,
  customAttributes,
  tags,
  couponCode
} | order(_createdAt desc)[0...10]`;

export const searchProductsClient = async (searchTerm: string) => {
  try {
    const products = await client.fetch(SEARCH_PRODUCTS_RESOLVED, { 
      searchTerm: `*${searchTerm}*` 
    });
    return products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
