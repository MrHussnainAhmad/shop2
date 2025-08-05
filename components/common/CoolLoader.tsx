"use client";
import React from 'react';
import { ShoppingBag, Heart, Star, Zap } from 'lucide-react';

interface CoolLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'pulse' | 'orbit' | 'wave';
  text?: string;
  showText?: boolean;
}

const CoolLoader: React.FC<CoolLoaderProps> = ({ 
  size = 'md', 
  variant = 'default', 
  text = 'Loading...', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const renderDefaultLoader = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Rotating ring */}
        <div className="absolute inset-0 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className={`${iconSizes[size]} text-orange-600`} />
        </div>
      </div>
      {showText && <p className="mt-4 text-gray-600 animate-pulse">{text}</p>}
    </div>
  );

  const renderPulseLoader = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Pulsing circles */}
        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-2 bg-orange-400 rounded-full animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute inset-4 bg-orange-300 rounded-full animate-ping opacity-25" style={{animationDelay: '1s'}}></div>
        
        {/* Center icon */}
        <div className="relative bg-white rounded-full shadow-lg flex items-center justify-center" style={{margin: '16px'}}>
          <Heart className={`${iconSizes[size]} text-red-500 animate-pulse`} />
        </div>
      </div>
      {showText && <p className="mt-4 text-gray-600 animate-pulse">{text}</p>}
    </div>
  );

  const renderOrbitLoader = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Orbiting elements */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full shadow-lg p-4">
            <Star className={`${iconSizes[size]} text-yellow-500 animate-spin-slow`} />
          </div>
        </div>
      </div>
      {showText && <p className="mt-4 text-gray-600 animate-pulse">{text}</p>}
    </div>
  );

  const renderWaveLoader = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-16 bg-gradient-to-t from-orange-500 to-orange-300 rounded-full animate-wave"
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Zap className="w-6 h-6 text-orange-500 animate-pulse" />
        {showText && <p className="text-gray-600 animate-pulse">{text}</p>}
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'pulse':
        return renderPulseLoader();
      case 'orbit':
        return renderOrbitLoader();
      case 'wave':
        return renderWaveLoader();
      default:
        return renderDefaultLoader();
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      {renderLoader()}
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes wave {
          0%, 40%, 100% { transform: scaleY(0.4); }
          20% { transform: scaleY(1); }
        }
        .animate-wave {
          animation: wave 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CoolLoader;
