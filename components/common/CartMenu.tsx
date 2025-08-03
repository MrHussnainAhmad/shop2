"use client";
import { ShoppingCart, Heart, GitCompare, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useCart } from "../../contexts/CartContext";

const CartMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { cartCount } = useCart();
  // You can add wishlist and compare counts here later
  const wishlistCount = 0;
  const compareCount = 0;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {isOpen && (
        <>
          {/* Shopping Cart */}
          <Link href="/cart">
            <button
              className="relative bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* Heart/Wishlist */}
          <Link href="/FavItems">
            <button
              className="relative bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart size={20} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                  aria-label={`${wishlistCount} items in wishlist`}
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>
          </Link>

          {/* Compare */}
          <Link href="/compare">
            <button
              className="relative bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              aria-label={`Compare with ${compareCount} items`}
            >
              <GitCompare size={20} aria-hidden="true" />
              {compareCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                  aria-label={`${compareCount} items to compare`}
                >
                  {compareCount > 99 ? "99+" : compareCount}
                </span>
              )}
            </button>
          </Link>

        </>
      )}
      
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        aria-label={isOpen ? "Close cart menu" : "Open cart menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <>
            <ShoppingCart size={20} aria-hidden="true" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                aria-label={`${cartCount} items in cart`}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default CartMenu;
