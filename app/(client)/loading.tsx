"use client";
import React from 'react';
import { ShoppingBag, Package, Truck, CreditCard } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-custom-body flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-8 h-8 bg-custom-navBar rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-custom-sec1 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-custom-sec2 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-10 h-10 bg-custom-sec3 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Main Loading Container */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-custom-sec3/20 max-w-md mx-auto">
          
          {/* Logo Area */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-custom-navBar to-custom-sec1 rounded-2xl mx-auto flex items-center justify-center mb-4 animate-bounce">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-custom-navBar mb-2">Shop</h1>
            <p className="text-custom-navBar/70 text-sm">Loading your shopping experience...</p>
          </div>

          {/* Animated Icons */}
          <div className="flex justify-center space-x-6 mb-8">
            <div className="animate-pulse delay-100">
              <div className="w-12 h-12 bg-custom-sec1/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-custom-navBar animate-bounce delay-200" />
              </div>
            </div>
            <div className="animate-pulse delay-300">
              <div className="w-12 h-12 bg-custom-sec2/20 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-custom-navBar animate-bounce delay-400" />
              </div>
            </div>
            <div className="animate-pulse delay-500">
              <div className="w-12 h-12 bg-custom-sec3/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-custom-navBar animate-bounce delay-600" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-custom-sec4/30 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-custom-navBar via-custom-sec1 to-custom-sec2 rounded-full animate-progress"></div>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-custom-navBar rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-custom-navBar rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-custom-navBar rounded-full animate-bounce delay-200"></div>
          </div>

          {/* Loading Text */}
          <div className="text-custom-navBar/80 text-sm animate-pulse">
            Preparing your products...
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-custom-sec1/20 rounded-full animate-ping"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-custom-sec2/20 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/2 -left-8 w-4 h-4 bg-custom-sec3/20 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-1/2 -right-8 w-4 h-4 bg-custom-sec4/20 rounded-full animate-ping delay-700"></div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
