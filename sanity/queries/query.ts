import { defineQuery } from "next-sanity";

export const BANNER_QUERY = defineQuery(`*[_type == "banner" && (isMiniBanner != true)] {
  _id,
  name,
  description,
  link,
  slug,
  badge,
  discountAmount,
  image,
  imageUrl,
  isMiniBanner
} | order(_createdAt desc)`);

export const MINI_BANNER_QUERY = defineQuery(`*[_type == "banner" && isMiniBanner == true] {
  _id,
  name,
  description,
  link,
  slug,
  badge,
  discountAmount,
  image,
  imageUrl,
  isMiniBanner
} | order(_createdAt desc)`);

export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"] {
  _id,
  name,
  slug,
  image,
  imageUrl,
  description
} | order(_createdAt desc)`);


export const FEATURED_PRODUTS = defineQuery(`*[_type == "product" && featured == true] {
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
  tags
} | order(_createdAt desc)`)

export const BRANDS = defineQuery(`*[_type == "brand"] {
  _id,
  name,
  slug,
  logo,
  logoUrl,
  description
} | order(_createdAt desc)`)
