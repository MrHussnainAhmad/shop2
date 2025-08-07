"use client";

import { ShieldX, Home, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import React from 'react';

const AuthNotFoundPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Auth 404 Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldX className="w-12 h-12 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-4">
            Authentication Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The authentication page you&apos;re looking for doesn&apos;t exist. 
            You might have an outdated link or the page has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            <LogIn className="w-5 h-5" />
            Go to Login
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthNotFoundPage;
