"use client"
import React from 'react'
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import useCartStore from '@/store'

const AccountCartPage = () => {
  const { user } = useUser()
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotalPrice, 
    getItemPrice,
  } = useCartStore()

  // Check if user is logged in
  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to view your cart</h2>
          <p className="text-gray-600">You need to be logged in to access your shopping cart.</p>
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
                      src={item.product.images[0]}
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
                      src={item.product.images[0]}
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

        {/* Coupon/Voucher Status */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✓ Coupon Applied</p>
          <p className="text-sm text-green-600">Discounts have been applied to your cart</p>
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-orange-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <a href="/" className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-center">
            Continue Shopping
          </a>
          <button className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountCartPage
