"use client";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import useCartStore from '@/store';

const Carticon = () => {
  const [mounted, setMounted] = React.useState(false);
  const { getTotalItems } = useCartStore();
  const cartCount = mounted ? getTotalItems() : 0;
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 justify-end group p-1 focus:outline-none rounded"
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <span className="relative">
        <ShoppingBag 
          className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:text-white hoverEffect drop-shadow-sm" 
          aria-hidden="true"
        />
        {cartCount > 0 && (
          <span 
            className="absolute -top-2 -right-2 min-w-[18px] h-[18px] text-[10px] font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg"
            aria-label={`${cartCount} items`}
            style={{
              background: cartCount > 0 ? 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)' : '',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
            }}
          >
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </span>
      <div className="hidden lg:flex flex-col">
        <h4 className="text-base font-bold text-white group-hover:text-orange-500 hoverEffect">
          Cart
        </h4>
        <p className="text-xs whitespace-nowrap">View Cart</p>
      </div>
    </Link>
  );
};

export default Carticon;
