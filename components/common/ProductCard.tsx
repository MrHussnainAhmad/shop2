"use client";

import { FEATURED_PRODUTSResult } from "@/sanity.types";
import { image } from "@/sanity/image";
import Link from "next/link";
import React, { useState } from "react";
import AddToCart from "./AddToCart";

// Flexible product type for ProductCard
type ProductCardProduct = {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  images?: any[];
  originalPrice: number;
  discount?: number;
  sku: string;
  stock: number;
  status?: string;
  variant?: string;
  category?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  brand?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  featured?: boolean;
  customAttributes?: any[];
  tags?: string[];
  couponCode?: {
    code: string;
    discount: number;
  };
  isOnDeal?: boolean;
  dealPercentage?: number;
};

type ProductCardProps = {
  product?: FEATURED_PRODUTSResult[0]; // For backward compatibility
  // New flexible props for direct product data
  _id?: string;
  name?: string;
  slug?: { current: string };
  description?: string;
  images?: any[];
  originalPrice?: number;
  discount?: number;
  sku?: string;
  stock?: number;
  status?: string;
  variant?: string;
  category?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  brand?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  featured?: boolean;
  customAttributes?: any[];
  tags?: string[];
  couponCode?: {
    code: string;
    discount: number;
  };
  isOnDeal?: boolean;
  dealPercentage?: number;
};

const ProductCard = ({ product, ...directProps }: ProductCardProps) => {
  // Create product object from either product prop or direct props
  const productData: ProductCardProduct = product || {
    _id: directProps._id || '',
    name: directProps.name || '',
    slug: directProps.slug || { current: '' },
    description: directProps.description,
    images: directProps.images,
    originalPrice: directProps.originalPrice || 0,
    discount: directProps.discount,
    sku: directProps.sku || '',
    stock: directProps.stock || 0,
    status: directProps.status,
    variant: directProps.variant,
    category: directProps.category,
    brand: directProps.brand,
    featured: directProps.featured,
    customAttributes: directProps.customAttributes,
    tags: directProps.tags,
    couponCode: directProps.couponCode,
    isOnDeal: directProps.isOnDeal,
    dealPercentage: directProps.dealPercentage,
  };

  // Manage quantity controls visibility
  const [quantityControlsVisible, setQuantityControlsVisible] = useState(false);

  // Get image URL handling both Sanity images and URL images
  const getImageUrl = () => {
    if (productData?.images && productData.images.length > 0) {
      const firstImage = productData.images[0];

      if (firstImage._type === "image") {
        // Sanity image - use image() function with 900x700 dimensions
        return image(firstImage).width(900).height(700).url();
      } else if (firstImage._type === "imageUrl" && firstImage.url) {
        // URL image - use direct URL
        return firstImage.url;
      }
    }
    return null;
  };

  const imageUrl = getImageUrl();

  // Calculate deal discount amount if product is on deal
  const dealDiscountAmount = productData?.originalPrice && productData?.isOnDeal && productData?.dealPercentage && productData.dealPercentage > 0
    ? (productData.originalPrice * productData.dealPercentage) / 100
    : 0;

  // Calculate regular discount amount
  const regularDiscountAmount = productData?.originalPrice && productData?.discount && productData.discount > 0
    ? (productData.originalPrice * productData.discount) / 100 
    : 0;

  // Use deal discount if product is on deal, otherwise use regular discount
  const discountAmount = productData?.isOnDeal ? dealDiscountAmount : regularDiscountAmount;
  const discountPercentage = productData?.isOnDeal ? productData.dealPercentage : productData?.discount;
  
  // Only show discount if discount exists and is greater than 0
  const showDiscount = !!(discountPercentage && discountPercentage > 0 && discountAmount > 0);

  // Get actual price (discounted if applicable)
  const actualPrice = showDiscount && productData.originalPrice
    ? (productData.originalPrice - discountAmount)
    : productData?.originalPrice || 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Deal Badge - Priority for deal products */}
        {productData?.isOnDeal && productData?.dealPercentage && productData.dealPercentage > 0 && (
          <div className="absolute top-2.5 -left-2.5 bg-red-600 text-white px-4 py-1 text-xs font-semibold rounded-full z-10">
            DEAL: {productData.dealPercentage}% OFF
          </div>
        )}
        
        {/* Regular Discount Badge - Only show if not on deal and discount exists */}
        {!productData?.isOnDeal && showDiscount && discountPercentage && discountPercentage > 0 && (
          <div className="absolute top-2.5 -left-2.5 bg-purple-600 text-white px-4 py-1 text-xs font-semibold rounded-full z-10">
            Save: ${Math.round(discountAmount)} (-{discountPercentage}%)
          </div>
        )}
        
        {/* Product Image */}
        <Link href={`/product/${productData?.slug?.current}`} className="block">
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img
              src={imageUrl || '/placeholder-product.jpg'}
              alt={productData?.name || "Product image"}
              className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>

      <div className="p-4">
        {/* Category */}
        {!quantityControlsVisible && (
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
            {productData?.category?.name ?? 'General'}
          </p>
        )}

        {/* Product Name - Single line with ellipsis */}
        <Link href={`/product/${productData?.slug?.current}`}>
          <h3 className="font-medium text-gray-900 text-sm mb-2 truncate hover:text-blue-600 transition-colors">
            {productData?.name || 'Unnamed Product'}
          </h3>
        </Link>


        {/* Stock Status */}
        {!quantityControlsVisible && (
          <div className="mb-3">
            {productData?.stock === 0 ? (
              <span className="text-red-600 text-xs font-medium">Out of Stock</span>
            ) : productData?.stock && productData.stock > 0 ? (
              <span className="text-green-600 text-xs font-medium">
                {productData.stock < 10 ? `Only ${productData.stock} left` : 'In Stock'}
              </span>
            ) : (
              <span className="text-gray-600 text-xs">Stock info unavailable</span>
            )}
          </div>
        )}

        {/* Price */}
        {productData?.originalPrice && productData.originalPrice > 0 && (
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-xl font-semibold ${
              productData?.isOnDeal ? 'text-red-600' : 'text-orange-600'
            }`}>
              ${actualPrice.toFixed(2)}
            </span>
            {showDiscount && productData.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${productData.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}

        {/* Add to Cart Component */}
        <AddToCart 
          product={product || productData} 
          variant="compact" 
          onQuantityControlsToggle={setQuantityControlsVisible} 
        />
      </div>
    </div>
  );
};

export default ProductCard;
export { ProductCard };
