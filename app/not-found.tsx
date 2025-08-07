"use client";

import Container from "@/components/common/Container";
import { ShoppingBag, Home, Search, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from 'react';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Container className="py-16 lg:py-24">
        <div className="text-center space-y-6">
          {/* 404 Icon */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-orange-500" />
            </div>
          </div>
          
          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-8xl font-bold text-gray-800">404</h1>
            <h2 className="text-2xl lg:text-4xl font-semibold text-gray-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            
            <button 
              onClick={() => router.push('/category')}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Looking for something specific?</p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search our store..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Search className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            <p>If you believe this is an error, please contact our support team.</p>
            <p className="mt-2">
              <Link href="/contactus" className="text-orange-500 hover:text-orange-600 underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
