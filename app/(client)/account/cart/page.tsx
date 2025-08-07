"use client"
import React, { useState } from 'react'
import { Trash2, Plus, Minus, ShoppingCart, Tag, X } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import useCartStore from '@/store'

const AccountCartPage = () => {
  const { user, isLoaded } = useUser()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotalPrice, 
    getItemPrice,
  } = useCartStore()

  // Apply coupon function (placeholder)
  const applyCoupon = () => {
    if (couponCode.trim()) {
      // This is a placeholder - implement actual coupon logic
      if (couponCode.toLowerCase() === 'welcome10') {
        setAppliedCoupon(couponCode)
        setCouponDiscount(10) // 10% discount
        setCouponCode('')
      } else {
        alert('Invalid coupon code')
      }
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-12">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
          <a href="/" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  const total = getTotalPrice()

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shopping Cart</h2>
      
      <div className="space-y-4">
        {/* Cart Items */}
        {items.map((item) => {
          const price = getItemPrice(item);
          const itemTotal = price * item.quantity;
          
          return (
            <div key={item.product._id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
              {/* Mobile Layout */}
              <div className="flex gap-3 sm:hidden">
                {/* Product Image */}
                <div className="w-16 h-16 relative flex-shrink-0">
                  {item.product.images && item.product.images.length > 0 && (
                    <Image
                      src={item.product.images[0] || "/placeholder-product.svg"}
                      alt={item.product.name || 'Product'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1 text-sm break-words">{item.product.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{item.product.sku || 'N/A'}</p>
                  <p className="font-semibold text-gray-900 text-sm">${price.toFixed(2)}</p>
                  {item.product.discount && item.product.discount > 0 && (
                    <p className="text-xs text-green-600">{item.product.discount}% OFF</p>
                  )}
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 hover:text-red-700 p-1 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Bottom Section */}
              <div className="flex items-center justify-between sm:hidden">
                {/* Quantity Controls */}
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

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${itemTotal.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex sm:items-center sm:gap-4">
                {/* Product Image */}
                <div className="w-16 h-16 relative flex-shrink-0">
                  {item.product.images && item.product.images.length > 0 && (
                    <Image
                      src={item.product.images[0] || "/placeholder-product.svg"}
                      alt={item.product.name || 'Product'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.sku || 'N/A'}</p>
                  <p className="font-semibold text-gray-900">${price.toFixed(2)}</p>
                  {item.product.discount && item.product.discount > 0 && (
                    <p className="text-xs text-green-600">{item.product.discount}% OFF</p>
                  )}
                </div>

                {/* Quantity Controls */}
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

                {/* Item Total */}
                <div className="text-right min-w-[80px]">
                  <p className="font-semibold text-gray-900">${itemTotal.toFixed(2)}</p>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        })}

        {/* Coupon Section */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-800">Promo Code</h3>
          </div>
          
          {!appliedCoupon ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
              />
              <button
                onClick={applyCoupon}
                disabled={!couponCode.trim()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <div>
                <p className="text-green-800 font-medium">✓ Coupon "{appliedCoupon}" Applied</p>
                <p className="text-sm text-green-600">{couponDiscount}% discount applied</p>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Try code "WELCOME10" for 10% off your first order
          </p>
        </div>

        {/* Order Summary */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({items.length} items)</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({couponDiscount}%)</span>
                <span>-${(total * couponDiscount / 100).toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">Calculated at checkout</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-orange-600">
                ${appliedCoupon ? (total * (1 - couponDiscount / 100)).toFixed(2) : total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link 
            href="/" 
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
          >
            Continue Shopping
          </Link>
          <button 
            className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm"
            onClick={() => {
              // Placeholder for checkout functionality
              alert('Checkout functionality will be implemented soon!')
            }}
          >
            Proceed to Checkout
          </button>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                {user.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-blue-800 font-medium">
                  Shopping as {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-blue-600">
                  {user.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountCartPage
