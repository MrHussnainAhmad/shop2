"use client";
import React from 'react';
import { ShoppingBag, Package, Truck, CreditCard } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-custom-body flex items-center justify-center relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-custom-sec1/20 rounded-full animate-float mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-custom-sec2/20 rounded-full animate-float-delay mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-custom-sec3/20 rounded-full animate-float mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Main Loader */}
        <div className="relative w-48 h-48">
          {/* Rotating Border */}
          <div className="absolute inset-0 border-4 border-custom-sec1/30 border-t-custom-navBar rounded-full animate-spin-slow"></div>
          
          {/* Main Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-custom-navBar" />
            </div>
          </div>
          
          {/* Floating Icons */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center">
              <Package className="w-6 h-6 text-custom-sec1" />
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-float-delay-2">
            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center">
              <Truck className="w-6 h-6 text-custom-sec2" />
            </div>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 animate-float-delay-4">
            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-custom-sec3" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-8 text-custom-navBar/80 text-lg font-medium animate-pulse">
          Loading your shopping experience...
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-15deg); }
        }
        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite delay-1s;
        }
        .animate-float-delay-2 {
          animation: float 5s ease-in-out infinite delay-2s;
        }
        .animate-float-delay-4 {
          animation: float 5s ease-in-out infinite delay-4s;
        }
      `}</style>
    </div>
  );
};

export default Loading;
