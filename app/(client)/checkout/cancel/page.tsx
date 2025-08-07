"use client";
import React from "react";

const CancelPage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
      <h2 className="text-2xl font-semibold text-red-800 mb-2">Payment Canceled</h2>
      <p className="text-gray-600 mb-6">
        Your payment was canceled. You can try again or continue shopping.
      </p>
      <div className="space-x-4">
        <a href="/checkout" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
          Try Again
        </a>
        <a href="/shop" className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
          Continue Shopping
        </a>
      </div>
    </div>
  );
};

export default CancelPage;
