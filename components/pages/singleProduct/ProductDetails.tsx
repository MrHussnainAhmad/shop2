"use client";

import { Product } from "@/types";
import React, { useState } from "react";
import { Heart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddToCart from "@/components/common/AddToCart";
import useCartStore from "@/store";
import useWishlistStore from "@/store/wishlistStore";
import toast from "react-hot-toast";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const isWishlisted = mounted ? isInWishlist(product._id) : false;

  // Calculate final price considering deal vs regular discount
  const originalPrice = product?.originalPrice || 0;
  const dealPercentage = product?.dealPercentage || 0;
  const regularDiscount = product?.discount || 0;
  
  // Use deal discount if product is on deal, otherwise use regular discount
  const isOnDeal = product?.isOnDeal && dealPercentage > 0;
  const effectiveDiscount = isOnDeal ? dealPercentage : regularDiscount;
  const finalPrice = originalPrice - (originalPrice * effectiveDiscount / 100);

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast.success(`${product?.name?.substring(0, 15)}... removed from wishlist!`, {
        duration: 2000,
      });
    } else {
      addToWishlist(product);
      toast.success(`${product?.name?.substring(0, 15)}... added to wishlist!`, {
        duration: 2000,
      });
    }
  };

  const isOutOfStock = product?.stock === 0;

  return (
    <div className="space-y-6">
      {/* Product Title and Status */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-custom-navBar">
            {product?.name}
          </h1>
          {product?.status && (
            <Badge
              variant={product.status === "Out of Stock" ? "destructive" : "default"}
              className={`
                ${product.status === "Hot" ? "bg-red-500 text-white" : ""}
                ${product.status === "New" ? "bg-green-500 text-white" : ""}
                ${product.status === "Sale" ? "bg-orange-500 text-white" : ""}
                ${product.status === "Ending" ? "bg-purple-500 text-white" : ""}
                ${product.status === "Last Piece" ? "bg-yellow-500 text-black" : ""}
              `}
            >
              {product.status}
            </Badge>
          )}
        </div>
        
        {/* Product Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">(4.0) · 24 reviews</span>
        </div>
      </div>

      {/* Deal Alert for Deal Products */}
      {isOnDeal && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 font-bold text-lg">🔥 SPECIAL DEAL</span>
            <Badge className="bg-red-600 text-white">
              {dealPercentage}% OFF
            </Badge>
          </div>
          <p className="text-red-800 text-sm font-medium">
            ⚠️ This product is on a special deal. Coupon codes and vouchers cannot be applied to deal products.
          </p>
        </div>
      )}

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className={`text-3xl font-bold ${
            isOnDeal ? 'text-red-600' : 'text-custom-navBar'
          }`}>
            ${finalPrice.toFixed(2)}
          </span>
          {effectiveDiscount > 0 && (
            <>
              <span className="text-xl text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <Badge variant="destructive" className={isOnDeal ? "bg-red-600" : "bg-red-500"}>
                -{effectiveDiscount}%{isOnDeal ? ' DEAL' : ''}
              </Badge>
            </>
          )}
        </div>
        {product?.sku && (
          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
        )}
      </div>

      {/* Description */}
      {product?.description && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-custom-navBar">Description</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-gray-200">
        {product?.category && (
          <div>
            <span className="font-medium text-custom-navBar">Category:</span>
            <span className="ml-2 text-gray-700">{product.category.name}</span>
          </div>
        )}
        {product?.brand && (
          <div>
            <span className="font-medium text-custom-navBar">Brand:</span>
            <span className="ml-2 text-gray-700">{product.brand.name}</span>
          </div>
        )}
        {product?.variant && (
          <div>
            <span className="font-medium text-custom-navBar">Variant:</span>
            <span className="ml-2 text-gray-700">{product.variant}</span>
          </div>
        )}
        <div>
          <span className="font-medium text-custom-navBar">Stock:</span>
          <span className={`ml-2 ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
            {isOutOfStock ? "Out of Stock" : `${product?.stock} available`}
          </span>
        </div>
      </div>

      {/* Custom Attributes */}
      {product?.customAttributes && product.customAttributes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-custom-navBar">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.customAttributes.map((attr, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-custom-navBar">{attr.name}:</span>
                <span className="text-gray-700">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {product?.tags && product.tags.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-custom-navBar">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart and Wishlist */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="quantity" className="font-medium text-custom-navBar">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 hover:bg-gray-100 transition-colors"
                disabled={isOutOfStock}
              >
                -
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product?.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 px-2 py-1 text-center border-0 focus:outline-none"
                disabled={isOutOfStock}
              />
              <button
                onClick={() => setQuantity(Math.min(product?.stock || 1, quantity + 1))}
                className="px-3 py-1 hover:bg-gray-100 transition-colors"
                disabled={isOutOfStock}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Add to Cart and Heart Button */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              // Add the specified quantity to cart
              if (product) {
                for (let i = 0; i < quantity; i++) {
                  addItem(product);
                }
                toast.success(`${product?.name?.substring(0,15)}... (${quantity}) added to cart!`, {
                  duration: 2000,
                });
              }
            }}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-custom-sec1 hover:bg-custom-sec2 text-custom-navBar border border-custom-navBar/20"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          
          <button
            onClick={handleWishlist}
            className={`group relative w-12 h-12 rounded-lg border transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
              isWishlisted
                ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-600 shadow-lg shadow-red-100"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-red-50 hover:border-red-200 hover:text-red-500 hover:shadow-md"
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isWishlisted 
                  ? "fill-current text-red-500" 
                  : "group-hover:text-red-500 group-hover:scale-110"
              }`} 
            />
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className={`absolute inset-0 bg-red-400 opacity-0 group-active:opacity-20 transition-opacity duration-150`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Truck className="w-6 h-6 text-custom-navBar" />
          <div>
            <p className="font-medium text-sm">Free Shipping</p>
            <p className="text-xs text-gray-600">On orders over $50</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Shield className="w-6 h-6 text-custom-navBar" />
          <div>
            <p className="font-medium text-sm">Secure Payment</p>
            <p className="text-xs text-gray-600">100% secure payment</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <RotateCcw className="w-6 h-6 text-custom-navBar" />
          <div>
            <p className="font-medium text-sm">Easy Returns</p>
            <p className="text-xs text-gray-600">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
