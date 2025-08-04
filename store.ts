import { Product } from "./sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  product: Product;
  quantity: number;
  appliedCoupon?: {
    code: string;
    discount: number;
  };
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemQuantity: (productId: string) => number;
  applyCouponToItem: (productId: string, couponCode: string) => { success: boolean; message: string; discount?: number };
  removeCouponFromItem: (productId: string) => void;
  getItemPrice: (item: CartItem) => number;
}

const useCartStore = create<StoreState>()(  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        const items = get().items;
        const existingItem = items.find(item => item.product._id === product._id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },
      
      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.product._id !== productId)
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.product._id === productId
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = get().getItemPrice(item);
          return total + (price * item.quantity);
        }, 0);
      },
      
      getItemPrice: (item: CartItem) => {
        const originalPrice = item.product.originalPrice || 0;
        const productDiscount = item.product.discount || 0;
        
        // Apply product discount first
        let price = originalPrice - (originalPrice * productDiscount / 100);
        
        // Apply coupon discount if any
        if (item.appliedCoupon) {
          price = price - (price * item.appliedCoupon.discount / 100);
        }
        
        return Math.max(0, price); // Ensure price is never negative
      },
      
      applyCouponToItem: (productId: string, couponCode: string) => {
        const items = get().items;
        const item = items.find(item => item.product._id === productId);
        
        if (!item) {
          return { success: false, message: "Product not found in cart" };
        }
        
        // Check if product has a coupon code
        if (!item.product.couponCode?.code || !item.product.couponCode?.discount) {
          return { success: false, message: "This product doesn't have any coupon codes available" };
        }
        
        // Check if coupon code matches
        if (item.product.couponCode.code.toUpperCase() !== couponCode.toUpperCase()) {
          return { success: false, message: "Invalid coupon code for this product" };
        }
        
        // Check if coupon is already applied
        if (item.appliedCoupon?.code === couponCode.toUpperCase()) {
          return { success: false, message: "Coupon code already applied to this product" };
        }
        
        // Apply the coupon
        set({
          items: items.map(cartItem =>
            cartItem.product._id === productId
              ? { 
                  ...cartItem, 
                  appliedCoupon: {
                    code: couponCode.toUpperCase(),
                    discount: item.product.couponCode.discount
                  }
                }
              : cartItem
          )
        });
        
        return { 
          success: true, 
          message: `Coupon ${couponCode.toUpperCase()} applied! Additional ${item.product.couponCode.discount}% discount added`,
          discount: item.product.couponCode.discount
        };
      },
      
      removeCouponFromItem: (productId: string) => {
        const items = get().items;
        set({
          items: items.map(item =>
            item.product._id === productId
              ? { ...item, appliedCoupon: undefined }
              : item
          )
        });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getItemQuantity: (productId: string) => {
        const item = get().items.find(item => item.product._id === productId);
        return item ? item.quantity : 0;
      }
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;
