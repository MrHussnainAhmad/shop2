'use client';

import React from 'react';
import Link from 'next/link';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'There was a problem with the authentication system.'}
        </p>
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link 
            href="/"
            className="block w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
