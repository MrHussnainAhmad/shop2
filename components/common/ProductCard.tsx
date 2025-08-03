"use client";

import { FEATURED_PRODUTSResult } from "@/sanity.types";
import { image } from "@/sanity/image";
import Link from "next/link";
import React from "react";

type ProductCardProps = {
  product: FEATURED_PRODUTSResult[0];
};

const ProductCard = ({ product }: ProductCardProps) => {
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

  // State for cart items
  const [quantity, setQuantity] = React.useState(0);

  // Handle quantity changes
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
    }
    // If quantity goes to 0, it should stay at 0 (not go back to "Add to Cart" immediately)
  };

  // Handle add to cart
  const handleAddToCart = () => {
    setQuantity(1);
  };

  // Get actual price (discounted if applicable)
  const actualPrice = showDiscount && product.originalPrice
    ? (product.originalPrice - discountAmount)
    : product?.originalPrice || 0;

  // Check if item is in cart
  const inCart = quantity > 0;

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
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
          {product?.category?.name ?? 'General'}
        </p>

        {/* Product Name - Single line with ellipsis */}
        <Link href={`/product/${product?.slug?.current}`}>
          <h3 className="font-medium text-gray-900 text-sm mb-2 truncate hover:text-blue-600 transition-colors">
            {product?.name || 'Unnamed Product'}
          </h3>
        </Link>

        {/* Stock Status */}
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

        {/* Add to Cart or In Cart */}
        {!inCart ? (
          /* Not in Cart State */
          <button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={product?.stock === 0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        ) : (
          /* In Cart State */
          <div className="space-y-3">
            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Quantity</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="min-w-[2rem] text-center font-medium text-gray-900">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Increase quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Subtotal */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">Subtotal</span>
              <span className="text-lg font-bold text-orange-600">
                ${(quantity * actualPrice).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
