"use client";

import { FEATURED_PRODUTSResult } from "@/sanity.types";
import { image } from "@/sanity/image";
import Link from "next/link";
import React, { useState } from "react";
import AddToCart from "./AddToCart";

type ProductCardProps = {
  product: FEATURED_PRODUTSResult[0];
};

const ProductCard = ({ product }: ProductCardProps) => {
  // Manage quantity controls visibility
  const [quantityControlsVisible, setQuantityControlsVisible] = useState(false);

  // Get image URL handling both Sanity images and URL images
  const getImageUrl = () => {
    if (product?.images && product.images.length > 0) {
      const firstImage = product.images[0];

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

  // Calculate discount amount
  const discountAmount = product?.originalPrice && product?.discount && product.discount > 0
    ? (product.originalPrice * product.discount) / 100 
    : 0;
  
  // Only show discount if discount exists and is greater than 0
  const showDiscount = !!(product?.discount && product.discount > 0 && discountAmount > 0);

  // Get actual price (discounted if applicable)
  const actualPrice = showDiscount && product.originalPrice
    ? (product.originalPrice - discountAmount)
    : product?.originalPrice || 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Discount Badge - Only show if discount is greater than 0 */}
        {showDiscount && product.discount && product.discount > 0 && (
          <div className="absolute top-2.5 -left-2.5 bg-purple-600 text-white px-4 py-1 text-xs font-semibold rounded-full z-10">
            Save: ${Math.round(discountAmount)} (-{product.discount}%)
          </div>
        )}
        
        {/* Product Image */}
        <Link href={`/product/${product?.slug?.current}`} className="block">
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img
              src={imageUrl || '/placeholder-product.jpg'}
              alt={product?.name || "Product image"}
              className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>

      <div className="p-4">
        {/* Category */}
        {!quantityControlsVisible && (
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
            {product?.category?.name ?? 'General'}
          </p>
        )}

        {/* Product Name - Single line with ellipsis */}
        <Link href={`/product/${product?.slug?.current}`}>
          <h3 className="font-medium text-gray-900 text-sm mb-2 truncate hover:text-blue-600 transition-colors">
            {product?.name || 'Unnamed Product'}
          </h3>
        </Link>

        {/* Stock Status */}
        {!quantityControlsVisible && (
          <div className="mb-3">
            {product?.stock === 0 ? (
              <span className="text-red-600 text-xs font-medium">Out of Stock</span>
            ) : product?.stock && product.stock > 0 ? (
              <span className="text-green-600 text-xs font-medium">
                {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            ) : (
              <span className="text-gray-600 text-xs">Stock info unavailable</span>
            )}
          </div>
        )}

        {/* Price */}
        {product?.originalPrice && product.originalPrice > 0 && (
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-semibold text-orange-600">
              ${actualPrice.toFixed(2)}
            </span>
            {showDiscount && product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}

        {/* Add to Cart Component */}
        <AddToCart 
          product={product} 
          variant="compact" 
          onQuantityControlsToggle={setQuantityControlsVisible} 
        />
      </div>
    </div>
  );
};

export default ProductCard;
