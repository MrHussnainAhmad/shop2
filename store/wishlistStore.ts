"use client"
import { Product } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  product: Product;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (product: Product) => {
        const items = get().items;
        const existingItem = items.find(item => item.product._id === product._id);
        
        if (!existingItem) {
          set({
            items: [...items, { 
              product, 
              addedAt: new Date().toISOString() 
            }]
          });
        }
      },
      
      removeFromWishlist: (productId: string) => {
        set({
          items: get().items.filter(item => item.product._id !== productId)
        });
      },
      
      isInWishlist: (productId: string) => {
        return get().items.some(item => item.product._id === productId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.length;
      }
    }),
    { name: "wishlist-storage" }
  )
);

export default useWishlistStore;
