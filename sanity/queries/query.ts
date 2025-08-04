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
  customAttributes,
  tags,
  couponCode
} | order(_createdAt desc)`)

export const BRANDS = defineQuery(`*[_type == "brand"] {
  _id,
  name,
  slug,
  logo,
  logoUrl,
  description
} | order(_createdAt desc)`)

export const PRODUCT_BY_SLUG = defineQuery(`*[_type == "product" && slug.current == $slug][0] {
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
}`);//

export const ALL_PRODUCTS_DEBUG = defineQuery(`*[_type == "product"] {
  _id,
  name,
  slug,
  couponCode
}`);

export const ALL_PRODUCTS = defineQuery(`*[_type == "product"] {
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
} | order(_createdAt desc)`);

export const SEARCH_PRODUCTS = defineQuery(`*[_type == "product" && (name match $searchTerm || slug.current match $searchTerm)] {
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
} | order(_createdAt desc)[0...10]`)
