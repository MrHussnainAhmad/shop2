"use client"
import React, { useState } from 'react'
import { Trash2, Plus, Minus, ShoppingBag, Truck, Shield, CreditCard, Tag, Percent, MapPin, ShoppingCart, X } from 'lucide-react'
import useCartStore from '@/store'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { useAddresses } from '@/hooks/useAddresses'
import { useAlertModal } from '@/components/ui/alert-modal'

const CartClientPage = () => {
  const { user } = useUser()
  const modal = useAlertModal()
const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalItems,
    applyCouponToItem,
    getItemPrice,
    removeCouponFromItem,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    getAppliedCoupons
  } = useCartStore()
  
  const { getDefaultAddress } = useAddresses();
  const defaultAddress = getDefaultAddress();
  
  const [couponCode, setCouponCode] = useState('')
  const [voucherCode, setVoucherCode] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState('home')
  
  // Get applied coupons from store instead of local state
  const appliedCoupons = getAppliedCoupons()

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Please sign in to view your cart</h2>
            <p className="text-gray-600">You need to be logged in to access your shopping cart.</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Calculate total without coupons for comparison
  const calculateSubtotalWithoutCoupons = () => {
    return items.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || 0;
      const productDiscount = item.product.discount || 0;
      const priceAfterProductDiscount = originalPrice - (originalPrice * productDiscount / 100);
      return total + (priceAfterProductDiscount * item.quantity);
    }, 0);
  };
  
  // Calculate subtotal with coupon discounts but without voucher
  const calculateSubtotalWithCoupons = () => {
    return items.reduce((total, item) => {
      const price = getItemPrice(item);
      return total + (price * item.quantity);
    }, 0);
  };
  
  const subtotalWithoutCoupons = calculateSubtotalWithoutCoupons();
  const subtotalWithCoupons = calculateSubtotalWithCoupons();
  const total = getTotalPrice(); // This includes coupon and voucher discounts
  const couponDiscount = subtotalWithoutCoupons - subtotalWithCoupons;
  const voucherDiscount = appliedVoucher ? (subtotalWithCoupons * appliedVoucher.discount / 100) : 0;

  const applyCoupon = () => {
    if (!couponCode) {
modal.alert('Please enter a coupon code.')
      return;
    }
    
    let hasSuccess = false;
    let messages: string[] = [];
    let dealProductsCount = 0;
    
    items.forEach(item => {
      if (item.product.isOnDeal) {
        dealProductsCount++;
      }
      const result = applyCouponToItem(item.product._id, couponCode);
      messages.push(result.message);
      
      if (result.success) {
        hasSuccess = true;
      }
    });
    
    // Show consolidated message
    if (hasSuccess) {
      let successMessage = 'Coupon applied successfully to applicable products!';
      if (dealProductsCount > 0) {
        successMessage += ` Note: ${dealProductsCount} deal product(s) in your cart cannot use coupon codes.`;
      }
modal.alert(successMessage);
      setCouponCode(''); // Clear the input
    } else {
      // Check if all products are deal products
      if (dealProductsCount === items.length && dealProductsCount > 0) {
modal.alert('🔥 All products in your cart are on special deals! Deal products cannot be combined with coupon codes, but you\'re already getting the best prices.')
      } else {
modal.alert(messages[0] || 'Invalid coupon code')
      }
    }
  }

  const handleApplyVoucher = () => {
    if (!voucherCode) {
modal.alert('Please enter a voucher code.')
      return;
    }
    
    const result = applyVoucher(voucherCode);
modal.alert(result.message)
    
    if (result.success) {
      setVoucherCode(''); // Clear the input
    }
  };
  
  const removeCoupon = (productId: string, code: string) => {
    removeCouponFromItem(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Table Header - Hidden on mobile */}
              <div className="hidden md:block bg-gray-50 px-6 py-4 border-b">
                <div className="grid grid-cols-12 gap-6 text-sm font-medium text-gray-700">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-4 ml-4">Product Name</div>
                  <div className="col-span-2">Model</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-1">Action</div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const price = getItemPrice(item);
                  const itemTotal = price * item.quantity;
                  const originalPrice = item.product.originalPrice || 0;
                  const productDiscount = item.product.discount || 0;
                  const priceBeforeCoupon = originalPrice - (originalPrice * productDiscount / 100);
                  
                  return (
                    <div key={item.product._id} className="p-4 md:p-6">
                      {/* Mobile Layout */}
                      <div className="md:hidden">
                        <div className="flex gap-3 mb-4">
                          <div className="w-16 h-16 relative flex-shrink-0">
                            {item.product.images && item.product.images.length > 0 && (
                              <>
                                {item.product.images[0]._type === 'image' && item.product.images[0].asset ? (
                                  <Image
                                    src={urlFor(item.product.images[0]).url()}
                                    alt={item.product.name || 'Product'}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                ) : item.product.images[0]._type === 'imageUrl' && item.product.images[0].url ? (
                                  <Image
                                    src={item.product.images[0].url}
                                    alt={item.product.images[0].alt || item.product.name || 'Product'}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No Image</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 mb-1 text-sm leading-tight break-words">{item.product.name}</h3>
                            <p className="text-xs text-gray-500 mb-2 truncate">{item.product.sku || 'N/A'}</p>
                            
                            {/* Deal Indicator */}
                            {item.product.isOnDeal && item.product.dealPercentage && (
                              <div className="mb-2">
                                <span className="text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded">
                                  🔥 DEAL {item.product.dealPercentage}% OFF - No Coupons
                                </span>
                              </div>
                            )}
                            
                            <p className={`font-semibold ${
                              item.product.isOnDeal ? 'text-red-600' : 'text-gray-900'
                            }`}>${price.toFixed(2)}</p>
                            
                            {/* Regular discount indicator - only show if not on deal */}
                            {!item.product.isOnDeal && item.product.discount && item.product.discount > 0 && (
                              <p className="text-xs text-green-600">{item.product.discount}% OFF</p>
                            )}
                          </div>
                          <button 
                            onClick={() => removeItem(item.product._id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${itemTotal.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Total</p>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid md:grid-cols-12 md:gap-6 md:items-center">
                        <div className="col-span-1">
                          <div className="w-16 h-16 relative">
                            {item.product.images && item.product.images.length > 0 && (
                              <>
                                {item.product.images[0]._type === 'image' && item.product.images[0].asset ? (
                                  <Image
                                    src={urlFor(item.product.images[0]).url()}
                                    alt={item.product.name || 'Product'}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                ) : item.product.images[0]._type === 'imageUrl' && item.product.images[0].url ? (
                                  <Image
                                    src={item.product.images[0].url}
                                    alt={item.product.images[0].alt || item.product.name || 'Product'}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No Image</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="col-span-4 ml-4">
                          <h3 className="font-medium text-gray-900 text-sm leading-tight">{item.product.name}</h3>
                          
                          {/* Deal Indicator */}
                          {item.product.isOnDeal && item.product.dealPercentage && (
                            <div className="mt-1">
                              <span className="text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded">
                                🔥 DEAL {item.product.dealPercentage}% OFF - No Coupons
                              </span>
                            </div>
                          )}
                          
                          {/* Regular discount indicator - only show if not on deal */}
                          {!item.product.isOnDeal && item.product.discount && item.product.discount > 0 && (
                            <p className="text-xs text-green-600">{item.product.discount}% OFF</p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm text-gray-600">{item.product.sku || 'N/A'}</span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className={`font-semibold ${
                            item.product.isOnDeal ? 'text-red-600' : 'text-gray-900'
                          }`}>${price.toFixed(2)}</span>
                          {item.product.originalPrice && (
                            (item.product.isOnDeal && item.product.dealPercentage && item.product.dealPercentage > 0) ||
                            (!item.product.isOnDeal && item.product.discount && item.product.discount > 0)
                          ) && (
                            <span className="text-xs text-gray-500 line-through block">
                              ${item.product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="col-span-1">
                          <button 
                            onClick={() => removeItem(item.product._id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Coupon and Voucher Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Apply Coupon Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Apply Coupon Code
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Apply Coupon
                  </button>
                </div>
                
                {/* Applied Coupons Display - directly under input */}
                {appliedCoupons.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 text-sm mb-2">Applied Coupons:</h4>
                    <div className="space-y-2">
                      {appliedCoupons.map((coupon, index) => (
                        <div key={`${coupon.code}-${coupon.productId}-${index}`} className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200">
                          <div className="flex-1">
                            <span className="font-medium text-green-800 text-sm">{coupon.code}</span>
                            <p className="text-xs text-green-600">
                              {coupon.discount}% off on {coupon.productName}
                            </p>
                          </div>
                          <button
                            onClick={() => removeCoupon(coupon.productId, coupon.code)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove coupon"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Voucher Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Percent className="w-5 h-5" />
                  Apply Voucher
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Enter voucher code"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handleApplyVoucher}
                    className="px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Apply Voucher
                  </button>
                </div>
                
                {/* Applied Voucher Display - directly under input */}
                {appliedVoucher && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 text-sm mb-2">Applied Voucher:</h4>
                    <div className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-200">
                      <div className="flex-1">
                        <span className="font-medium text-blue-800 text-sm">{appliedVoucher.code}</span>
                        <p className="text-xs text-blue-600">
                          {appliedVoucher.discount}% discount applied
                        </p>
                      </div>
                      <button
                        onClick={removeVoucher}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove voucher"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <a href="/shop" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors">
                <span>←</span>
                Continue Shopping
              </a>
            </div>

            {/* Additional Info Section to maintain height balance */}
            <div className="mt-6 space-y-4" style={{minHeight: '600px'}}>
              {/* Extra spacing for height */}
              <div className="h-16"></div>
              {/* Security & Trust Badges */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Shopping with Confidence</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-8 h-8 text-green-500 mb-2" />
                    <span className="text-xs text-gray-600">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-xs text-gray-600">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CreditCard className="w-8 h-8 text-purple-500 mb-2" />
                    <span className="text-xs text-gray-600">Easy Returns</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShoppingBag className="w-8 h-8 text-orange-500 mb-2" />
                    <span className="text-xs text-gray-600">Quality Products</span>
                  </div>
                </div>
              </div>

              {/* Additional Information Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Shipping Info */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Free shipping on orders over $50</p>
                    <p>• Express delivery available</p>
                    <p>• Track your order in real-time</p>
                  </div>
                </div>

                {/* Return Policy */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Return Policy</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• 30-day return window</p>
                    <p>• Free returns on all items</p>
                    <p>• Easy online return process</p>
                  </div>
                </div>
              </div>

              {/* Customer Support */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <div className="text-sm text-gray-600">
                  <p>Our customer support team is available 24/7 to assist you with any questions or concerns.</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-orange-500 font-medium">📞 1-800-SUPPORT</span>
                    <span className="text-orange-500 font-medium">📧 help@store.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotalWithoutCoupons.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="font-medium text-green-600">-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                {voucherDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voucher Discount</span>
                    <span className="font-medium text-blue-600">-${voucherDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

{/* Default Delivery Address */}
              {defaultAddress ? (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p className="font-medium text-gray-900">{defaultAddress.name}</p>
                    <p>{defaultAddress.streetAddress}</p>
                    {defaultAddress.apartment && <p>{defaultAddress.apartment}</p>}
                    <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}</p>
                    <p>{defaultAddress.country}</p>
                    <p>{defaultAddress.phone}</p>
                  </div>
                  <a 
                    href="/account/addresses" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    Change Address
                  </a>
                </div>
              ) : (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </h4>
                  <a 
                    href="/account/addresses" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    Add Address
                  </a>
                </div>
              )}
              
              {/* Checkout Button */}
              <a href="/checkout" className="block w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium text-center">
                Next Step
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartClientPage