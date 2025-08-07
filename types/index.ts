// Product types to replace Sanity types
export interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  images?: string[]; // Now direct URLs from Cloudinary
  originalPrice: number;
  discount?: number;
  sku: string;
  stock: number;
  status?: string;
  variant?: string;
  category?: Category;
  brand?: Brand;
  featured?: boolean;
  customAttributes?: Array<{
    name: string;
    value: string;
  }>;
  tags?: string[];
  coupon?: {
    name: string;
    value: number;
  };
  couponCode?: {
    code: string;
    discount: number;
  };
  isOnDeal?: boolean;
  dealPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: string; // Direct URL from Cloudinary
  imageUrl?: string; // Alternative field for image URL
  parent?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  logo?: string; // Direct URL from Cloudinary
  imageUrl?: string; // Alternative field for logo URL
  featured?: boolean;
  voucher?: {
    name: string;
    value: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Banner {
  _id: string;
  name?: string;
  title?: string;
  subtitle?: string;
  image?: string; // Direct URL from Cloudinary
  imageUrl?: string;
  link?: string;
  badge?: string;
  discountAmount?: number;
  buttonText?: string;
  isActive?: boolean;
  type?: 'main' | 'mini';
  createdAt?: string;
  updatedAt?: string;
}

// Types for API responses
export type FEATURED_PRODUCTSResult = Product[];
