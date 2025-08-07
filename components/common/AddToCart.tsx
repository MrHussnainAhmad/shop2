"use client";

import { Product } from "@/types";
import React from "react";
import useCartStore from "@/store";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

interface AddToCartProps {
  product: Product;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onQuantityControlsToggle?: (showing: boolean) => void;
}

const AddToCart = ({
  product,
  variant = "default",
  className = "",
  onQuantityControlsToggle,
}: AddToCartProps) => {
  const [mounted, setMounted] = React.useState(false);
  const [showQuantityControls, setShowQuantityControls] = React.useState(false);
  const [localQuantity, setLocalQuantity] = React.useState(1);
  const { addItem, getItemQuantity } = useCartStore();
  const cartQuantity = mounted ? getItemQuantity(product?._id || "") : 0;

  // Ensure component is mounted before accessing cart state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle showing quantity controls (first step)
  const handleShowQuantityControls = () => {
    setShowQuantityControls(true);
    onQuantityControlsToggle?.(true);
  };

  // Handle quantity changes for local quantity
  const handleQuantityChange = (change: number) => {
    const newQuantity = localQuantity + change;
    if (newQuantity >= 1) {
      setLocalQuantity(newQuantity);
    }
  };

  // Handle actual add to cart (second step)
  const handleActualAddToCart = () => {
    if (product && (product?.stock as number) >= localQuantity) {
      // Add the specified quantity to cart
      for (let i = 0; i < localQuantity; i++) {
        addItem(product);
      }
      toast.success(
        `${product?.name?.substring(0, 15)}... (${localQuantity}) added to cart!`,
        {
          duration: 2000,
        }
      );
      // Reset the controls
      setShowQuantityControls(false);
      setLocalQuantity(1);
      onQuantityControlsToggle?.(false);
    }
  };

  // Handle default add to cart (for default variant)
  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success(`${product?.name?.substring(0, 15)}... added to cart!`, {
        duration: 2000,
      });
    }
  };

  // Calculate prices
  const originalPrice = product?.originalPrice || 0;
  const discount = product?.discount || 0;
  const finalPrice = originalPrice - (originalPrice * discount) / 100;
  const isOutOfStock = product?.stock === 0;

  // Compact variant (for ProductCard)
  if (variant === "compact") {
    return (
      <div className={className}>
        {!showQuantityControls ? (
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
              handleShowQuantityControls();
            }}
            disabled={isOutOfStock}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to Cart
          </button>
        ) : (
          <div className="space-y-3">
            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Decrease quantity"
                  disabled={localQuantity <= 1}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="min-w-[2rem] text-center font-medium text-gray-900">
                  {localQuantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Increase quantity"
                  disabled={localQuantity >= (product?.stock || 1)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">
                Subtotal
              </span>
              <span className="text-lg font-bold text-orange-600">
                ${(localQuantity * finalPrice).toFixed(2)}
              </span>
            </div>

            {/* Final Add to Cart Button */}
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors text-sm"
              onClick={handleActualAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>
    );
  }

  // Initialize state for detailed variant
  const [detailedQuantity, setDetailedQuantity] = React.useState(1);

  // Detailed variant (for ProductDetails)
  if (variant === "detailed") {

    const handleDetailedAddToCart = () => {
      if (product) {
        // Add the specified quantity to cart
        for (let i = 0; i < detailedQuantity; i++) {
          addItem(product);
        }
      }
    };

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="quantity"
              className="font-medium text-custom-navBar"
            >
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setDetailedQuantity(Math.max(1, detailedQuantity - 1))}
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
                value={detailedQuantity}
                onChange={(e) =>
                  setDetailedQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 px-2 py-1 text-center border-0 focus:outline-none"
                disabled={isOutOfStock}
              />
              <button
                onClick={() =>
                  setDetailedQuantity(
                    Math.min(product?.stock || 1, detailedQuantity + 1)
                  )
                }
                className="px-3 py-1 hover:bg-gray-100 transition-colors"
                disabled={isOutOfStock}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleDetailedAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-custom-sec1 hover:bg-custom-sec2 text-custom-navBar border border-custom-navBar/20"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    );
  }

  // Default variant
  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isOutOfStock
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-600 text-white"
      } ${className}`}
    >
      <ShoppingCart className="w-4 h-4" />
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
