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
  appliedVoucher: { code: string; discount: number } | null;
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
  applyVoucher: (voucherCode: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  getAppliedCoupons: () => { code: string; discount: number; productId: string; productName: string }[];
}

const useCartStore = create<StoreState>()(  persist(
    (set, get) => ({
      items: [],
      appliedVoucher: null,
      
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
        const items = get().items;
        
        // Calculate total for deal products (no voucher discount applied)
        const dealItemsTotal = items
          .filter(item => item.product.isOnDeal)
          .reduce((total, item) => {
            const price = get().getItemPrice(item);
            return total + (price * item.quantity);
          }, 0);
        
        // Calculate total for regular products
        const regularItemsTotal = items
          .filter(item => !item.product.isOnDeal)
          .reduce((total, item) => {
            const price = get().getItemPrice(item);
            return total + (price * item.quantity);
          }, 0);
        
        // Apply voucher discount only to regular products
        const voucher = get().appliedVoucher;
        let finalRegularTotal = regularItemsTotal;
        if (voucher && regularItemsTotal > 0) {
          finalRegularTotal = regularItemsTotal - (regularItemsTotal * voucher.discount / 100);
        }
        
        return dealItemsTotal + finalRegularTotal;
      },
      
      getItemPrice: (item: CartItem) => {
        const originalPrice = item.product.originalPrice || 0;
        
        // Check if product is on deal
        if (item.product.isOnDeal && item.product.dealPercentage) {
          // For deal products, only apply deal discount
          return originalPrice - (originalPrice * item.product.dealPercentage / 100);
        }
        
        // For regular products, apply regular discount first
        const productDiscount = item.product.discount || 0;
        let price = originalPrice - (originalPrice * productDiscount / 100);
        
        // Apply coupon discount if any and product is not on deal
        if (item.appliedCoupon && !item.product.isOnDeal) {
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
        
        // Check if product is on deal - deal products cannot use coupons
        if (item.product.isOnDeal) {
          return { success: false, message: "Deal products cannot be combined with coupon codes" };
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
      },
      
      applyVoucher: (voucherCode: string) => {
        const items = get().items;
        
        // Check if cart has only deal products
        const regularItems = items.filter(item => !item.product.isOnDeal);
        if (regularItems.length === 0) {
          return { success: false, message: 'Voucher codes cannot be applied to deal products only' };
        }
        
        // Mock voucher validation - in real app, this would validate against backend
        const validVouchers = {
          'SAVE10': 10,
          'SAVE20': 20,
          'WELCOME': 15
        };
        
        const discount = validVouchers[voucherCode.toUpperCase() as keyof typeof validVouchers];
        
        if (!discount) {
          return { success: false, message: 'Invalid voucher code' };
        }
        
        if (get().appliedVoucher?.code === voucherCode.toUpperCase()) {
          return { success: false, message: 'Voucher already applied' };
        }
        
        set({ appliedVoucher: { code: voucherCode.toUpperCase(), discount } });
        return { success: true, message: `Voucher applied! ${discount}% discount on eligible items (excludes deal products)` };
      },
      
      removeVoucher: () => {
        set({ appliedVoucher: null });
      },
      
      getAppliedCoupons: () => {
        return get().items
          .filter(item => item.appliedCoupon)
          .map(item => ({
            code: item.appliedCoupon!.code,
            discount: item.appliedCoupon!.discount,
            productId: item.product._id,
            productName: item.product.name || 'Unknown Product'
          }));
      }
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;
